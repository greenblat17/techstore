import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ErrorHandlerOptions {
  showToast?: boolean;
  fallbackMessage?: string;
  onError?: (error: Error) => void;
  retryable?: boolean;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { toast } = useToast();
  const {
    showToast = true,
    fallbackMessage = "An error occurred. Please try again.",
    onError,
    retryable = false,
  } = options;

  const handleError = useCallback(
    (error: unknown, customMessage?: string) => {
      let errorMessage = customMessage || fallbackMessage;
      let errorTitle = "Error";

      // Parse error object
      if (error instanceof Error) {
        errorMessage = customMessage || error.message || fallbackMessage;
        
        // Check for specific error types
        if (error.name === "NetworkError" || error.message.includes("fetch")) {
          errorTitle = "Network Error";
          errorMessage = "Please check your internet connection and try again.";
        } else if (error.message.includes("unauthorized") || error.message.includes("401")) {
          errorTitle = "Authentication Error";
          errorMessage = "Please sign in to continue.";
        } else if (error.message.includes("forbidden") || error.message.includes("403")) {
          errorTitle = "Access Denied";
          errorMessage = "You don't have permission to perform this action.";
        } else if (error.message.includes("not found") || error.message.includes("404")) {
          errorTitle = "Not Found";
          errorMessage = "The requested resource was not found.";
        } else if (error.message.includes("validation") || error.message.includes("400")) {
          errorTitle = "Validation Error";
          errorMessage = error.message;
        } else if (error.message.includes("server") || error.message.includes("500")) {
          errorTitle = "Server Error";
          errorMessage = "Something went wrong on our end. Please try again later.";
        }
      }

      // Log error
      console.error("Error handled:", error);

      // Call custom error handler if provided
      if (onError && error instanceof Error) {
        onError(error);
      }

      // Show toast notification
      if (showToast) {
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
      }

      return { errorTitle, errorMessage };
    },
    [toast, showToast, fallbackMessage, onError]
  );

  return { handleError };
}

// Async error wrapper for try-catch blocks
export async function withErrorHandler<T>(
  fn: () => Promise<T>,
  options?: ErrorHandlerOptions
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const { handleError } = useErrorHandler(options);
    handleError(error);
    return null;
  }
}