import { ProductGridSkeleton } from "@/components/ui/skeletons";

export default function ProductsLoading() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded mt-2" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
        </div>
      </div>
      
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="hidden lg:block">
          {/* Filter Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-5 w-24 bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-full bg-muted animate-pulse rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <ProductGridSkeleton count={12} columns={3} />
        </div>
      </div>
    </div>
  );
}