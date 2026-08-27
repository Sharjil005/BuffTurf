import { api } from './axios';
import type { DiscoveryTurf } from './turf';

export async function getMyFavorites(): Promise<DiscoveryTurf[]> {
  const res = await api.get('/favorites');
  return res.data.turfs;
}

export async function addFavorite(turfId: number): Promise<void> {
  await api.post(`/favorites/${turfId}`);
}

export async function removeFavorite(turfId: number): Promise<void> {
  await api.delete(`/favorites/${turfId}`);
}