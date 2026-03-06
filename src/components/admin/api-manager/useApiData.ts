import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = '/api';

/**
 * Generic hook to fetch data from backend API with fallback to mock data.
 * Supports optional polling interval for real-time updates.
 */
export function useApiData<T>(
  endpoint: string,
  fallbackData: T,
  options?: { pollingInterval?: number; enabled?: boolean }
): {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isLive: boolean;
} {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const enabled = options?.enabled !== false;

  const fetchData = useCallback(async (silent = false) => {
    if (!enabled) return;
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { signal: AbortSignal.timeout(5000) });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) throw new Error('Backend offline');
      const json = await res.json();
      setData(json);
      setIsLive(true);
      setError(null);
    } catch {
      if (!isLive) {
        // First load failed — use fallback
        setData(fallbackData);
      }
      setIsLive(false);
      setError('Backend offline — using local data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Polling
  useEffect(() => {
    if (options?.pollingInterval && enabled) {
      intervalRef.current = setInterval(() => fetchData(true), options.pollingInterval);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [options?.pollingInterval, fetchData, enabled]);

  return { data, setData, loading, error, refetch: () => fetchData(), isLive };
}

/**
 * POST/PUT/DELETE helper with error handling
 */
export async function apiCall<T = any>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  body?: any
): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e.message || 'Request failed' };
  }
}
