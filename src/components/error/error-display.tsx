"use client";

import { useEffect } from "react";
import { AlertCircle, AlertTriangle, XCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ErrorSeverity = "error" | "warning" | "info";

interface ErrorDisplayProps {
  error?: Error | null;
  title?: string;
  message?: string;
  severity?: ErrorSeverity;
  showDetails?: boolean;
  showRetry?: boolean;
  showHome?: boolean;
  showBack?: boolean;
  onRetry?: () => void;
  onHome?: () => void;
  onBack?: () => void;
  className?: string;
}

export function ErrorDisplay({
  error,
  title = "Something went wrong",
  message,
  severity = "error",
  showDetails = true,
  showRetry = true,
  showHome = true,
  showBack = false,
  onRetry,
  onHome,
  onBack,
  className,
}: ErrorDisplayProps) {
  const errorMessage = message || error?.message || "An unexpected error occurred. Please try again later.";

  const getIcon = () => {
    switch (severity) {
      case "error":
        return <XCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "info":
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getAlertVariant = () => {
    switch (severity) {
      case "error":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "default";
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = "/";
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4", className)}>
      <Alert variant={getAlertVariant()} className="mb-4">
        {getIcon()}
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>

      {showDetails && error && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Error Details</CardTitle>
            <CardDescription>Technical information about the error</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-sm">Error Type:</span>
                <p className="text-sm text-muted-foreground">{error.name || "Unknown"}</p>
              </div>
              {error.stack && (
                <div>
                  <span className="font-semibold text-sm">Stack Trace:</span>
                  <pre className="text-xs text-muted-foreground mt-1 p-2 bg-muted rounded overflow-x-auto">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        {showRetry && (
          <Button onClick={handleRetry} variant="default">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        {showBack && (
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        )}
        {showHome && (
          <Button onClick={handleHome} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
}

interface ErrorBoundaryFallbackProps {
  error: Error;
  reset: () => void;
}

export function ErrorBoundaryFallback({ error, reset }: ErrorBoundaryFallbackProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <ErrorDisplay
        error={error}
        title="Application Error"
        severity="error"
        showDetails={process.env.NODE_ENV === "development"}
        onRetry={reset}
      />
    </div>
  );
}

interface NotFoundDisplayProps {
  title?: string;
  message?: string;
  showHome?: boolean;
  showBack?: boolean;
}

export function NotFoundDisplay({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  showHome = true,
  showBack = true,
}: NotFoundDisplayProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
              <span className="text-4xl font-bold text-muted-foreground">404</span>
            </div>
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-2">
          {showBack && (
            <Button onClick={() => window.history.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
          {showHome && (
            <Button onClick={() => window.location.href = "/"}>
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

interface AccessDeniedDisplayProps {
  title?: string;
  message?: string;
  showLogin?: boolean;
  showHome?: boolean;
}

export function AccessDeniedDisplay({
  title = "Access Denied",
  message = "You don't have permission to access this resource.",
  showLogin = true,
  showHome = true,
}: AccessDeniedDisplayProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-2">
          {showLogin && (
            <Button onClick={() => window.location.href = "/sign-in"}>
              Sign In
            </Button>
          )}
          {showHome && (
            <Button onClick={() => window.location.href = "/"} variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}