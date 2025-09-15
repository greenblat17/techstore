import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Home, RefreshCw, AlertTriangle, Wifi, Server, ShieldAlert } from "lucide-react";

interface ErrorFallbackProps {
  type?: "network" | "server" | "auth" | "general";
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
}

export function ErrorFallback({
  type = "general",
  title,
  message,
  showRetry = true,
  showHome = true,
  onRetry,
}: ErrorFallbackProps) {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: <Wifi className="h-12 w-12 text-muted-foreground" />,
          title: title || "Network Connection Error",
          message: message || "Please check your internet connection and try again.",
          alertVariant: "default" as const,
        };
      case "server":
        return {
          icon: <Server className="h-12 w-12 text-muted-foreground" />,
          title: title || "Server Error",
          message: message || "Our servers are experiencing issues. Please try again later.",
          alertVariant: "destructive" as const,
        };
      case "auth":
        return {
          icon: <ShieldAlert className="h-12 w-12 text-muted-foreground" />,
          title: title || "Authentication Required",
          message: message || "Please sign in to access this content.",
          alertVariant: "default" as const,
        };
      default:
        return {
          icon: <AlertTriangle className="h-12 w-12 text-muted-foreground" />,
          title: title || "Something Went Wrong",
          message: message || "An unexpected error occurred. Please try again.",
          alertVariant: "destructive" as const,
        };
    }
  };

  const content = getErrorContent();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">{content.icon}</div>
          <CardTitle className="text-xl">{content.title}</CardTitle>
          <CardDescription>{content.message}</CardDescription>
        </CardHeader>
        
        {type === "network" && (
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Connection Tips</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 ml-4 list-disc text-sm">
                  <li>Check your internet connection</li>
                  <li>Try refreshing the page</li>
                  <li>Disable VPN if you're using one</li>
                  <li>Clear your browser cache</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        )}

        <CardFooter className="flex justify-center gap-2">
          {showRetry && (
            <Button onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          {showHome && (
            <Button onClick={() => window.location.href = "/"} variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          )}
          {type === "auth" && (
            <Button onClick={() => window.location.href = "/sign-in"}>
              Sign In
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export function NetworkErrorFallback() {
  return <ErrorFallback type="network" />;
}

export function ServerErrorFallback() {
  return <ErrorFallback type="server" />;
}

export function AuthErrorFallback() {
  return <ErrorFallback type="auth" showRetry={false} />;
}