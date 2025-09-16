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
import { ProductCard } from "@/components/products/product-card";
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

// Fetch featured products directly from database
async function getFeaturedProducts() {
  try {
    const featuredProducts = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.status, "active"),
          or(eq(products.featured, true), gt(products.stockQuantity, 0))
        )
      )
      .orderBy(desc(products.featured), desc(products.createdAt))
      .limit(8);

    return featuredProducts;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

// Fetch products on sale
async function getSaleProducts() {
  try {
    const saleProducts = await db
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
      .limit(4);

    return saleProducts;
  } catch (error) {
    console.error("Error fetching sale products:", error);
    return [];
  }
}

// Fetch all categories
async function getCategories() {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(categories.displayOrder)
      .limit(6);

    return allCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Category Card Component
function CategoryCard({ category, icon: Icon }: { category: any; icon: any }) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <Card className="group h-full cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/50 bg-card">
        <CardContent className="p-6 text-center">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

// Product Skeleton Component
function ProductSkeleton() {
  return (
    <Card className="bg-card">
      <CardHeader className="p-0">
        <Skeleton className="aspect-square rounded-t-lg" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/3 mb-3" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

// Featured Products Section
async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              Handpicked items our customers love most
            </p>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Sale Products Section
async function SaleProducts() {
  const products = await getSaleProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="bg-gradient-to-r from-destructive to-orange-500 rounded-2xl p-8 mb-10 shadow-lg">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Zap className="h-8 w-8" />
                Flash Sale
              </h2>
              <p className="text-white/90">
                Limited time offers - Save big on selected items!
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white/80 mb-1">Ends in</p>
              <div className="flex gap-2">
                <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2">
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs">Hours</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2">
                  <p className="text-2xl font-bold">00</p>
                  <p className="text-xs">Mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Categories Section
async function CategoriesSection() {
  const categoriesData = await getCategories();

  const categoryIcons: Record<string, any> = {
    electronics: Monitor,
    furniture: Package,
    "home-kitchen": Package,
    "sports-fitness": TrendingUp,
    "home-office": Laptop,
    "bags-luggage": Package,
    "health-wellness": Shield,
  };

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
            Shop by Category
          </h2>
          <p className="text-muted-foreground">
            Find exactly what you&apos;re looking for
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesData.map((category: any) => (
            <CategoryCard
              key={category.id}
              category={category}
              icon={categoryIcons[category.slug] || Package}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Loading states
function FeaturedProductsLoading() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Shop Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="container relative z-10 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-primary-foreground">
              <Badge className="mb-4 bg-background/20 text-primary-foreground border-primary-foreground/30 backdrop-blur">
                <Sparkles className="mr-1 h-3 w-3" />
                New Year Sale - Up to 50% Off
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Your One-Stop
                <span className="block text-yellow-300">Tech Store</span>
              </h1>
              <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
                Premium electronics, unbeatable prices, and lightning-fast
                delivery. Shop with confidence with our 30-day return guarantee.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-background text-primary hover:bg-background/90"
                  asChild
                >
                  <Link href="/products">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Start Shopping
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/products?sale=true">
                    <Gift className="mr-2 h-5 w-5" />
                    View Deals
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="p-4 bg-background/10 backdrop-blur border-primary-foreground/20">
                    <div className="flex items-center gap-3 text-primary-foreground">
                      <Headphones className="h-8 w-8" />
                      <div>
                        <p className="font-semibold">Audio</p>
                        <p className="text-sm text-primary-foreground/80">
                          Premium Sound
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-background/10 backdrop-blur border-primary-foreground/20">
                    <div className="flex items-center gap-3 text-primary-foreground">
                      <Camera className="h-8 w-8" />
                      <div>
                        <p className="font-semibold">Cameras</p>
                        <p className="text-sm text-primary-foreground/80">
                          Capture Moments
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="space-y-4 mt-8">
                  <Card className="p-4 bg-background/10 backdrop-blur border-primary-foreground/20">
                    <div className="flex items-center gap-3 text-primary-foreground">
                      <Smartphone className="h-8 w-8" />
                      <div>
                        <p className="font-semibold">Phones</p>
                        <p className="text-sm text-primary-foreground/80">
                          Latest Models
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-background/10 backdrop-blur border-primary-foreground/20">
                    <div className="flex items-center gap-3 text-primary-foreground">
                      <Gamepad2 className="h-8 w-8" />
                      <div>
                        <p className="font-semibold">Gaming</p>
                        <p className="text-sm text-primary-foreground/80">
                          Level Up
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-border bg-card">
        <div className="container py-8">
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

      {/* Categories Section */}
      <Suspense
        fallback={
          <div className="py-16">
            <Skeleton className="h-96" />
          </div>
        }
      >
        <CategoriesSection />
      </Suspense>

      {/* Sale Products Section */}
      <Suspense fallback={<FeaturedProductsLoading />}>
        <SaleProducts />
      </Suspense>

      {/* Featured Products Section */}
      <Suspense fallback={<FeaturedProductsLoading />}>
        <FeaturedProducts />
      </Suspense>

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
