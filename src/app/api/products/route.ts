import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, and, gte, lte, ilike, or, desc, asc, sql, inArray } from "drizzle-orm";
import { z } from "zod";
import { cachedJsonResponse, CachePresets } from "@/lib/api-cache";

// Validation schema for creating/updating products
const productSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.string().or(z.number()).transform(val => String(val)),
  salePrice: z.string().or(z.number()).transform(val => val ? String(val) : null).optional().nullable(),
  sku: z.string().min(1).max(100),
  stockQuantity: z.number().int().min(0).default(0),
  categoryId: z.string().uuid().optional().nullable(),
  brand: z.string().max(255).optional(),
  images: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.any()).default({}),
  status: z.enum(["active", "inactive", "draft"]).default("active"),
  featured: z.boolean().default(false),
});

// GET /api/products - Get all products with filtering, sorting, and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    // Sorting parameters
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Filter parameters
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const brand = searchParams.get("brand");
    const featured = searchParams.get("featured");
    const status = searchParams.get("status") || "active";
    const inStock = searchParams.get("inStock");

    // Build WHERE conditions
    const conditions: any[] = [];

    // Search in name and description
    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`),
          ilike(products.shortDescription, `%${search}%`),
          ilike(products.brand, `%${search}%`)
        )
      );
    }

    // Category filter
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }

    // Price range filter
    if (minPrice) {
      conditions.push(gte(products.price, minPrice));
    }
    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice));
    }

    // Brand filter
    if (brand) {
      conditions.push(eq(products.brand, brand));
    }

    // Featured filter
    if (featured === "true") {
      conditions.push(eq(products.featured, true));
    }

    // Status filter
    if (status !== "all") {
      conditions.push(eq(products.status, status));
    }

    // In stock filter
    if (inStock === "true") {
      conditions.push(sql`${products.stockQuantity} > 0`);
    }

    // Build ORDER BY clause
    let orderByClause;
    switch (sortBy) {
      case "price":
        orderByClause = sortOrder === "asc" ? asc(products.price) : desc(products.price);
        break;
      case "name":
        orderByClause = sortOrder === "asc" ? asc(products.name) : desc(products.name);
        break;
      case "createdAt":
        orderByClause = sortOrder === "asc" ? asc(products.createdAt) : desc(products.createdAt);
        break;
      case "stockQuantity":
        orderByClause = sortOrder === "asc" ? asc(products.stockQuantity) : desc(products.stockQuantity);
        break;
      case "rating":
        orderByClause = sortOrder === "asc" ? asc(products.ratingAverage) : desc(products.ratingAverage);
        break;
      default:
        orderByClause = desc(products.createdAt);
    }

    // Execute query with pagination
    const [productList, totalCountResult] = await Promise.all([
      db
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
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),
      
      // Get total count for pagination
      db
        .select({ count: sql`count(*)::int` })
        .from(products)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
    ]);

    const totalCount = Number(totalCountResult[0]?.count || 0);
    const totalPages = Math.ceil(totalCount / limit);

    // Get unique brands for filter options
    const brandsResult = await db
      .selectDistinct({ brand: products.brand })
      .from(products)
      .where(eq(products.status, "active"));

    const brands = brandsResult
      .map(b => b.brand)
      .filter(Boolean);

    // Return cached response for public product listings
    return cachedJsonResponse(
      {
        products: productList,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        filters: {
          brands,
        },
      },
      CachePresets.PRODUCTS
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (Admin only)
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
    const validatedData = productSchema.parse(body);

    // Check if SKU already exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.sku, validatedData.sku))
      .limit(1);

    if (existingProduct.length > 0) {
      return NextResponse.json(
        { error: "Product with this SKU already exists" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingSlug = await db
      .select()
      .from(products)
      .where(eq(products.slug, validatedData.slug))
      .limit(1);

    if (existingSlug.length > 0) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 400 }
      );
    }

    // Create the product
    const newProduct = await db
      .insert(products)
      .values({
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      {
        message: "Product created successfully",
        product: newProduct[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid product data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}