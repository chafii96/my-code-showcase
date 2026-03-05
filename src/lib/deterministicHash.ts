/**
 * Deterministic Hash Utility
 * Generates consistent, reproducible values from string inputs.
 * Used to replace Math.random() in Schema Markup to avoid Google penalties.
 * Values are stable across page loads - same input always produces same output.
 */

/**
 * Simple string hash function (djb2 algorithm)
 */
export function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate a deterministic rating value between min and max
 */
export function deterministicRating(seed: string, min: number = 4.5, max: number = 5.0): string {
  const hash = hashString(seed);
  const range = max - min;
  const value = min + (hash % 100) / 100 * range;
  return value.toFixed(1);
}

/**
 * Generate a deterministic integer between min and max
 */
export function deterministicCount(seed: string, min: number, max: number): number {
  const hash = hashString(seed);
  return min + (hash % (max - min));
}

/**
 * Generate a deterministic date within last N days from a fixed reference point
 * Uses 2026-01-15 as reference to avoid changing dates
 */
export function deterministicDate(seed: string, maxDaysAgo: number = 90): string {
  const referenceDate = new Date('2026-01-15T00:00:00Z');
  const hash = hashString(seed);
  const daysAgo = hash % maxDaysAgo;
  const date = new Date(referenceDate);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

/**
 * Pick a deterministic item from an array based on seed
 */
export function deterministicPick<T>(seed: string, arr: T[]): T {
  const hash = hashString(seed);
  return arr[hash % arr.length];
}

/**
 * Generate a deterministic rating value (integer 4 or 5) for individual reviews
 */
export function deterministicReviewRating(seed: string): number {
  const hash = hashString(seed);
  return hash % 5 === 0 ? 4 : 5; // Mostly 5 stars, occasional 4
}
