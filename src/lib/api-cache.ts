import { NextResponse } from "next/server";

export interface CacheOptions {
  /**
   * Cache duration in seconds
   * @default 60
   */
  maxAge?: number;
  
  /**
   * Shared cache duration in seconds (CDN)
   * @default maxAge
   */
  sMaxAge?: number;
  
  /**
   * Stale-while-revalidate duration in seconds
   * @default 60
   */
  staleWhileRevalidate?: number;
  
  /**
   * Cache visibility
   * @default "public"
   */
  cacheControl?: "public" | "private" | "no-cache" | "no-store";
  
  /**
   * Additional cache tags for purging
   */
  tags?: string[];
  
  /**
   * Enable CDN caching
   * @default true
   */
  cdn?: boolean;
}

/**
 * Set cache headers on a NextResponse
 */
export function setCacheHeaders(response: NextResponse, options: CacheOptions = {}) {
  const {
    maxAge = 60,
    sMaxAge = maxAge,
    staleWhileRevalidate = 60,
    cacheControl = "public",
    tags = [],
    cdn = true
  } = options;
  
  // Build Cache-Control header
  const cacheControlParts: string[] = [cacheControl];
  
  if (cacheControl !== "no-store" && cacheControl !== "no-cache") {
    cacheControlParts.push(`max-age=${maxAge}`);
    
    if (cdn) {
      cacheControlParts.push(`s-maxage=${sMaxAge}`);
    }
    
    if (staleWhileRevalidate > 0) {
      cacheControlParts.push(`stale-while-revalidate=${staleWhileRevalidate}`);
    }
  }
  
  response.headers.set("Cache-Control", cacheControlParts.join(", "));
  
  // Set CDN cache tags for targeted purging (Vercel/Cloudflare)
  if (tags.length > 0) {
    response.headers.set("Cache-Tag", tags.join(", "));
    response.headers.set("Cloudflare-CDN-Cache-Control", cacheControlParts.join(", "));
  }
  
  // Set Vary header for proper caching with different parameters
  response.headers.set("Vary", "Accept-Encoding, Authorization");
  
  return response;
}

/**
 * Create a cached JSON response
 */
export function cachedJsonResponse(data: any, options: CacheOptions = {}) {
  const response = NextResponse.json(data);
  return setCacheHeaders(response, options);
}

/**
 * Cache configuration presets
 */
export const CachePresets = {
  // Static data that rarely changes
  STATIC: {
    maxAge: 3600, // 1 hour
    sMaxAge: 86400, // 24 hours
    staleWhileRevalidate: 604800, // 7 days
    cacheControl: "public" as const
  },
  
  // Dynamic data that changes frequently
  DYNAMIC: {
    maxAge: 60, // 1 minute
    sMaxAge: 300, // 5 minutes
    staleWhileRevalidate: 60,
    cacheControl: "public" as const
  },
  
  // User-specific data
  PRIVATE: {
    maxAge: 0,
    sMaxAge: 0,
    staleWhileRevalidate: 0,
    cacheControl: "private" as const
  },
  
  // Real-time data
  REALTIME: {
    maxAge: 0,
    sMaxAge: 0,
    staleWhileRevalidate: 0,
    cacheControl: "no-cache" as const
  },
  
  // Product listings (moderate caching)
  PRODUCTS: {
    maxAge: 300, // 5 minutes
    sMaxAge: 900, // 15 minutes
    staleWhileRevalidate: 3600, // 1 hour
    cacheControl: "public" as const,
    tags: ["products"]
  },
  
  // Category data (longer caching)
  CATEGORIES: {
    maxAge: 1800, // 30 minutes
    sMaxAge: 7200, // 2 hours
    staleWhileRevalidate: 86400, // 24 hours
    cacheControl: "public" as const,
    tags: ["categories"]
  },
  
  // Search results
  SEARCH: {
    maxAge: 180, // 3 minutes
    sMaxAge: 600, // 10 minutes
    staleWhileRevalidate: 1800, // 30 minutes
    cacheControl: "public" as const,
    tags: ["search"]
  }
};

/**
 * Determine cache strategy based on request
 */
export function getCacheStrategy(request: Request): CacheOptions {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // No caching for authenticated/admin routes
  if (request.headers.get("Authorization") || path.includes("/admin")) {
    return CachePresets.PRIVATE;
  }
  
  // Route-specific caching
  if (path.includes("/api/products/search")) {
    return CachePresets.SEARCH;
  }
  
  if (path.includes("/api/products")) {
    return CachePresets.PRODUCTS;
  }
  
  if (path.includes("/api/categories")) {
    return CachePresets.CATEGORIES;
  }
  
  // Default to dynamic caching
  return CachePresets.DYNAMIC;
}

/**
 * Edge caching configuration for API routes
 */
export const edgeConfig = {
  runtime: "edge" as const,
  regions: ["iad1", "sfo1", "sin1", "syd1", "fra1", "gru1"],
};

/**
 * Revalidate cache tags (for use with ISR)
 */
export async function revalidateCacheTags(tags: string[]) {
  if (process.env.VERCEL) {
    // Vercel-specific revalidation
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-secret": process.env.REVALIDATE_SECRET || "",
        },
        body: JSON.stringify({ tags }),
      });
      
      if (!response.ok) {
        throw new Error("Revalidation failed");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Cache revalidation error:", error);
      return { revalidated: false, error };
    }
  }
  
  // Local development or other platforms
  return { revalidated: false, message: "Revalidation not supported" };
}