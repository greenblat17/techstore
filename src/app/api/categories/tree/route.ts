import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";

// GET /api/categories/tree - Get category tree with product counts
export async function GET(request: NextRequest) {
  try {
    // Get all active categories with product counts
    const categoriesWithCounts = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        parentId: categories.parentId,
        image: categories.image,
        displayOrder: categories.displayOrder,
        productCount: sql<number>`
          (SELECT COUNT(*) FROM ${products} 
           WHERE ${products.categoryId} = ${categories.id} 
           AND ${products.status} = 'active')::int
        `,
      })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.displayOrder, categories.name);

    // Build tree structure
    const categoryMap = new Map();
    const tree: any[] = [];

    // First pass: create map of all categories
    categoriesWithCounts.forEach(cat => {
      categoryMap.set(cat.id, {
        ...cat,
        children: [],
        totalProducts: cat.productCount, // Will be updated to include children
      });
    });

    // Second pass: build tree and calculate total products
    categoriesWithCounts.forEach(cat => {
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

    // Third pass: calculate total products including children
    function calculateTotalProducts(category: any): number {
      let total = category.productCount;
      for (const child of category.children) {
        total += calculateTotalProducts(child);
      }
      category.totalProducts = total;
      return total;
    }

    tree.forEach(cat => calculateTotalProducts(cat));

    // Get featured categories (top-level categories with most products)
    const featuredCategories = tree
      .filter(cat => cat.totalProducts > 0)
      .sort((a, b) => b.totalProducts - a.totalProducts)
      .slice(0, 6)
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        productCount: cat.totalProducts,
      }));

    return NextResponse.json({
      tree,
      featuredCategories,
      totalCategories: categoriesWithCounts.length,
    });
  } catch (error) {
    console.error("Error fetching category tree:", error);
    return NextResponse.json(
      { error: "Failed to fetch category tree" },
      { status: 500 }
    );
  }
}