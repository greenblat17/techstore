import { db } from "@/lib/db";
import { products as productsTable, categories } from "@/lib/db/schema";
import { eq, desc, asc, and, gte, lte, ilike, or, sql } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

// Server Component - Direct database access
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    search?: string;
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  // Parse search params
  const search = params.search || "";
  const categorySlug = params.category || "";
  const sort = params.sort || "newest";
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const page = parseInt(params.page || "1");
  const limit = 12;
  const offset = (page - 1) * limit;

  // Look up category by slug if provided
  let categoryId: string | null = null;
  if (categorySlug) {
    const category = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);
    
    if (category[0]) {
      categoryId = category[0].id;
    }
  }

  // Build WHERE conditions
  const conditions = [];
  
  // Always show only active products
  conditions.push(eq(productsTable.status, "active"));

  // Search filter
  if (search) {
    conditions.push(
      or(
        ilike(productsTable.name, `%${search}%`),
        ilike(productsTable.description, `%${search}%`),
        ilike(productsTable.shortDescription, `%${search}%`),
        ilike(productsTable.brand, `%${search}%`)
      )
    );
  }

  // Category filter - use the resolved category ID
  if (categoryId) {
    conditions.push(eq(productsTable.categoryId, categoryId));
  }

  // Price range filter
  if (minPrice !== undefined) {
    conditions.push(gte(productsTable.price, minPrice.toString()));
  }
  if (maxPrice !== undefined) {
    conditions.push(lte(productsTable.price, maxPrice.toString()));
  }

  // Build ORDER BY clause
  let orderBy;
  switch (sort) {
    case "price-asc":
      orderBy = asc(productsTable.price);
      break;
    case "price-desc":
      orderBy = desc(productsTable.price);
      break;
    case "name-asc":
      orderBy = asc(productsTable.name);
      break;
    case "name-desc":
      orderBy = desc(productsTable.name);
      break;
    case "rating":
      orderBy = desc(productsTable.ratingAverage);
      break;
    case "newest":
    default:
      orderBy = desc(productsTable.createdAt);
      break;
  }

  // Fetch products with category names
  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      shortDescription: productsTable.shortDescription,
      price: productsTable.price,
      salePrice: productsTable.salePrice,
      sku: productsTable.sku,
      stockQuantity: productsTable.stockQuantity,
      categoryId: productsTable.categoryId,
      categoryName: categories.name,
      brand: productsTable.brand,
      images: productsTable.images,
      specifications: productsTable.specifications,
      status: productsTable.status,
      featured: productsTable.featured,
      ratingAverage: productsTable.ratingAverage,
      ratingCount: productsTable.ratingCount,
      createdAt: productsTable.createdAt,
      updatedAt: productsTable.updatedAt,
    })
    .from(productsTable)
    .leftJoin(categories, eq(productsTable.categoryId, categories.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(productsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
  
  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Fetch all categories for filter sidebar
  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.displayOrder, categories.name);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <p className="text-muted-foreground">
          Browse our collection of {totalCount} products
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        {search && (
          <Badge variant="secondary">
            Search: {search}
          </Badge>
        )}
        {categoryId && (
          <Badge variant="secondary">
            Category: {allCategories.find(c => c.id === categoryId)?.name}
          </Badge>
        )}
        {minPrice !== undefined && (
          <Badge variant="secondary">
            Min Price: ${minPrice}
          </Badge>
        )}
        {maxPrice !== undefined && (
          <Badge variant="secondary">
            Max Price: ${maxPrice}
          </Badge>
        )}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent>
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Link href="/products">
              <Button>Clear Filters</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discountPercentage = product.salePrice 
              ? Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)
              : 0;

            return (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingCart className="h-12 w-12" />
                        </div>
                      )}
                      {discountPercentage > 0 && (
                        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                          -{discountPercentage}%
                        </Badge>
                      )}
                      {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                        <Badge variant="secondary" className="absolute top-2 left-2">
                          Only {product.stockQuantity} left
                        </Badge>
                      )}
                      {product.stockQuantity === 0 && (
                        <Badge variant="destructive" className="absolute top-2 left-2">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </Link>
                </CardHeader>
                
                <CardContent className="p-4">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {product.brand && (
                    <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                  )}
                  
                  {product.categoryName && (
                    <Badge variant="outline" className="mb-2 text-xs">
                      {product.categoryName}
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
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
                      <span className="text-lg font-bold text-primary">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {product.ratingAverage && Number(product.ratingAverage) > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < Math.round(Number(product.ratingAverage))
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.ratingCount})
                      </span>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full" 
                    size="sm"
                    disabled={product.stockQuantity === 0}
                  >
                    {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/products?${new URLSearchParams({
                ...params,
                page: (page - 1).toString(),
              }).toString()}`}
            >
              <Button variant="outline" size="sm">
                Previous
              </Button>
            </Link>
          )}
          
          <span className="text-sm text-muted-foreground px-4">
            Page {page} of {totalPages}
          </span>
          
          {page < totalPages && (
            <Link
              href={`/products?${new URLSearchParams({
                ...params,
                page: (page + 1).toString(),
              }).toString()}`}
            >
              <Button variant="outline" size="sm">
                Next
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}