"use client";

import { useEffect } from "react";
import { ErrorBoundaryFallback } from "@/components/error/error-display";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Root error boundary:", error);
  }, [error]);

  return <ErrorBoundaryFallback error={error} reset={reset} />;
}