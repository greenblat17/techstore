import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Validation schema for updating products
const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.string().or(z.number()).transform(val => val ? String(val) : undefined).optional(),
  salePrice: z.string().or(z.number()).transform(val => val ? String(val) : null).optional().nullable(),
  sku: z.string().min(1).max(100).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  brand: z.string().max(255).optional(),
  images: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  status: z.enum(["active", "inactive", "draft"]).optional(),
  featured: z.boolean().optional(),
});

// GET /api/products/[id] - Get a single product by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if id is a UUID or a slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // Query product with category info
    const product = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        salePrice: products.salePrice,
        sku: products.sku,
        stockQuantity: products.stockQuantity,
        categoryId: products.categoryId,
        category: categories.name,
        categorySlug: categories.slug,
        brand: products.brand,
        images: products.images,
        specifications: products.specifications,
        status: products.status,
        featured: products.featured,
        ratingAverage: products.ratingAverage,
        ratingCount: products.ratingCount,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(isUuid ? eq(products.id, id) : eq(products.slug, id))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Get related products from the same category
    let relatedProducts: any[] = [];
    if (product[0].categoryId) {
      relatedProducts = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          shortDescription: products.shortDescription,
          price: products.price,
          salePrice: products.salePrice,
          images: products.images,
          ratingAverage: products.ratingAverage,
          ratingCount: products.ratingCount,
        })
        .from(products)
        .where(eq(products.categoryId, product[0].categoryId))
        .limit(4);

      // Remove current product from related products
      relatedProducts = relatedProducts.filter(p => p.id !== product[0].id);
    }

    return NextResponse.json({
      product: product[0],
      relatedProducts,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in" },
        { status: 401 }
      );
    }

    // Type assertion for sessionClaims
    const claims = sessionClaims as { metadata?: { role?: string } };
    if (claims?.metadata?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    // Check if SKU is being changed and if it already exists
    if (validatedData.sku && validatedData.sku !== existingProduct[0].sku) {
      const skuExists = await db
        .select()
        .from(products)
        .where(eq(products.sku, validatedData.sku))
        .limit(1);

      if (skuExists.length > 0) {
        return NextResponse.json(
          { error: "Product with this SKU already exists" },
          { status: 400 }
        );
      }
    }

    // Check if slug is being changed and if it already exists
    if (validatedData.slug && validatedData.slug !== existingProduct[0].slug) {
      const slugExists = await db
        .select()
        .from(products)
        .where(eq(products.slug, validatedData.slug))
        .limit(1);

      if (slugExists.length > 0) {
        return NextResponse.json(
          { error: "Product with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update the product
    const updatedProduct = await db
      .update(products)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct[0],
    });
  } catch (error) {
    console.error("Error updating product:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid product data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in" },
        { status: 401 }
      );
    }

    // Type assertion for sessionClaims
    const claims = sessionClaims as { metadata?: { role?: string } };
    if (claims?.metadata?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Instead of hard delete, we'll set status to inactive
    // This preserves data integrity for existing orders
    const deletedProduct = await db
      .update(products)
      .set({
        status: "inactive",
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json({
      message: "Product deleted successfully",
      product: deletedProduct[0],
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}