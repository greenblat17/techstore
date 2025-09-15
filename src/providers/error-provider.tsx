"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface ErrorContextType {
  handleError: (error: unknown, customMessage?: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: unknown, customMessage?: string) => {
      let message = customMessage || "An unexpected error occurred";
      let title = "Error";

      if (error instanceof Error) {
        message = customMessage || error.message;
        
        // Categorize errors
        if (error.message.includes("Network") || error.message.includes("fetch")) {
          title = "Connection Error";
          message = "Please check your internet connection";
        } else if (error.message.includes("401") || error.message.includes("unauthorized")) {
          title = "Authentication Required";
          message = "Please sign in to continue";
        } else if (error.message.includes("403") || error.message.includes("forbidden")) {
          title = "Access Denied";
          message = "You don't have permission for this action";
        } else if (error.message.includes("404") || error.message.includes("not found")) {
          title = "Not Found";
          message = "The requested resource was not found";
        } else if (error.message.includes("500") || error.message.includes("server")) {
          title = "Server Error";
          message = "Something went wrong on our end";
        }
      }

      // Log error in development
      if (process.env.NODE_ENV === "development") {
        console.error("Error caught by provider:", error);
      }

      // Show toast
      toast({
        title,
        description: message,
        variant: "destructive",
      });
    },
    [toast]
  );

  const clearError = useCallback(() => {
    // Implementation for clearing errors if needed
  }, []);

  return (
    <ErrorContext.Provider value={{ handleError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within ErrorProvider");
  }
  return context;
}