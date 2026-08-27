import { Request, Response } from 'express';
import * as favoriteService from '../services/favorite.service';

export async function addFavorite(req: Request, res: Response) {
  await favoriteService.addFavorite(req.user!.userId, Number(req.params.turfId));
  res.status(201).json({ success: true, message: 'Added to favorites' });
}

export async function removeFavorite(req: Request, res: Response) {
  await favoriteService.removeFavorite(req.user!.userId, Number(req.params.turfId));
  res.json({ success: true, message: 'Removed from favorites' });
}

export async function getMyFavorites(req: Request, res: Response) {
  const turfs = await favoriteService.getMyFavorites(req.user!.userId);
  res.json({ success: true, turfs });
}