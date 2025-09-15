import { OrderTableSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-8 w-32 mb-8" />
      <OrderTableSkeleton rows={5} />
    </div>
  );
}