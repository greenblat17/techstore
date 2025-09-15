"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  count = 0,
  size = "md",
  showCount = true,
  interactive = false,
  onRatingChange,
  className = "",
}: StarRatingProps) {
  const sizeClasses = {
    sm: {
      star: "h-4 w-4",
      text: "text-sm",
    },
    md: {
      star: "h-5 w-5",
      text: "text-base",
    },
    lg: {
      star: "h-6 w-6",
      text: "text-lg",
    },
  };

  const handleStarClick = (starValue: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className={cn("flex", interactive && "cursor-pointer")}>
        {[1, 2, 3, 4, 5].map((starValue) => (
          <button
            key={starValue}
            type="button"
            onClick={() => handleStarClick(starValue)}
            disabled={!interactive}
            className={cn(
              "relative transition-colors",
              interactive && "hover:scale-110"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size].star,
                starValue <= Math.round(rating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-muted-foreground"
              )}
            />
            {/* Partial star fill */}
            {starValue === Math.ceil(rating) && rating % 1 !== 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(rating % 1) * 100}%` }}
              >
                <Star
                  className={cn(
                    sizeClasses[size].star,
                    "text-yellow-500 fill-yellow-500"
                  )}
                />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {showCount && count > 0 && (
        <span className={cn("text-muted-foreground", sizeClasses[size].text)}>
          ({count})
        </span>
      )}
    </div>
  );
}

// Rating display with more details
interface DetailedRatingProps {
  rating: number;
  count: number;
  distribution?: { [key: number]: number };
  className?: string;
}

export function DetailedRating({
  rating,
  count,
  distribution,
  className = "",
}: DetailedRatingProps) {
  const totalReviews = distribution
    ? Object.values(distribution).reduce((sum, count) => sum + count, 0)
    : count;

  const getPercentage = (starCount: number) => {
    if (!distribution || totalReviews === 0) return 0;
    return Math.round((distribution[starCount] / totalReviews) * 100);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall Rating */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{rating.toFixed(1)}</div>
          <StarRating rating={rating} showCount={false} size="sm" />
          <div className="text-sm text-muted-foreground mt-1">
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </div>
        </div>

        {/* Rating Distribution */}
        {distribution && (
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-4">
                  {stars}
                </span>
                <Star className="h-3 w-3 text-muted-foreground" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-300"
                    style={{ width: `${getPercentage(stars)}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-10 text-right">
                  {getPercentage(stars)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Simple rating input component
interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingInput({
  value,
  onChange,
  label,
  size = "md",
  className = "",
}: RatingInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium">{label}</label>
      )}
      <StarRating
        rating={value}
        showCount={false}
        interactive
        onRatingChange={onChange}
        size={size}
      />
    </div>
  );
}