import { api } from './axios';

export interface OwnerAnalyticsData {
  totalTurfs: number;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  monthlyRevenue: { month: string; revenue: number }[];
  peakHours: { time: string; count: number }[];
  sportDistribution: { sport: string; count: number }[];
}

export interface AdminAnalyticsData {
  totalUsers: number;
  totalTurfs: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topTurfs: { id: number; name: string; city: string; bookingsCount: number }[];
}

export async function getOwnerAnalytics(): Promise<OwnerAnalyticsData> {
  const res = await api.get('/analytics/owner');
  return res.data.analytics;
}

export async function getAdminAnalytics(): Promise<AdminAnalyticsData> {
  const res = await api.get('/analytics/admin');
  return res.data.analytics;
}

export async function downloadBookingsCSV(): Promise<void> {
  const res = await api.get('/analytics/export/bookings', {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'buffturf-bookings-report.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
