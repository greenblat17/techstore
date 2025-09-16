import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  ArrowRight,
  Sparkles,
  Truck,
  Shield,
  CreditCard,
  Package,
  Clock,
  Star,
  TrendingUp,
  Zap,
  Gift,
  Headphones,
  Monitor,
  Smartphone,
  Watch,
  Camera,
  Gamepad2,
  Laptop,
  Speaker,
  Heart,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, desc, or, gt, and, sql } from "drizzle-orm";

// Parallel data fetching function
async function getHomePageData() {
  // Execute all queries in parallel
  const [featuredProducts, saleProducts, categoriesData] = await Promise.all([
    // Featured products query
    db
      .select()
      .from(products)
      .where(
        and(
          eq(products.status, "active"),
          or(eq(products.featured, true), gt(products.stockQuantity, 0))
        )
      )
      .orderBy(desc(products.featured), desc(products.createdAt))
      .limit(8)
      .catch((error) => {
        console.error("Error fetching featured products:", error);
        return [];
      }),

    // Sale products query
    db
      .select()
      .from(products)
      .where(
        and(
          eq(products.status, "active"),
          sql`${products.salePrice} IS NOT NULL`,
          gt(products.stockQuantity, 0)
        )
      )
      .orderBy(desc(products.createdAt))
      .limit(4)
      .catch((error) => {
        console.error("Error fetching sale products:", error);
        return [];
      }),

    // Categories query
    db
      .select()
      .from(categories)
      .orderBy(categories.displayOrder)
      .limit(6)
      .catch((error) => {
        console.error("Error fetching categories:", error);
        return [];
      }),
  ]);

  return {
    featuredProducts,
    saleProducts,
    categories: categoriesData,
  };
}

// Product Card Component (reuse existing)
function ProductCard({ product }: { product: any }) {
  const discountPercentage = product.salePrice
    ? Math.round(
        ((parseFloat(product.price) - parseFloat(product.salePrice)) /
          parseFloat(product.price)) *
          100
      )
    : 0;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border bg-card">
      {discountPercentage > 0 && (
        <Badge className="absolute top-2 left-2 z-10 bg-destructive text-destructive-foreground">
          -{discountPercentage}%
        </Badge>
      )}
      {product.featured && (
        <Badge className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground">
          <Sparkles className="h-3 w-3 mr-1" />
          Featured
        </Badge>
      )}

      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-square relative overflow-hidden bg-muted">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Package className="h-12 w-12" />
              </div>
            )}

            {/* Quick actions overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-background/90 backdrop-blur-sm hover:bg-background"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-background/90 backdrop-blur-sm hover:bg-background"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.brand && (
          <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
        )}

        {/* Rating */}
        {product.ratingAverage && parseFloat(product.ratingAverage) > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(parseFloat(product.ratingAverage))
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
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

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold text-primary">
                ${parseFloat(product.salePrice).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${parseFloat(product.price).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-foreground">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        {product.stockQuantity !== null && (
          <div className="text-xs">
            {product.stockQuantity === 0 ? (
              <span className="text-destructive font-medium">Out of Stock</span>
            ) : product.stockQuantity < 5 ? (
              <span className="text-warning font-medium">
                Only {product.stockQuantity} left
              </span>
            ) : (
              <span className="text-success font-medium">In Stock</span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default async function OptimizedHomePage() {
  // Fetch all data in parallel
  const {
    featuredProducts,
    saleProducts,
    categories: categoriesData,
  } = await getHomePageData();

  const categoryIcons: Record<string, any> = {
    electronics: Monitor,
    furniture: Package,
    clothing: Package,
    smartphones: Smartphone,
    accessories: Watch,
    cameras: Camera,
    gaming: Gamepad2,
    laptops: Laptop,
    audio: Speaker,
    wearables: Watch,
    headphones: Headphones,
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent via-background to-primary py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-8 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              <Zap className="h-3 w-3 mr-1" />
              New Arrivals
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Welcome to TechStore
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover the latest in technology and innovation. From
              cutting-edge electronics to smart home solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  Free Shipping
                </p>
                <p className="text-xs text-muted-foreground">Orders over $50</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  Secure Payment
                </p>
                <p className="text-xs text-muted-foreground">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  24/7 Support
                </p>
                <p className="text-xs text-muted-foreground">
                  Dedicated support
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  Easy Returns
                </p>
                <p className="text-xs text-muted-foreground">30 days return</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Render immediately with fetched data */}
      {categoriesData.length > 0 && (
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
              <p className="text-muted-foreground">
                Find exactly what you&apos;re looking for
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categoriesData.map((category) => {
                const IconComponent = categoryIcons[category.slug] || Package;
                return (
                  <Link key={category.id} href={`/categories/${category.slug}`}>
                    <Card className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                      <div className="mb-3 flex justify-center">
                        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Sale Products Section - Render immediately with fetched data */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-destructive/10 to-destructive/5">
          <div className="container">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-3">Flash Sale</h2>
                <p className="text-muted-foreground">
                  Limited time offers on top products
                </p>
              </div>
              <Badge variant="destructive" className="text-lg px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                Ends in 24:00:00
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section - Render immediately with fetched data */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-10">
              <Badge className="mb-4" variant="secondary">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending Now
              </Badge>
              <h2 className="text-3xl font-bold mb-3">Featured Products</h2>
              <p className="text-muted-foreground">
                Hand-picked selections just for you
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Button asChild size="lg" variant="outline">
                <Link href="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-accent to-primary">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center text-primary-foreground">
            <Gift className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Get 10% Off Your First Order
            </h2>
            <p className="text-primary-foreground/90 mb-8">
              Subscribe to our newsletter and receive exclusive offers, new
              product alerts, and tech tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
              />
              <Button
                size="lg"
                className="bg-background text-primary hover:bg-background/90"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-primary-foreground/70 mt-4">
              No spam, unsubscribe anytime. View our Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
