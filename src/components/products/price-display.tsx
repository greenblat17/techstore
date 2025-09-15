"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: string | number;
  salePrice?: string | number | null;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showBadgeOnly?: boolean;
  showCurrency?: boolean;
  className?: string;
}

export function PriceDisplay({
  price,
  salePrice,
  currency = "$",
  size = "md",
  showBadgeOnly = false,
  showCurrency = true,
  className = "",
}: PriceDisplayProps) {
  // Convert to numbers for calculation
  const originalPrice = typeof price === "string" ? parseFloat(price) : price;
  const currentPrice = salePrice 
    ? (typeof salePrice === "string" ? parseFloat(salePrice) : salePrice)
    : originalPrice;

  // Calculate discount percentage
  const discountPercentage = salePrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Format price with currency
  const formatPrice = (amount: number) => {
    const formatted = amount.toFixed(2);
    return showCurrency ? `${currency}${formatted}` : formatted;
  };

  // Size classes for different text sizes
  const sizeClasses = {
    sm: {
      current: "text-base font-semibold",
      original: "text-xs",
      badge: "text-xs px-1.5 py-0.5",
    },
    md: {
      current: "text-xl font-bold",
      original: "text-sm",
      badge: "text-sm",
    },
    lg: {
      current: "text-2xl font-bold",
      original: "text-base",
      badge: "text-sm",
    },
    xl: {
      current: "text-3xl font-bold",
      original: "text-lg",
      badge: "text-base",
    },
  };

  // If only showing the discount badge
  if (showBadgeOnly && discountPercentage > 0) {
    return (
      <Badge 
        className={cn(
          "bg-destructive text-destructive-foreground",
          sizeClasses[size].badge,
          className
        )}
      >
        -{discountPercentage}%
      </Badge>
    );
  }

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      {/* Current Price */}
      <span 
        className={cn(
          salePrice ? "text-primary" : "text-foreground",
          sizeClasses[size].current
        )}
      >
        {formatPrice(currentPrice)}
      </span>

      {/* Original Price (if on sale) */}
      {salePrice && (
        <>
          <span 
            className={cn(
              "text-muted-foreground line-through",
              sizeClasses[size].original
            )}
          >
            {formatPrice(originalPrice)}
          </span>
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge 
              variant="destructive"
              className={cn(sizeClasses[size].badge)}
            >
              -{discountPercentage}%
            </Badge>
          )}
        </>
      )}
    </div>
  );
}

// Additional utility component for displaying price ranges
interface PriceRangeDisplayProps {
  minPrice: string | number;
  maxPrice: string | number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PriceRangeDisplay({
  minPrice,
  maxPrice,
  currency = "$",
  size = "md",
  className = "",
}: PriceRangeDisplayProps) {
  const min = typeof minPrice === "string" ? parseFloat(minPrice) : minPrice;
  const max = typeof maxPrice === "string" ? parseFloat(maxPrice) : maxPrice;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <span className={cn("text-muted-foreground", sizeClasses[size], className)}>
      {currency}{min.toFixed(2)} - {currency}{max.toFixed(2)}
    </span>
  );
}

// Utility function for formatting prices consistently across the app
export function formatCurrency(
  amount: string | number,
  currency: string = "$",
  locale: string = "en-US"
): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  
  // Use Intl.NumberFormat for proper localization
  if (typeof Intl !== "undefined" && Intl.NumberFormat) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency === "$" ? "USD" : "EUR", // Add more currency mappings as needed
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // Fallback formatting
  return `${currency}${value.toFixed(2)}`;
}