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