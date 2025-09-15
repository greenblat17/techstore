import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { orders, orderItems, products, customers, carts, cartItems } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for creating an order
const createOrderSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
  billingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }).optional(),
  paymentMethod: z.enum(['card', 'paypal', 'cash_on_delivery']).default('cash_on_delivery'),
  notes: z.string().optional(),
});

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer record
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.clerkId, userId))
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Get orders with items
    const userOrders = await db
      .select({
        order: orders,
        items: sql<any>`
          COALESCE(
            json_agg(
              json_build_object(
                'id', ${orderItems.id},
                'productId', ${orderItems.productId},
                'quantity', ${orderItems.quantity},
                'price', ${orderItems.price},
                'total', ${orderItems.total},
                'product', json_build_object(
                  'name', ${products.name},
                  'slug', ${products.slug},
                  'images', ${products.images}
                )
              )
            ) FILTER (WHERE ${orderItems.id} IS NOT NULL),
            '[]'::json
          )
        `,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orders.customerId, customer[0].id))
      .groupBy(orders.id)
      .orderBy(desc(orders.createdAt));

    return NextResponse.json({
      orders: userOrders.map(({ order, items }) => ({
        ...order,
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        shipping: Number(order.shipping),
        total: Number(order.total),
        items: items || [],
      })),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = createOrderSchema.parse(body);

    // Get customer record
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.clerkId, userId))
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get customer's cart
    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.customerId, customer[0].id))
      .limit(1);

    if (cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Get cart items with product details
    const items = await db
      .select({
        cartItem: cartItems,
        product: products,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart[0].id));

    if (items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Calculate order totals
      let subtotal = 0;
      const orderItemsData = [];

      // Check stock and prepare order items
      for (const item of items) {
        // Check stock availability
        if (item.product.stockQuantity < item.cartItem.quantity) {
          throw new Error(`Insufficient stock for ${item.product.name}`);
        }

        const itemPrice = item.product.salePrice || item.product.price;
        const itemTotal = Number(itemPrice) * item.cartItem.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          productId: item.product.id,
          quantity: item.cartItem.quantity,
          price: itemPrice,
          total: itemTotal.toString(),
        });

        // Update product stock
        await tx
          .update(products)
          .set({
            stockQuantity: item.product.stockQuantity - item.cartItem.quantity,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.product.id));
      }

      // Calculate tax and shipping
      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
      const total = subtotal + tax + shipping;

      // Create order
      const newOrder = await tx
        .insert(orders)
        .values({
          customerId: customer[0].id,
          orderNumber: generateOrderNumber(),
          status: 'pending',
          subtotal: subtotal.toString(),
          tax: tax.toString(),
          shipping: shipping.toString(),
          total: total.toString(),
          shippingAddress: validatedData.shippingAddress,
          billingAddress: validatedData.billingAddress || validatedData.shippingAddress,
          paymentMethod: validatedData.paymentMethod,
          paymentStatus: 'pending',
          notes: validatedData.notes,
        })
        .returning();

      // Create order items
      const newOrderItems = await tx
        .insert(orderItems)
        .values(
          orderItemsData.map(item => ({
            orderId: newOrder[0].id,
            ...item,
          }))
        )
        .returning();

      // Clear the cart
      await tx
        .delete(cartItems)
        .where(eq(cartItems.cartId, cart[0].id));

      return {
        order: newOrder[0],
        items: newOrderItems,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        ...result.order,
        subtotal: Number(result.order.subtotal),
        tax: Number(result.order.tax),
        shipping: Number(result.order.shipping),
        total: Number(result.order.total),
        items: result.items.map(item => ({
          ...item,
          price: Number(item.price),
          total: Number(item.total),
        })),
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Insufficient stock')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}