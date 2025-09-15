/**
 * Utility functions for parallel data fetching in Next.js server components
 */

/**
 * Execute multiple async operations in parallel with error handling
 * @param operations - Array of async functions to execute
 * @returns Promise resolving to array of results
 */
export async function parallelFetch<T extends readonly (() => Promise<any>)[]>(
  operations: T
): Promise<{ 
  [K in keyof T]: Awaited<ReturnType<T[K]>> | null 
}> {
  const results = await Promise.allSettled(operations.map(op => op()));
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Parallel fetch operation ${index} failed:`, result.reason);
      return null;
    }
  }) as any;
}

/**
 * Execute multiple database queries in parallel with named results
 * @param queries - Object with named query functions
 * @returns Promise resolving to object with named results
 */
export async function parallelQueries<T extends Record<string, () => Promise<any>>>(
  queries: T
): Promise<{ 
  [K in keyof T]: Awaited<ReturnType<T[K]>> | null 
}> {
  const entries = Object.entries(queries);
  const results = await Promise.allSettled(
    entries.map(([_, query]) => query())
  );
  
  return Object.fromEntries(
    entries.map(([key], index) => {
      const result = results[index];
      if (result.status === 'fulfilled') {
        return [key, result.value];
      } else {
        console.error(`Query "${key}" failed:`, result.reason);
        return [key, null];
      }
    })
  ) as any;
}

/**
 * Batch fetch with chunking for large datasets
 * @param items - Array of items to process
 * @param batchSize - Number of items to process in parallel
 * @param processor - Function to process each item
 * @returns Promise resolving to array of results
 */
export async function batchFetch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Parallel fetch with timeout
 * @param operations - Array of async operations
 * @param timeout - Timeout in milliseconds
 * @returns Promise resolving to array of results or timeout errors
 */
export async function parallelFetchWithTimeout<T extends readonly (() => Promise<any>)[]>(
  operations: T,
  timeout: number = 5000
): Promise<{ 
  [K in keyof T]: Awaited<ReturnType<T[K]>> | { error: string } 
}> {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Operation timeout')), timeout)
  );
  
  const results = await Promise.allSettled(
    operations.map(op => Promise.race([op(), timeoutPromise]))
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Operation ${index} failed or timed out:`, result.reason);
      return { error: result.reason?.message || 'Unknown error' };
    }
  }) as any;
}

/**
 * Cache-aware parallel fetch
 * @param cacheKey - Cache key for storing results
 * @param operations - Operations to execute
 * @param ttl - Time to live in seconds
 * @returns Cached or fresh results
 */
export async function cachedParallelFetch<T extends readonly (() => Promise<any>)[]>(
  cacheKey: string,
  operations: T,
  ttl: number = 60
): Promise<{ 
  [K in keyof T]: Awaited<ReturnType<T[K]>> | null 
}> {
  // In a real implementation, you'd use Redis or another cache
  // For now, we'll just execute the operations
  // This is a placeholder for cache implementation
  
  const results = await parallelFetch(operations);
  
  // Here you would typically:
  // 1. Check cache for existing data
  // 2. Return cached data if valid
  // 3. Fetch new data if cache miss or expired
  // 4. Store new data in cache with TTL
  
  return results;
}

/**
 * Deduplicate parallel requests
 * Ensures the same query isn't executed multiple times simultaneously
 */
class RequestDeduplicator {
  private pending = new Map<string, Promise<any>>();
  
  async fetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const existing = this.pending.get(key);
    if (existing) {
      return existing;
    }
    
    const promise = fetcher().finally(() => {
      this.pending.delete(key);
    });
    
    this.pending.set(key, promise);
    return promise;
  }
}

export const deduplicator = new RequestDeduplicator();

/**
 * Example usage in a Next.js page:
 * 
 * const [products, categories, user] = await parallelFetch([
 *   () => db.select().from(products).limit(10),
 *   () => db.select().from(categories),
 *   () => getUser(userId)
 * ]);
 * 
 * OR with named queries:
 * 
 * const data = await parallelQueries({
 *   products: () => db.select().from(products).limit(10),
 *   categories: () => db.select().from(categories),
 *   user: () => getUser(userId)
 * });
 */