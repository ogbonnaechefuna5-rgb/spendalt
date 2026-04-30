import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Application from 'expo-application';

export const BASE_URL = 'https://superior-nanometer-immunity.ngrok-free.dev/api/v1';
const TOKEN_KEY = 'spendalt_jwt';

const REFRESH_TOKEN_KEY = 'spendalt_refresh_token';
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];
let refreshFn: (() => Promise<string | null>) | null = null;

// Called once by AuthProvider to register the canonical refresh implementation
export function setRefreshHandler(fn: () => Promise<string | null>) { refreshFn = fn; }

type Listener = () => void;
let unauthorizedListener: Listener | null = null;
export function setUnauthorizedListener(fn: Listener) { unauthorizedListener = fn; }

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

async function tryRefresh(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise(resolve => refreshQueue.push(resolve));
  }
  isRefreshing = true;
  try {
    // Delegate to auth-context's refreshSession to avoid duplicate token rotation
    const token = refreshFn ? await refreshFn() : null;
    refreshQueue.forEach(resolve => resolve(token));
    return token;
  } finally {
    isRefreshing = false;
    refreshQueue = [];
  }
}

type RequestOptions = {
  method?: string;
  body?: object;
  auth?: boolean;
};

async function executeRequest(path: string, opts: RequestOptions, token: string | null): Promise<Response> {
  const { method = 'GET', body } = opts;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
  };
  try {
    const deviceName = Device.deviceName ?? Device.modelName ?? '';
    const appVersion = Application.nativeApplicationVersion ?? '';
    if (deviceName) headers['X-Device'] = deviceName;
    if (appVersion) headers['X-App-Version'] = appVersion;
  } catch { /* non-critical, skip headers if device info unavailable */ }
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { auth = true } = opts;

  let token = auth ? await getToken() : null;
  let res = await executeRequest(path, opts, token);
  let refreshed = false;

  // On 401, attempt a silent token refresh then retry once
  if (res.status === 401 && auth) {
    const newToken = await tryRefresh();
    if (newToken) {
      token = newToken;
      res = await executeRequest(path, opts, token);
      refreshed = true;
    } else {
      await clearToken();
      unauthorizedListener?.();
      router.replace('/login');
      throw new Error('unauthorized');
    }
  }

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Server error (${res.status}): unexpected response format`);
  }

  if (!res.ok) {
    // Only force logout if we tried to refresh and still got 401 — not on first 401
    if (res.status === 401 && auth && refreshed) {
      await clearToken();
      unauthorizedListener?.();
      router.replace('/login');
    }
    throw new Error(data?.error ?? `Request failed: ${res.status}`);
  }

  return data as T;
}
