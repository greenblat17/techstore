import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, isNull, asc, desc } from "drizzle-orm";
import { z } from "zod";
import { cachedJsonResponse, CachePresets } from "@/lib/api-cache";

// Validation schema for creating categories
const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
  image: z.string().url().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/categories - Get all categories with optional hierarchy
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get("includeInactive") === "true";
    const asTree = searchParams.get("tree") === "true";
    
    // Build conditions
    const conditions = [];
    if (!includeInactive) {
      conditions.push(eq(categories.isActive, true));
    }
    
    // Get all categories
    const categoryList = await db
      .select()
      .from(categories)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(asc(categories.displayOrder), asc(categories.name));
    
    if (asTree) {
      // Build category tree
      const categoryMap = new Map();
      const tree: any[] = [];
      
      // First pass: create map of all categories
      categoryList.forEach(cat => {
        categoryMap.set(cat.id, { ...cat, children: [] });
      });
      
      // Second pass: build tree structure
      categoryList.forEach(cat => {
        const category = categoryMap.get(cat.id);
        if (cat.parentId) {
          const parent = categoryMap.get(cat.parentId);
          if (parent) {
            parent.children.push(category);
          }
        } else {
          tree.push(category);
        }
      });
      
      return cachedJsonResponse(
        { categories: tree },
        CachePresets.CATEGORIES
      );
    }
    
    return cachedJsonResponse(
      { categories: categoryList },
      CachePresets.CATEGORIES
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category (Admin only)
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);
    
    // Check if slug already exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, validatedData.slug))
      .limit(1);
    
    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }
    
    // Create the category
    const newCategory = await db
      .insert(categories)
      .values(validatedData)
      .returning();
    
    return NextResponse.json(
      {
        message: "Category created successfully",
        category: newCategory[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid category data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}