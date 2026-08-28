import { api } from './axios';

export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  totalRevenue: number;
  popularSports: { sport: string; count: number }[];
  recentBookings: {
    id: number;
    bookingDate: string;
    status: string;
    totalPrice: string;
    turf: { name: string };
    sport: { name: string };
    user: { name: string };
  }[];
}

export interface OwnerBooking {
  id: number;
  bookingDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalPrice: string;
  turf: { id: number; name: string };
  timeSlot: { startTime: string; endTime: string };
  sport: { name: string };
  user: { name: string; email: string };
  payment: { status: string } | null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get('/owner/dashboard');
  return res.data.stats;
}

export async function getOwnerBookings(): Promise<OwnerBooking[]> {
  const res = await api.get('/owner/bookings');
  return res.data.bookings;
}

export async function markBookingCompleted(id: number): Promise<OwnerBooking> {
  const res = await api.patch(`/owner/bookings/${id}/complete`);
  return res.data.booking;
}