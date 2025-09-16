import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";
import {
  Monitor,
  Smartphone,
  Watch,
  Camera,
  Gamepad2,
  Laptop,
  Speaker,
  Headphones,
  Package,
  ArrowRight,
} from "lucide-react";

// Fetch categories with product counts
async function getCategoriesWithCounts() {
  try {
    const categoriesWithCounts = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        image: categories.image,
        productCount: sql<number>`
          (SELECT COUNT(*) 
           FROM ${products} 
           WHERE ${products.categoryId} = ${categories.id} 
           AND ${products.status} = 'active')::int
        `,
      })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.displayOrder);

    return categoriesWithCounts;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Map category slugs to icons
const categoryIcons: Record<string, any> = {
  electronics: Monitor,
  smartphones: Smartphone,
  wearables: Watch,
  cameras: Camera,
  gaming: Gamepad2,
  laptops: Laptop,
  audio: Speaker,
  headphones: Headphones,
  accessories: Package,
  tablets: Monitor,
  monitors: Monitor,
  storage: Package,
  networking: Package,
  "smart-home": Package,
};

export default async function CategoriesPage() {
  const categoriesList = await getCategoriesWithCounts();

  return (
    <div className="container py-16">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Shop by Category
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse our wide selection of products organized by category. Find
          exactly what you&apos;re looking for.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoriesList.map((category) => {
          const Icon = categoryIcons[category.slug] || Package;
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    {category.productCount > 0 && (
                      <Badge variant="secondary">
                        {category.productCount}{" "}
                        {category.productCount === 1 ? "item" : "items"}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {category.description ||
                      `Explore our selection of ${category.name.toLowerCase()}`}
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm">
                    Browse Products
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {categoriesList.length === 0 && (
        <Card className="text-center py-16">
          <CardContent>
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              No Categories Available
            </h2>
            <p className="text-muted-foreground mb-6">
              We&apos;re currently updating our categories. Please check back
              soon!
            </p>
            <Link href="/products">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                View All Products
              </Badge>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Featured Categories Section */}
      {categoriesList.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesList.slice(0, 3).map((category) => {
              const Icon = categoryIcons[category.slug] || Package;
              return (
                <Card
                  key={category.id}
                  className="bg-gradient-to-br from-primary/5 to-primary/10"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-12 w-12 text-primary" />
                      <Badge className="bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {category.productCount} products available
                    </p>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="inline-flex items-center text-primary font-medium hover:underline"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
