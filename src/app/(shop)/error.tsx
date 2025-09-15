"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/error/error-display";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Shop error:", error);
  }, [error]);

  return (
    <div className="container py-16">
      <ErrorDisplay
        error={error}
        title="Shop Error"
        message="There was a problem loading the shop. Please try again."
        severity="error"
        showDetails={false}
        onRetry={reset}
      />
    </div>
  );
}