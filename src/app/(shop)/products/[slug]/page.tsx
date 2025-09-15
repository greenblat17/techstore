import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, and, ne, or } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Package, Truck, Shield, Star, ChevronLeft, Minus, Plus, Check, X } from "lucide-react";
import AddToCartButton from "@/components/products/add-to-cart-button";

// Enable static generation for product pages
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all products
export async function generateStaticParams() {
  const allProducts = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.status, "active"));
  
  return allProducts.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  
  if (!product[0]) {
    return {
      title: 'Product Not Found',
    };
  }
  
  return {
    title: `${product[0].name} | TechStore`,
    description: product[0].shortDescription || product[0].description || `Shop ${product[0].name} at TechStore`,
    openGraph: {
      title: product[0].name,
      description: product[0].shortDescription || product[0].description || undefined,
      images: product[0].images?.[0] ? [product[0].images[0]] : undefined,
    },
  };
}

function formatPrice(price: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        ({count} {count === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product with category
  const product = await db
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
      brand: products.brand,
      images: products.images,
      specifications: products.specifications,
      status: products.status,
      featured: products.featured,
      ratingAverage: products.ratingAverage,
      ratingCount: products.ratingCount,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product.length || product[0].status !== "active") {
    notFound();
  }

  const currentProduct = product[0];
  
  // Calculate discount percentage if on sale
  const discountPercentage = currentProduct.salePrice
    ? Math.round(
        ((Number(currentProduct.price) - Number(currentProduct.salePrice)) /
          Number(currentProduct.price)) *
          100
      )
    : 0;

  // Fetch related products (same category, excluding current)
  const relatedProducts = currentProduct.categoryId
    ? await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          price: products.price,
          salePrice: products.salePrice,
          images: products.images,
          ratingAverage: products.ratingAverage,
          ratingCount: products.ratingCount,
        })
        .from(products)
        .where(
          and(
            eq(products.categoryId, currentProduct.categoryId),
            ne(products.id, currentProduct.id),
            eq(products.status, "active")
          )
        )
        .limit(4)
    : [];

  // Parse specifications
  const specs = currentProduct.specifications as Record<string, any> || {};

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
          </li>
          {currentProduct.categoryName && (
            <>
              <li>/</li>
              <li>
                <Link 
                  href={`/products?category=${currentProduct.categorySlug}`}
                  className="hover:text-foreground"
                >
                  {currentProduct.categoryName}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-foreground font-medium">{currentProduct.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                {currentProduct.images && currentProduct.images.length > 0 ? (
                  <Image
                    src={currentProduct.images[0]}
                    alt={currentProduct.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Package className="h-20 w-20 text-gray-300" />
                  </div>
                )}
                {discountPercentage > 0 && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    -{discountPercentage}%
                  </Badge>
                )}
                {currentProduct.featured && (
                  <Badge className="absolute top-4 right-4" variant="secondary">
                    Featured
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Thumbnail Gallery (if multiple images) */}
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {currentProduct.images.slice(0, 4).map((image, index) => (
                <Card key={index} className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`${currentProduct.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentProduct.name}</h1>
            {currentProduct.brand && (
              <p className="text-muted-foreground mb-2">
                Brand: <span className="font-medium text-foreground">{currentProduct.brand}</span>
              </p>
            )}
            <div className="flex items-center gap-4 mb-4">
              <StarRating 
                rating={Number(currentProduct.ratingAverage || 0)} 
                count={currentProduct.ratingCount || 0} 
              />
              {currentProduct.sku && (
                <span className="text-sm text-muted-foreground">
                  SKU: {currentProduct.sku}
                </span>
              )}
            </div>
            {currentProduct.shortDescription && (
              <p className="text-muted-foreground">{currentProduct.shortDescription}</p>
            )}
          </div>

          <Separator />

          {/* Price and Stock */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-baseline gap-2 mb-4">
                {currentProduct.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(currentProduct.salePrice)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(currentProduct.price)}
                    </span>
                    <Badge variant="destructive">Save {discountPercentage}%</Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    {formatPrice(currentProduct.price)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {currentProduct.stockQuantity && currentProduct.stockQuantity > 0 ? (
                  <>
                    <Badge variant="outline" className="gap-1">
                      <Check className="h-3 w-3" />
                      In Stock
                    </Badge>
                    {currentProduct.stockQuantity < 10 && (
                      <span className="text-sm text-orange-500">
                        Only {currentProduct.stockQuantity} left!
                      </span>
                    )}
                  </>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <X className="h-3 w-3" />
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Add to Cart */}
              <AddToCartButton 
                product={{
                  id: currentProduct.id,
                  name: currentProduct.name,
                  price: currentProduct.price,
                  salePrice: currentProduct.salePrice,
                  image: currentProduct.images?.[0] || "",
                  stockQuantity: currentProduct.stockQuantity || 0,
                }}
                disabled={!currentProduct.stockQuantity || currentProduct.stockQuantity === 0}
              />
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On orders over $50</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Secure Shopping</p>
                    <p className="text-sm text-muted-foreground">SSL encrypted checkout</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-sm text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for Description, Specifications, Reviews */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                {currentProduct.description ? (
                  <div className="text-muted-foreground whitespace-pre-wrap">
                    {currentProduct.description}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No description available.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                {Object.keys(specs).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-4 py-2 border-b last:border-0">
                        <span className="font-medium capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-muted-foreground">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specifications available.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  {currentProduct.ratingCount && currentProduct.ratingCount > 0 ? (
                    <>
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-3xl font-bold">{Number(currentProduct.ratingAverage).toFixed(1)}</p>
                          <StarRating rating={Number(currentProduct.ratingAverage)} count={0} />
                          <p className="text-sm text-muted-foreground mt-1">
                            Based on {currentProduct.ratingCount} reviews
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-center py-8">
                        Review system coming soon!
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No reviews yet.</p>
                      <Button variant="outline">Be the first to review</Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/products/${product.slug}`}>
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      {product.salePrice && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                          Sale
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
                    <div className="flex items-baseline gap-2">
                      {product.salePrice ? (
                        <>
                          <span className="font-bold text-primary">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    {product.ratingAverage && Number(product.ratingAverage) > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">
                          {Number(product.ratingAverage).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}