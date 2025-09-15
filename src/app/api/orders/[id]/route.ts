import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { orders, orderItems, products, customers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/orders/[id] - Get a single order
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Get customer record
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.clerkId, userId))
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get order with verification that it belongs to the customer
    const order = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.id, id),
          eq(orders.customerId, customer[0].id)
        )
      )
      .limit(1);

    if (order.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get order items with product details
    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        price: orderItems.price,
        total: orderItems.total,
        product: {
          id: products.id,
          name: products.name,
          slug: products.slug,
          images: products.images,
          sku: products.sku,
        },
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id));

    return NextResponse.json({
      order: {
        ...order[0],
        subtotal: Number(order[0].subtotal),
        tax: Number(order[0].tax),
        shipping: Number(order[0].shipping),
        total: Number(order[0].total),
        items: items.map(item => ({
          ...item,
          price: Number(item.price),
          total: Number(item.total),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/orders/[id] - Update order status (admin only in production)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { status, paymentStatus } = body;

    // Get customer record
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.clerkId, userId))
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // For production, you'd check if user is admin here
    // For now, we'll allow customers to cancel their own orders
    
    // Get order to verify ownership
    const order = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.id, id),
          eq(orders.customerId, customer[0].id)
        )
      )
      .limit(1);

    if (order.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Only allow cancellation if order is pending
    if (status === 'cancelled' && order[0].status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only cancel pending orders' },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await db
      .update(orders)
      .set({
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    // If order is cancelled, restore inventory
    if (status === 'cancelled') {
      const items = await db
        .select({
          orderItem: orderItems,
          product: products,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, id));

      // Restore stock for each item
      for (const item of items) {
        await db
          .update(products)
          .set({
            stockQuantity: item.product.stockQuantity + item.orderItem.quantity,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.product.id));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: {
        ...updatedOrder[0],
        subtotal: Number(updatedOrder[0].subtotal),
        tax: Number(updatedOrder[0].tax),
        shipping: Number(updatedOrder[0].shipping),
        total: Number(updatedOrder[0].total),
      },
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}