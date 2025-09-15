"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface StockBadgeProps {
  stockQuantity: number;
  showOnlyLowStock?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StockBadge({
  stockQuantity,
  showOnlyLowStock = false,
  showIcon = true,
  size = "md",
  className = "",
}: StockBadgeProps) {
  // Determine stock status
  const getStockStatus = () => {
    if (stockQuantity === 0) {
      return {
        label: "Out of Stock",
        variant: "secondary" as const,
        icon: XCircle,
        color: "text-muted-foreground",
        priority: 3,
      };
    } else if (stockQuantity <= 5) {
      return {
        label: `Only ${stockQuantity} left`,
        variant: "destructive" as const,
        icon: AlertTriangle,
        color: "text-destructive",
        priority: 2,
      };
    } else if (stockQuantity <= 10) {
      return {
        label: "Limited Stock",
        variant: "outline" as const,
        icon: AlertTriangle,
        color: "text-orange-600",
        priority: 1,
      };
    } else {
      return {
        label: "In Stock",
        variant: "outline" as const,
        icon: CheckCircle,
        color: "text-green-600",
        priority: 0,
      };
    }
  };

  const status = getStockStatus();

  // If only showing low stock warnings, hide if stock is sufficient
  if (showOnlyLowStock && stockQuantity > 10) {
    return null;
  }

  // Size classes
  const sizeClasses = {
    sm: {
      badge: "text-xs px-1.5 py-0.5",
      icon: "h-3 w-3",
    },
    md: {
      badge: "text-sm px-2 py-1",
      icon: "h-4 w-4",
    },
    lg: {
      badge: "text-base px-3 py-1.5",
      icon: "h-5 w-5",
    },
  };

  const Icon = status.icon;

  return (
    <Badge
      variant={status.variant}
      className={cn(
        sizeClasses[size].badge,
        status.variant === "outline" && status.color,
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(sizeClasses[size].icon, "mr-1")} />
      )}
      {status.label}
    </Badge>
  );
}

// Stock indicator for product listings (simpler version)
interface StockIndicatorProps {
  stockQuantity: number;
  className?: string;
}

export function StockIndicator({
  stockQuantity,
  className = "",
}: StockIndicatorProps) {
  const getStockLevel = () => {
    if (stockQuantity === 0) return { level: 0, label: "Out of Stock" };
    if (stockQuantity <= 5) return { level: 1, label: "Low Stock" };
    if (stockQuantity <= 10) return { level: 2, label: "Limited Stock" };
    return { level: 3, label: "In Stock" };
  };

  const stock = getStockLevel();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-0.5">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              level <= stock.level
                ? stock.level === 3
                  ? "bg-green-500"
                  : stock.level === 2
                  ? "bg-orange-500"
                  : stock.level === 1
                  ? "bg-red-500"
                  : "bg-muted"
                : "bg-muted"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{stock.label}</span>
    </div>
  );
}

// Stock status text (for detailed views)
interface StockStatusProps {
  stockQuantity: number;
  showExactQuantity?: boolean;
  className?: string;
}

export function StockStatus({
  stockQuantity,
  showExactQuantity = false,
  className = "",
}: StockStatusProps) {
  const getStatusText = () => {
    if (stockQuantity === 0) {
      return (
        <span className="text-muted-foreground">
          Currently out of stock
        </span>
      );
    } else if (stockQuantity <= 5) {
      return (
        <span className="text-destructive font-medium">
          Only {stockQuantity} {stockQuantity === 1 ? "item" : "items"} left in stock - order soon!
        </span>
      );
    } else if (stockQuantity <= 10) {
      return (
        <span className="text-orange-600 font-medium">
          Limited availability - {stockQuantity} in stock
        </span>
      );
    } else if (showExactQuantity) {
      return (
        <span className="text-green-600 font-medium">
          {stockQuantity} in stock
        </span>
      );
    } else {
      return (
        <span className="text-green-600 font-medium">
          In stock and ready to ship
        </span>
      );
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Package className="h-4 w-4 text-muted-foreground" />
      {getStatusText()}
    </div>
  );
}