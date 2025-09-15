import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { carts, cartItems, products, customers } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

interface LocalCartItem {
  productId: string;
  quantity: number;
}

// POST /api/cart/sync - Sync local cart with database cart
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { localCart } = body as { localCart: LocalCartItem[] };

    if (!localCart || !Array.isArray(localCart)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Get customer record
    let customer = await db
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
      
      customer = newCustomer;
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

    // Get existing cart items
    const existingItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cart[0].id));

    // Create a map of existing items by product ID
    const existingItemsMap = new Map(
      existingItems.map(item => [item.productId, item])
    );

    // Get all product IDs from local cart
    const productIds = localCart.map(item => item.productId);
    
    if (productIds.length > 0) {
      // Verify all products exist and get their stock quantities
      const validProducts = await db
        .select()
        .from(products)
        .where(inArray(products.id, productIds));

      const productMap = new Map(
        validProducts.map(p => [p.id, p])
      );

      // Process each local cart item
      for (const localItem of localCart) {
        const product = productMap.get(localItem.productId);
        
        if (!product) {
          continue; // Skip invalid products
        }

        const existingItem = existingItemsMap.get(localItem.productId);

        if (existingItem) {
          // Merge quantities (take the max to preserve user intent)
          const newQuantity = Math.max(existingItem.quantity, localItem.quantity);
          
          // Check stock
          const finalQuantity = Math.min(newQuantity, product.stockQuantity);
          
          if (finalQuantity !== existingItem.quantity && finalQuantity > 0) {
            await db
              .update(cartItems)
              .set({
                quantity: finalQuantity,
                updatedAt: new Date(),
              })
              .where(eq(cartItems.id, existingItem.id));
          }
        } else {
          // Add new item if stock available
          const quantity = Math.min(localItem.quantity, product.stockQuantity);
          
          if (quantity > 0) {
            await db
              .insert(cartItems)
              .values({
                cartId: cart[0].id,
                productId: localItem.productId,
                quantity,
              });
          }
        }
      }
    }

    // Fetch updated cart
    const updatedItems = await db
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
    const total = updatedItems.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + (Number(price) * item.quantity);
    }, 0);

    return NextResponse.json({
      success: true,
      message: 'Cart synced successfully',
      cart: {
        cartId: cart[0].id,
        items: updatedItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          product: {
            ...item.product,
            price: Number(item.product.price),
            salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
          },
        })),
        total,
      },
    });
  } catch (error) {
    console.error('Error syncing cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}