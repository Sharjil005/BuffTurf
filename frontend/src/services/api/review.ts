import { api } from './axios';

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string };
}

export async function getTurfReviews(turfId: number): Promise<Review[]> {
  const res = await api.get(`/turfs/${turfId}/reviews`);
  return res.data.reviews;
}

export async function createReview(
  turfId: number,
  data: { bookingId: number; rating: number; comment?: string }
): Promise<Review> {
  const res = await api.post(`/turfs/${turfId}/reviews`, data);
  return res.data.review;
}