import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Validation schema for updating categories
const updateCategorySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
  image: z.string().url().optional().nullable(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/categories/[id] - Get a single category by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if id is a UUID or a slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // Query category
    const category = await db
      .select()
      .from(categories)
      .where(isUuid ? eq(categories.id, id) : eq(categories.slug, id))
      .limit(1);

    if (category.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Get products in this category
    const categoryProducts = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        salePrice: products.salePrice,
        images: products.images,
        stockQuantity: products.stockQuantity,
      })
      .from(products)
      .where(eq(products.categoryId, category[0].id))
      .limit(20);

    // Get subcategories
    const subcategories = await db
      .select()
      .from(categories)
      .where(eq(categories.parentId, category[0].id));

    return NextResponse.json({
      category: category[0],
      subcategories,
      products: categoryProducts,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category (Admin only)
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

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    // Check if slug is being changed and if it already exists
    if (validatedData.slug && validatedData.slug !== existingCategory[0].slug) {
      const slugExists = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, validatedData.slug))
        .limit(1);

      if (slugExists.length > 0) {
        return NextResponse.json(
          { error: "Category with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Prevent category from being its own parent
    if (validatedData.parentId === id) {
      return NextResponse.json(
        { error: "Category cannot be its own parent" },
        { status: 400 }
      );
    }

    // Update the category
    const updatedCategory = await db
      .update(categories)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    return NextResponse.json({
      message: "Category updated successfully",
      category: updatedCategory[0],
    });
  } catch (error) {
    console.error("Error updating category:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid category data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category (Admin only)
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

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has subcategories
    const subcategories = await db
      .select()
      .from(categories)
      .where(eq(categories.parentId, id))
      .limit(1);

    if (subcategories.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with subcategories" },
        { status: 400 }
      );
    }

    // Check if category has products
    const categoryProducts = await db
      .select()
      .from(products)
      .where(eq(products.categoryId, id))
      .limit(1);

    if (categoryProducts.length > 0) {
      // Instead of hard delete, set category to inactive
      const deactivatedCategory = await db
        .update(categories)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(categories.id, id))
        .returning();

      return NextResponse.json({
        message: "Category deactivated (has products)",
        category: deactivatedCategory[0],
      });
    }

    // If no products, we can safely delete
    await db
      .delete(categories)
      .where(eq(categories.id, id));

    return NextResponse.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}