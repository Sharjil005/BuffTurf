import { api } from './axios';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'TURF_OWNER' | 'ADMIN';
  createdAt: string;
}

export interface AdminTurf {
  id: number;
  name: string;
  city: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  owner: { name: string; email: string };
  turfSports: { sport: { name: string } }[];
}

export interface AdminBooking {
  id: number;
  bookingDate: string;
  status: string;
  totalPrice: string;
  user: { name: string; email: string };
  turf: { name: string };
  sport: { name: string };
  payment: { status: string } | null;
}

export interface PlatformStats {
  totalUsers: number;
  totalTurfs: number;
  totalBookings: number;
  pendingTurfs: number;
  totalRevenue: number;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const res = await api.get('/admin/stats');
  return res.data.stats;
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const res = await api.get('/admin/users');
  return res.data.users;
}

export async function updateUserRole(id: number, role: string): Promise<AdminUser> {
  const res = await api.patch(`/admin/users/${id}/role`, { role });
  return res.data.user;
}

export async function getAllTurfs(): Promise<AdminTurf[]> {
  const res = await api.get('/admin/turfs');
  return res.data.turfs;
}

export async function updateTurfStatus(id: number, status: 'APPROVED' | 'REJECTED'): Promise<AdminTurf> {
  const res = await api.patch(`/admin/turfs/${id}/status`, { status });
  return res.data.turf;
}

export async function getAllBookings(): Promise<AdminBooking[]> {
  const res = await api.get('/admin/bookings');
  return res.data.bookings;
}