import { apiRequest, saveToken } from './api';

type UserPayload = {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
};

type LoginResponse = {
  token: string;
  refresh_token: string;
  user: UserPayload;
};

type RefreshResponse = {
  token: string;
  refresh_token: string;
};

type SignupResponse = {
  message: string;
  user: UserPayload;
};

export type AuthResult = {
  token: string;
  refresh_token: string;
  user_id: string;
};

export async function login(identifier: string, password: string): Promise<AuthResult> {
  const data = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { identifier, password },
    auth: false,
  });
  await saveToken(data.token);
  return { token: data.token, refresh_token: data.refresh_token, user_id: data.user.id };
}

export async function refresh(refreshToken: string): Promise<RefreshResponse> {
  const data = await apiRequest<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken },
    auth: false,
  });
  await saveToken(data.token);
  return data;
}

export async function logout(refreshToken?: string): Promise<void> {
  await apiRequest('/auth/logout', {
    method: 'POST',
    body: refreshToken ? { refresh_token: refreshToken } : {},
    auth: false,
  });
}

export async function signup(
  phone: string,
  password: string,
  firstName: string,
  lastName: string,
  email?: string,
  middleName?: string,
): Promise<AuthResult> {
  await apiRequest<SignupResponse>('/auth/signup', {
    method: 'POST',
    body: { phone, password, first_name: firstName, middle_name: middleName, last_name: lastName, email },
    auth: false,
  });
  return login(phone, password);
}
