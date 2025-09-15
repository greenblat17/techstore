"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/error/error-display";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  const isAuthError = error.message?.toLowerCase().includes("unauthorized") || 
                      error.message?.toLowerCase().includes("permission");

  if (isAuthError) {
    return (
      <div className="container py-16">
        <ErrorDisplay
          error={error}
          title="Access Denied"
          message="You don't have permission to access the admin area."
          severity="error"
          showDetails={false}
          showHome={true}
          showRetry={false}
        />
      </div>
    );
  }

  return (
    <div className="container py-16">
      <ErrorDisplay
        error={error}
        title="Admin Panel Error"
        message="There was a problem loading the admin panel."
        severity="error"
        showDetails={process.env.NODE_ENV === "development"}
        onRetry={reset}
      />
    </div>
  );
}