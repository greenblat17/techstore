import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

// GET /api/products/featured - Get featured and trending products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "featured"; // featured, bestsellers, new, sale
    const limit = parseInt(searchParams.get("limit") || "8");

    let productList: any[] = [];

    switch (type) {
      case "featured":
        // Get featured products
        productList = await db
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
            category: categories.name,
            categorySlug: categories.slug,
          })
          .from(products)
          .leftJoin(categories, eq(products.categoryId, categories.id))
          .where(
            and(
              eq(products.status, "active"),
              eq(products.featured, true),
              sql`${products.stockQuantity} > 0`
            )
          )
          .orderBy(desc(products.ratingAverage), desc(products.createdAt))
          .limit(limit);
        break;

      case "bestsellers":
        // Get best-selling products (based on rating count as proxy for popularity)
        productList = await db
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
            category: categories.name,
            categorySlug: categories.slug,
          })
          .from(products)
          .leftJoin(categories, eq(products.categoryId, categories.id))
          .where(
            and(
              eq(products.status, "active"),
              sql`${products.stockQuantity} > 0`,
              sql`${products.ratingCount} > 0`
            )
          )
          .orderBy(desc(products.ratingCount), desc(products.ratingAverage))
          .limit(limit);
        break;

      case "new":
        // Get newest products
        productList = await db
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
            category: categories.name,
            categorySlug: categories.slug,
          })
          .from(products)
          .leftJoin(categories, eq(products.categoryId, categories.id))
          .where(
            and(
              eq(products.status, "active"),
              sql`${products.stockQuantity} > 0`
            )
          )
          .orderBy(desc(products.createdAt))
          .limit(limit);
        break;

      case "sale":
        // Get products on sale
        productList = await db
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
            category: categories.name,
            categorySlug: categories.slug,
            discount: sql<number>`
              CASE 
                WHEN ${products.salePrice} IS NOT NULL 
                THEN ROUND(((${products.price}::numeric - ${products.salePrice}::numeric) / ${products.price}::numeric * 100)::numeric, 0)
                ELSE 0
              END
            `,
          })
          .from(products)
          .leftJoin(categories, eq(products.categoryId, categories.id))
          .where(
            and(
              eq(products.status, "active"),
              sql`${products.stockQuantity} > 0`,
              sql`${products.salePrice} IS NOT NULL`,
              sql`${products.salePrice} < ${products.price}`
            )
          )
          .orderBy(
            sql`((${products.price}::numeric - ${products.salePrice}::numeric) / ${products.price}::numeric) DESC`,
            desc(products.ratingAverage)
          )
          .limit(limit);
        break;

      default:
        productList = [];
    }

    return NextResponse.json({
      type,
      products: productList,
      count: productList.length,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}