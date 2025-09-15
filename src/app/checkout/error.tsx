"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/error/error-display";
import { useRouter } from "next/navigation";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Checkout error:", error);
  }, [error]);

  return (
    <div className="container py-16">
      <ErrorDisplay
        error={error}
        title="Checkout Error"
        message="There was a problem processing your checkout. Your cart items are safe. Please try again."
        severity="error"
        showDetails={false}
        showRetry={true}
        showBack={true}
        onRetry={reset}
        onBack={() => router.push("/cart")}
      />
    </div>
  );
}