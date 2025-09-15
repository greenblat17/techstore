import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, desc, and, isNotNull } from "drizzle-orm";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductGridSkeleton } from "@/components/ui/skeletons";
import { Star, ShoppingCart, Heart } from "lucide-react";

async function getFeaturedProducts() {
  const featuredProducts = await db
    .select()
    .from(products)
    .where(and(eq(products.featured, true), eq(products.status, "active")))
    .orderBy(desc(products.createdAt))
    .limit(8);

  return featuredProducts;
}

async function FeaturedProductsContent() {
  const featuredProducts = await getFeaturedProducts();

  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => {
        const discount = product.salePrice
          ? Math.round(
              ((Number(product.price) - Number(product.salePrice)) /
                Number(product.price)) *
                100
            )
          : 0;

        return (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {product.images && product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No image
                  </div>
                )}
                {discount > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                    -{discount}%
                  </Badge>
                )}
                {product.stockQuantity === 0 && (
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    Out of Stock
                  </Badge>
                )}
                {product.stockQuantity && product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                  <Badge className="absolute top-2 left-2" variant="destructive">
                    Only {product.stockQuantity} left!
                  </Badge>
                )}
                
                {/* Quick Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                {product.brand && (
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {product.brand}
                  </p>
                )}
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">
                    ${product.salePrice || product.price}
                  </span>
                  {product.salePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
                {product.ratingAverage && Number(product.ratingAverage) > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.round(Number(product.ratingAverage))
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.ratingCount})
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export function FeaturedProductsSection() {
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground mt-2">
              Hand-picked items just for you
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>

        <Suspense fallback={<ProductGridSkeleton count={8} columns={4} />}>
          <FeaturedProductsContent />
        </Suspense>
      </div>
    </section>
  );
}