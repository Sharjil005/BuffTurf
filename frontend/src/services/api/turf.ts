import { api } from './axios';

export interface Sport {
  id: number;
  name: string;
  slug: string;
}

export interface Facility {
  id: number;
  name: string;
}

export interface TurfImage {
  id: number;
  url: string;
}

export interface Turf {
  id: number;
  name: string;
  description: string | null;
  address: string;
  city: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  images: TurfImage[];
  turfSports: { sport: Sport }[];
  facilities: { facility: Facility }[];
}

export interface CreateTurfData {
  name: string;
  description?: string;
  address: string;
  city: string;
  sportIds: number[];
  facilityIds: number[];
}

export interface DiscoveryTurf {
  id: number;
  name: string;
  city: string;
  address: string;
  images: TurfImage[];
  turfSports: { sport: Sport }[];
  startingPrice: number | null;
  avgRating: number;
  reviewCount: number;
}

export interface GetTurfsParams {
  search?: string;
  city?: string;
  sportId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popularity';
  page?: number;
}

export interface GetTurfsResponse {
  turfs: DiscoveryTurf[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getSports(): Promise<Sport[]> {
  const res = await api.get('/turfs/sports');
  return res.data.sports;
}

export async function getFacilities(): Promise<Facility[]> {
  const res = await api.get('/turfs/facilities');
  return res.data.facilities;
}

export async function createTurf(data: CreateTurfData): Promise<Turf> {
  const res = await api.post('/turfs', data);
  return res.data.turf;
}

export async function getMyTurfs(): Promise<Turf[]> {
  const res = await api.get('/turfs/mine');
  return res.data.turfs;
}

export async function uploadTurfImage(turfId: number, file: File): Promise<TurfImage> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post(`/turfs/${turfId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.image;
}

export async function getTurfs(params?: GetTurfsParams): Promise<GetTurfsResponse> {
  const res = await api.get('/turfs', { params });
  return res.data;
}

export async function getTurfById(id: number): Promise<Turf> {
  const res = await api.get(`/turfs/${id}`);
  return res.data.turf;
}