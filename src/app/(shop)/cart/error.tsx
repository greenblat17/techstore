"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/error/error-display";
import { useRouter } from "next/navigation";

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Cart error:", error);
  }, [error]);

  const handleClearAndRetry = () => {
    // Clear cart from localStorage as it might be corrupted
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart-storage");
    }
    reset();
  };

  return (
    <div className="container py-16">
      <ErrorDisplay
        error={error}
        title="Cart Error"
        message="There was a problem with your shopping cart. You can try again or clear your cart and start fresh."
        severity="error"
        showDetails={false}
        showRetry={true}
        onRetry={handleClearAndRetry}
        onHome={() => router.push("/products")}
      />
    </div>
  );
}