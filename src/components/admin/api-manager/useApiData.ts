import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = '/api';
const STORAGE_PREFIX = 'api_mgr_';

function getStorageKey(endpoint: string) {
  return STORAGE_PREFIX + endpoint.replace(/\//g, '_');
}

function loadFromStorage<T>(endpoint: string): T | null {
  try {
    const raw = localStorage.getItem(getStorageKey(endpoint));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveToStorage<T>(endpoint: string, data: T) {
  try {
    localStorage.setItem(getStorageKey(endpoint), JSON.stringify(data));
  } catch {}
}

/**
 * Generic hook: fetches from backend API, falls back to localStorage, then to fallback defaults.
 * All state changes are auto-persisted to localStorage.
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
  persist: (newData: T) => void;
} {
  const storageKey = getStorageKey(endpoint);
  const enabled = options?.enabled !== false;

  // Initialize: localStorage → fallback
  const [data, setDataRaw] = useState<T>(() => {
    const stored = loadFromStorage<T>(endpoint);
    return stored !== null ? stored : fallbackData;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Wrapper: auto-persist every setData call
  const setData: React.Dispatch<React.SetStateAction<T>> = useCallback((action) => {
    setDataRaw(prev => {
      const next = typeof action === 'function' ? (action as (p: T) => T)(prev) : action;
      saveToStorage(endpoint, next);
      return next;
    });
  }, [endpoint]);

  // Persist helper for external callers
  const persist = useCallback((newData: T) => {
    setDataRaw(newData);
    saveToStorage(endpoint, newData);
  }, [endpoint]);

  const fetchData = useCallback(async (silent = false) => {
    if (!enabled) return;
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { signal: AbortSignal.timeout(5000) });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) throw new Error('Backend offline');
      const json = await res.json();
      setDataRaw(json);
      saveToStorage(endpoint, json);
      setIsLive(true);
      setError(null);
    } catch {
      // Don't overwrite localStorage data on fetch failure
      setIsLive(false);
      setError('الخادم غير متصل — البيانات محفوظة محلياً');
    } finally {
      setLoading(false);
    }
  }, [endpoint, enabled]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (options?.pollingInterval && enabled) {
      intervalRef.current = setInterval(() => fetchData(true), options.pollingInterval);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [options?.pollingInterval, fetchData, enabled]);

  return { data, setData, loading, error, refetch: () => fetchData(), isLive, persist };
}

/**
 * POST/PUT/DELETE helper — also updates localStorage
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
    // Return ok:false but don't block — localStorage handles persistence
    return { ok: false, error: e.message || 'Request failed' };
  }
}
