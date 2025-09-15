"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  className?: string;
  containerClassName?: string;
  fallback?: React.ReactNode;
  sizes?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  priority = false,
  quality = 75,
  className,
  containerClassName,
  fallback,
  sizes,
  placeholder,
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
    onError?.();
  };

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || fill
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : undefined;

  if (error || !src) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        containerClassName
      )}>
        {fallback || <Package className="h-8 w-8" />}
      </div>
    );
  }

  const imageProps = fill
    ? { fill: true }
    : { width: width || 500, height: height || 500 };

  return (
    <>
      {loading && (
        <div className={cn(
          "absolute inset-0 bg-muted animate-pulse",
          containerClassName
        )} />
      )}
      <Image
        src={src}
        alt={alt}
        {...imageProps}
        priority={priority}
        quality={quality}
        className={cn(
          "transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100",
          className
        )}
        sizes={responsiveSizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
}

// Blur data URL generator for placeholder
export function generateBlurDataURL(width: number = 16, height: number = 16): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
  }
  return canvas.toDataURL();
}

// Image loader for external images (if needed)
export const imageLoader = ({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) => {
  // For external images, you might want to use an image optimization service
  // For now, return the original URL
  if (src.startsWith('http')) {
    return src;
  }
  return `${src}?w=${width}&q=${quality || 75}`;
};