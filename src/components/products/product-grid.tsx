"use client";

import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price: string;
  salePrice?: string | null;
  sku: string;
  stockQuantity?: number | null;
  brand?: string | null;
  images?: string[] | null;
  featured?: boolean | null;
  ratingAverage?: string | null;
  ratingCount?: number | null;
  categoryId?: string | null;
  status?: string | null;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "default" | "compact" | "detailed";
  showQuickActions?: boolean;
  emptyStateMessage?: string;
  className?: string;
}

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/3 mb-3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No products found
        </h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
};

export function ProductGrid({
  products,
  loading = false,
  columns = 4,
  variant = "default",
  showQuickActions = true,
  emptyStateMessage = "No products available at the moment. Please check back later.",
  className = "",
}: ProductGridProps) {
  // Show loading skeletons
  if (loading) {
    const skeletonCount = columns * 2; // Show 2 rows of skeletons
    return (
      <div
        className={`grid ${columnClasses[columns]} gap-4 md:gap-6 ${className}`}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show empty state
  if (!products || products.length === 0) {
    return (
      <div
        className={`grid ${columnClasses[columns]} gap-4 md:gap-6 ${className}`}
      >
        <EmptyState message={emptyStateMessage} />
      </div>
    );
  }

  // Show product grid
  return (
    <div
      className={`grid ${columnClasses[columns]} gap-4 md:gap-6 ${className}`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          showQuickActions={showQuickActions}
        />
      ))}
    </div>
  );
}

// List view variant for product listings
type ProductListProps = Omit<ProductGridProps, "columns">;

export function ProductList({
  products,
  loading = false,
  variant = "compact",
  showQuickActions = false,
  emptyStateMessage = "No products available at the moment. Please check back later.",
  className = "",
}: ProductListProps) {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex gap-4">
              <Skeleton className="w-24 h-24 flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState message={emptyStateMessage} />;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          showQuickActions={showQuickActions}
        />
      ))}
    </div>
  );
}
