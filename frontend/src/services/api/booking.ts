import { api } from './axios';

export interface Booking {
  id: number;
  turfId: number;
  timeSlotId: number;
  sportId: number;
  bookingDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalPrice: string;
  createdAt: string;
  turf: { id: number; name: string; city: string; address: string };
  timeSlot: { id: number; startTime: string; endTime: string; price: string };
  sport: { id: number; name: string };
}

export interface CreateBookingData {
  turfId: number;
  timeSlotId: number;
  sportId: number;
  bookingDate: string;
}

export async function createBooking(data: CreateBookingData): Promise<Booking> {
  const res = await api.post('/bookings', data);
  return res.data.booking;
}

export async function getMyBookings(): Promise<Booking[]> {
  const res = await api.get('/bookings');
  return res.data.bookings;
}

export async function cancelBooking(id: number): Promise<Booking> {
  const res = await api.patch(`/bookings/${id}/cancel`);
  return res.data.booking;
}

export interface PaymentResult {
  payment: {
    id: number;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    transactionRef: string | null;
  };
  bookingStatus: Booking['status'];
}

export async function payForBooking(bookingId: number): Promise<PaymentResult> {
  const res = await api.post(`/bookings/${bookingId}/pay`, { method: 'MOCK' });
  return res.data;
}