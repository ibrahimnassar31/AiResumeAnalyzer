import { store } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

export const isArabic = (text: string): boolean => {
  return /[\u0600-\u06FF]/.test(text);
};

export const isRTL = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dir === 'rtl';
};

export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function safeJsonParse<T = any>(str: string, fallback?: T): T | undefined {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function decodeJwt(token: string): { exp?: number } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(endpoint, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    let errorMsg = 'حدث خطأ في الطلب';
    let isAuthError = false;
    try {
      const data = await res.json();
      errorMsg = data.message || data.error || errorMsg;
      if (
        res.status === 401 ||
        res.status === 403 ||
        /token|auth|expired|unauthorized/i.test(errorMsg)
      ) {
        isAuthError = true;
      }
    } catch {}
    if (isAuthError) {
      store.dispatch(logout());
    }
    throw new Error(errorMsg);
  }
  if (res.status === 204) return null as T;
  return res.json();
}
