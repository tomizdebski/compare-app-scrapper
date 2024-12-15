// app/utils/cache.ts

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
  }
  
  const cache: { [key: string]: CacheEntry<unknown> } = {};
  
  export function getCache<T>(key: string): T | null {
    const entry = cache[key];
    if (entry && Date.now() < entry.expiresAt) {
      return entry.data as T;
    }
    return null;
  }
  
  export function setCache<T>(key: string, data: T, ttl: number): void {
    cache[key] = {
      data,
      expiresAt: Date.now() + ttl,
    };
  }
  