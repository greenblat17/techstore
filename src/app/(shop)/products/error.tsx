"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/error/error-display";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Products error:", error);
  }, [error]);

  return (
    <div className="container py-16">
      <ErrorDisplay
        error={error}
        title="Products Loading Error"
        message="We couldn't load the products. This might be a temporary issue."
        severity="error"
        showDetails={false}
        showRetry={true}
        showBack={true}
        onRetry={reset}
      />
    </div>
  );
}