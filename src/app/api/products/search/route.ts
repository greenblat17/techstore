import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, and, ilike, or, desc, sql } from "drizzle-orm";

// GET /api/products/search - Advanced product search with suggestions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || "all"; // all, suggestions, products

    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        suggestions: [],
        categories: [],
      });
    }

    // Search products
    const productResults = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        shortDescription: products.shortDescription,
        price: products.price,
        salePrice: products.salePrice,
        images: products.images,
        brand: products.brand,
        stockQuantity: products.stockQuantity,
        ratingAverage: products.ratingAverage,
        ratingCount: products.ratingCount,
      })
      .from(products)
      .where(
        and(
          eq(products.status, "active"),
          or(
            ilike(products.name, `%${query}%`),
            ilike(products.description, `%${query}%`),
            ilike(products.shortDescription, `%${query}%`),
            ilike(products.brand, `%${query}%`),
            ilike(products.sku, `%${query}%`)
          )
        )
      )
      .orderBy(
        // Prioritize exact matches and name matches
        sql`
          CASE 
            WHEN LOWER(${products.name}) = LOWER(${query}) THEN 1
            WHEN LOWER(${products.name}) LIKE LOWER(${`${query}%`}) THEN 2
            WHEN LOWER(${products.name}) LIKE LOWER(${`%${query}%`}) THEN 3
            ELSE 4
          END
        `,
        desc(products.featured),
        desc(products.ratingAverage)
      )
      .limit(type === "suggestions" ? 5 : limit);

    // Search categories
    const categoryResults = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(categories)
      .where(
        and(
          eq(categories.isActive, true),
          or(
            ilike(categories.name, `%${query}%`),
            ilike(categories.description, `%${query}%`)
          )
        )
      )
      .limit(3);

    // Get search suggestions (distinct product names and brands)
    let suggestions: string[] = [];
    if (type === "all" || type === "suggestions") {
      const nameResults = await db
        .selectDistinct({ name: products.name })
        .from(products)
        .where(
          and(
            eq(products.status, "active"),
            ilike(products.name, `%${query}%`)
          )
        )
        .limit(5);

      const brandResults = await db
        .selectDistinct({ brand: products.brand })
        .from(products)
        .where(
          and(
            eq(products.status, "active"),
            ilike(products.brand, `%${query}%`)
          )
        )
        .limit(3);

      suggestions = [
        ...nameResults.map(r => r.name),
        ...brandResults.map(r => r.brand).filter(Boolean) as string[],
      ];

      // Remove duplicates and limit
      suggestions = [...new Set(suggestions)].slice(0, 8);
    }

    // Return different formats based on type
    if (type === "suggestions") {
      return NextResponse.json({
        suggestions: productResults.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          image: p.images?.[0] || null,
        })),
        terms: suggestions,
      });
    }

    return NextResponse.json({
      products: productResults,
      categories: categoryResults,
      suggestions,
      totalResults: productResults.length,
      query,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}