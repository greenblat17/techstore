"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import ProductFilters, { ProductFiltersMobile } from "@/components/products/product-filters";
import { 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Grid3x3,
  Grid2x2,
  List
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  salePrice: string | null;
  images: string[];
  stockQuantity: number;
  brand: string | null;
  shortDescription: string | null;
  ratingAverage: number;
  ratingCount: number;
  category: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface Brand {
  name: string;
  count: number;
}

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
  rating: number | null;
  sortBy: string;
}

// Product Card Component
function ProductCard({ product, viewMode = "grid" }: { product: Product; viewMode?: string }) {
  const discountPercentage = product.salePrice 
    ? Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)
    : 0;

  if (viewMode === "list") {
    return (
      <Card className="flex flex-row hover:shadow-lg transition-shadow duration-300">
        <div className="w-48 h-48 relative overflow-hidden bg-gray-100">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
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
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            {product.brand && (
              <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
            )}
            {product.shortDescription && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {product.shortDescription}
              </p>
            )}
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-xl font-bold text-primary">
                    ${parseFloat(product.salePrice).toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-primary">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            {product.ratingAverage > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.round(product.ratingAverage)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.ratingCount})
                </span>
              </div>
            )}
            <Button size="sm" disabled={product.stockQuantity === 0}>
              {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
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
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {product.brand && (
          <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
        )}
        {product.shortDescription && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {product.shortDescription}
          </p>
        )}
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-xl font-bold text-primary">
                ${parseFloat(product.salePrice).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${parseFloat(product.price).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-primary">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          )}
        </div>
        {product.ratingAverage > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.round(product.ratingAverage)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.ratingCount})
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={product.stockQuantity === 0}>
          {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Product Skeleton Component
function ProductSkeleton({ viewMode = "grid" }: { viewMode?: string }) {
  if (viewMode === "list") {
    return (
      <Card className="flex flex-row">
        <Skeleton className="w-48 h-48" />
        <div className="flex-1 p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-0">
        <Skeleton className="aspect-square rounded-t-lg" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

// Main Products Page Component
export default function ProductsFilteredPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Filter data
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories/tree");
        const data = await res.json();
        
        // Flatten the tree structure for filter sidebar
        const flatCategories: Category[] = [];
        function flatten(cats: any[]) {
          cats.forEach(cat => {
            flatCategories.push({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              productCount: cat.totalProducts
            });
            if (cat.children && cat.children.length > 0) {
              flatten(cat.children);
            }
          });
        }
        flatten(data.tree);
        setCategories(flatCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products when filters change
  const fetchProducts = useCallback(async (filters: FilterState) => {
    setLoading(true);
    
    // Build query params
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", "12");
    
    // Map sortBy to API format
    let sortBy = "createdAt";
    let sortOrder = "desc";
    switch (filters.sortBy) {
      case "oldest":
        sortBy = "createdAt";
        sortOrder = "asc";
        break;
      case "price-low":
        sortBy = "price";
        sortOrder = "asc";
        break;
      case "price-high":
        sortBy = "price";
        sortOrder = "desc";
        break;
      case "name-asc":
        sortBy = "name";
        sortOrder = "asc";
        break;
      case "name-desc":
        sortBy = "name";
        sortOrder = "desc";
        break;
      case "rating":
        sortBy = "rating";
        sortOrder = "desc";
        break;
      case "bestselling":
        sortBy = "stockQuantity";
        sortOrder = "desc";
        break;
    }
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    
    if (searchQuery) params.set("search", searchQuery);
    if (filters.categories.length > 0) {
      // For now, just use the first category (API currently supports single category)
      params.set("categoryId", filters.categories[0]);
    }
    if (filters.brands.length > 0) {
      // For now, just use the first brand (API currently supports single brand)
      params.set("brand", filters.brands[0]);
    }
    if (filters.priceRange[0] > 0) params.set("minPrice", filters.priceRange[0].toString());
    if (filters.priceRange[1] < maxPrice) params.set("maxPrice", filters.priceRange[1].toString());
    if (filters.inStock) params.set("inStock", "true");
    
    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalProducts(data.pagination?.totalCount || 0);
      
      // Extract brands from the response
      if (data.filters?.brands) {
        const brandCounts = data.filters.brands.map((brand: string) => ({
          name: brand,
          count: data.products.filter((p: Product) => p.brand === brand).length
        }));
        setBrands(brandCounts);
      }
      
      // Determine max price from products
      if (data.products && data.products.length > 0) {
        const prices = data.products.map((p: Product) => parseFloat(p.price));
        const max = Math.ceil(Math.max(...prices) / 100) * 100; // Round up to nearest 100
        setMaxPrice(max);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, maxPrice]);

  // Handle filter changes
  const handleFiltersChange = useCallback((filters: FilterState) => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchProducts(filters);
  }, [fetchProducts]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  // Initial load with default filters
  useEffect(() => {
    fetchProducts({
      categories: [],
      brands: [],
      priceRange: [0, maxPrice],
      inStock: false,
      rating: null,
      sortBy: "newest",
    });
  }, [currentPage, searchQuery, maxPrice]);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        
        {/* Search Bar and View Options */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          
          <div className="flex gap-2">
            {/* Mobile Filter Toggle */}
            <div className="sm:hidden">
              <ProductFiltersMobile
                categories={categories}
                brands={brands}
                maxPrice={maxPrice}
                onFiltersChange={handleFiltersChange}
                onReset={() => {
                  setSearchQuery("");
                  setSearchInput("");
                  setCurrentPage(1);
                }}
                totalProducts={totalProducts}
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-1 border rounded-md p-1">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="p-2"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "secondary" : "ghost"}
                onClick={() => setViewMode("list")}
                className="p-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-muted-foreground">
          Showing {products.length} of {totalProducts} products
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden sm:block w-64 shrink-0">
          <div className="sticky top-4">
            <ProductFilters
              categories={categories}
              brands={brands}
              maxPrice={maxPrice}
              onFiltersChange={handleFiltersChange}
              onReset={() => {
                setSearchQuery("");
                setSearchInput("");
                setCurrentPage(1);
              }}
              totalProducts={totalProducts}
            />
          </div>
        </aside>

        {/* Product Grid/List */}
        <div className="flex-1">
          {loading ? (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {[...Array(12)].map((_, i) => (
                <ProductSkeleton key={i} viewMode={viewMode} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSearchInput("");
                  setCurrentPage(1);
                  fetchProducts({
                    categories: [],
                    brands: [],
                    priceRange: [0, maxPrice],
                    inStock: false,
                    rating: null,
                    sortBy: "newest",
                  });
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2">...</span>
                        <Button
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-10"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}