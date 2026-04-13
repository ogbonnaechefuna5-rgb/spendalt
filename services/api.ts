import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export const BASE_URL = 'https://superior-nanometer-immunity.ngrok-free.dev/api/v1';
const TOKEN_KEY = 'spendalt_jwt';

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

type RequestOptions = {
  method?: string;
  body?: object;
  auth?: boolean;
};

export async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = opts;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 && auth) {
      await clearToken();
      unauthorizedListener?.();
      router.replace('/login');
    }
    throw new Error(data?.error ?? `Request failed: ${res.status}`);
  }

  return data as T;
}
