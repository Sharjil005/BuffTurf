import { api } from './axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'TURF_OWNER' | 'ADMIN';
  phone: string | null;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'TURF_OWNER';
}

export interface LoginData {
  email: string;
  password: string;
}

export async function registerRequest(data: RegisterData): Promise<User> {
  const res = await api.post('/auth/register', data);
  return res.data.user;
}

export async function loginRequest(data: LoginData): Promise<User> {
  const res = await api.post('/auth/login', data);
  return res.data.user;
}

export async function logoutRequest(): Promise<void> {
  await api.post('/auth/logout');
}

export async function meRequest(): Promise<User> {
  const res = await api.get('/auth/me');
  return res.data.user;
}

export async function updateProfile(data: { name?: string; phone?: string }): Promise<User> {
  const res = await api.patch('/auth/me', data);
  return res.data.user;
}