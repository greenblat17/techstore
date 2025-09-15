"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/error/error-display";

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Orders error:", error);
  }, [error]);

  return (
    <div className="container py-16">
      <ErrorDisplay
        error={error}
        title="Orders Loading Error"
        message="We couldn't load your orders. Please try again later."
        severity="error"
        showDetails={false}
        showRetry={true}
        onRetry={reset}
      />
    </div>
  );
}