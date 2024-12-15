// app/utils/rateLimiter.ts

interface RateLimitEntry {
    count: number;
    resetTime: number;
  }
  
  const rateLimitStore: { [key: string]: RateLimitEntry } = {};
  const MAX_REQUESTS = 10; // Maksymalna liczba zapytań
  const WINDOW_SIZE = 60 * 1000; // Okno czasowe w ms (1 minuta)
  
  export function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitStore[ip];
  
    if (!entry) {
      rateLimitStore[ip] = { count: 1, resetTime: now + WINDOW_SIZE };
      return false;
    }
  
    if (now > entry.resetTime) {
      // Resetuj licznik po upływie okna czasowego
      rateLimitStore[ip].count = 1;
      rateLimitStore[ip].resetTime = now + WINDOW_SIZE;
      return false;
    }
  
    if (entry.count < MAX_REQUESTS) {
      rateLimitStore[ip].count += 1;
      return false;
    }
  
    return true;
  }
  