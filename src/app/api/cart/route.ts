import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { carts, cartItems, products, customers } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// GET /api/cart - Get current user's cart
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
      return NextResponse.json({ items: [], total: 0 });
    }

    // Get or create cart for the customer
    let cart = await db
      .select()
      .from(carts)
      .where(eq(carts.customerId, customer[0].id))
      .limit(1);

    if (cart.length === 0) {
      // Create a new cart
      const newCart = await db
        .insert(carts)
        .values({
          customerId: customer[0].id,
        })
        .returning();
      cart = newCart;
    }

    // Get cart items with product details
    const items = await db
      .select({
        id: cartItems.id,
        cartId: cartItems.cartId,
        quantity: cartItems.quantity,
        product: {
          id: products.id,
          name: products.name,
          slug: products.slug,
          price: products.price,
          salePrice: products.salePrice,
          images: products.images,
          stockQuantity: products.stockQuantity,
        },
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart[0].id));

    // Calculate total
    const total = items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + (Number(price) * item.quantity);
    }, 0);

    return NextResponse.json({
      cartId: cart[0].id,
      items: items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          ...item.product,
          price: Number(item.product.price),
          salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
        },
      })),
      total,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId || quantity < 1) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Get customer record
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.clerkId, userId))
      .limit(1);

    if (customer.length === 0) {
      // Create customer if doesn't exist
      const userResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });
      const userData = await userResponse.json();

      const newCustomer = await db
        .insert(customers)
        .values({
          clerkId: userId,
          email: userData.email_addresses[0].email_address,
          firstName: userData.first_name,
          lastName: userData.last_name,
        })
        .returning();
      
      customer[0] = newCustomer[0];
    }

    // Check product exists and has stock
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product[0].stockQuantity < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    // Get or create cart
    let cart = await db
      .select()
      .from(carts)
      .where(eq(carts.customerId, customer[0].id))
      .limit(1);

    if (cart.length === 0) {
      const newCart = await db
        .insert(carts)
        .values({
          customerId: customer[0].id,
        })
        .returning();
      cart = newCart;
    }

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cart[0].id),
          eq(cartItems.productId, productId)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      const newQuantity = existingItem[0].quantity + quantity;
      
      if (product[0].stockQuantity < newQuantity) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
      }

      await db
        .update(cartItems)
        .set({
          quantity: newQuantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem[0].id));

      return NextResponse.json({ 
        success: true, 
        message: 'Cart updated',
        cartItemId: existingItem[0].id,
        quantity: newQuantity,
      });
    } else {
      // Add new item
      const newItem = await db
        .insert(cartItems)
        .values({
          cartId: cart[0].id,
          productId,
          quantity,
        })
        .returning();

      return NextResponse.json({ 
        success: true, 
        message: 'Item added to cart',
        cartItemId: newItem[0].id,
        quantity,
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || quantity < 0) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Get customer
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.clerkId, userId))
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Verify cart item belongs to customer
    const cartItem = await db
      .select({
        item: cartItems,
        cart: carts,
        product: products,
      })
      .from(cartItems)
      .innerJoin(carts, eq(cartItems.cartId, carts.id))
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(carts.customerId, customer[0].id)
        )
      )
      .limit(1);

    if (cartItem.length === 0) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // If quantity is 0, delete the item
    if (quantity === 0) {
      await db
        .delete(cartItems)
        .where(eq(cartItems.id, cartItemId));

      return NextResponse.json({ 
        success: true, 
        message: 'Item removed from cart',
      });
    }

    // Check stock
    if (cartItem[0].product.stockQuantity < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    // Update quantity
    await db
      .update(cartItems)
      .set({
        quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, cartItemId));

    return NextResponse.json({ 
      success: true, 
      message: 'Cart updated',
      quantity,
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/cart/:id - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const cartItemId = url.searchParams.get('id');

    if (!cartItemId) {
      return NextResponse.json({ error: 'Cart item ID required' }, { status: 400 });
    }

    // Get customer
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.clerkId, userId))
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Verify cart item belongs to customer
    const cartItem = await db
      .select()
      .from(cartItems)
      .innerJoin(carts, eq(cartItems.cartId, carts.id))
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(carts.customerId, customer[0].id)
        )
      )
      .limit(1);

    if (cartItem.length === 0) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Delete the item
    await db
      .delete(cartItems)
      .where(eq(cartItems.id, cartItemId));

    return NextResponse.json({ 
      success: true, 
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}