/**
 * Security utilities for zero-trust architecture
 * Implements cryptographic functions and secure storage
 */

/**
 * Cryptographically secure random ID generation
 */
export function generateSecureId(): string {
  // Use Web Crypto API for cryptographically secure random values
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // Convert to hex string
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Secure hash function for data integrity
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Rate limiting check (client-side, for UX)
 * Note: Real rate limiting should be implemented server-side
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove attempts outside the time window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter(10, 60000); // 10 attempts per minute

/**
 * Secure storage wrapper with validation
 */
export class SecureStorage {
  private static readonly STORAGE_KEY_PREFIX = 'devlog_';

  static setItem(key: string, value: string): void {
    try {
      // Validate key
      if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
        throw new Error('Invalid storage key');
      }

      // Check storage quota (5MB limit)
      const currentSize = new Blob([value]).size;
      if (currentSize > 5 * 1024 * 1024) {
        throw new Error('Storage quota exceeded');
      }

      const fullKey = `${this.STORAGE_KEY_PREFIX}${key}`;
      localStorage.setItem(fullKey, value);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some entries.');
      }
      throw error;
    }
  }

  static getItem(key: string): string | null {
    if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
      return null;
    }

    const fullKey = `${this.STORAGE_KEY_PREFIX}${key}`;
    return localStorage.getItem(fullKey);
  }

  static removeItem(key: string): void {
    if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
      return;
    }

    const fullKey = `${this.STORAGE_KEY_PREFIX}${key}`;
    localStorage.removeItem(fullKey);
  }

  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

/**
 * Content Security Policy configuration
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Required for Vite dev
  'style-src': ["'self'", "'unsafe-inline'"], // Required for Tailwind
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'upgrade-insecure-requests': [],
} as const;

/**
 * Generate CSP header string
 */
export function generateCSPHeader(): string {
  return Object.entries(CSP_CONFIG)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}
