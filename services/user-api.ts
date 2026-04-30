import { apiRequest } from './api';

export type UserProfile = {
  id: string;
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
};

export type UserPreferences = {
  sms_detection: boolean;
  analytics: boolean;
  partner_offers: boolean;
};

export type LinkedAccount = {
  id: string;
  bank_name: string;
  account_type: string;
  account_number: string;
  balance: number;
  status: string;
  last_sync: string;
  created_at: string;
};

export type UserSession = {
  id: string;
  device: string;
  device_type: string;
  os: string;
  app_version: string;
  ip_address: string;
  created_at: string;
  expires_at: string;
};

export type ActivityLog = {
  id: string;
  method: string;
  path: string;
  status: number;
  latency_ms: number;
  device_type: string;
  os: string;
  app_version: string;
  ip: string;
  created_at: string;
};

export async function getProfile(): Promise<UserProfile> {
  const data = await apiRequest<{ user: UserProfile }>('/user/profile');
  return data.user;
}

export async function updateProfile(payload: {
  first_name: string;
  last_name: string;
  phone: string;
}): Promise<void> {
  await apiRequest('/user/profile', { method: 'PUT', body: payload });
}

export async function changePassword(payload: {
  old_password: string;
  new_password: string;
}): Promise<void> {
  await apiRequest('/user/change-password', { method: 'POST', body: payload });
}

export async function deleteAccount(): Promise<void> {
  await apiRequest('/user/account', { method: 'DELETE' });
}

export async function getPreferences(): Promise<UserPreferences> {
  const data = await apiRequest<{ preferences: UserPreferences }>('/user/preferences');
  return data.preferences;
}

export async function savePreferences(payload: UserPreferences): Promise<void> {
  await apiRequest('/user/preferences', { method: 'PUT', body: payload });
}

export async function getLinkedAccounts(): Promise<LinkedAccount[]> {
  const data = await apiRequest<{ accounts: LinkedAccount[] }>('/user/linked-accounts');
  return data.accounts ?? [];
}

export async function removeLinkedAccount(id: string): Promise<void> {
  await apiRequest(`/user/linked-accounts/${id}`, { method: 'DELETE' });
}

export async function syncLinkedAccount(id: string): Promise<void> {
  await apiRequest(`/user/linked-accounts/${id}/sync`, { method: 'POST' });
}

export async function getSessions(): Promise<UserSession[]> {
  const data = await apiRequest<{ sessions: UserSession[] }>('/user/sessions');
  return data.sessions ?? [];
}

export async function revokeAllSessions(): Promise<void> {
  await apiRequest('/user/sessions', { method: 'DELETE' });
}

export async function revokeSession(id: string): Promise<void> {
  await apiRequest(`/user/sessions/${id}`, { method: 'DELETE' });
}

