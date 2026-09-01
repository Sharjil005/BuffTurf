import { Request, Response } from 'express';
import * as reviewService from '../services/review.service';

export async function createReview(req: Request, res: Response) {
  const review = await reviewService.createReview(
    req.user!.userId,
    Number(req.params.id),
    req.body
  );
  res.status(201).json({ success: true, review });
}

export async function getTurfReviews(req: Request, res: Response) {
  const reviews = await reviewService.getTurfReviews(Number(req.params.id));
  res.json({ success: true, reviews });
}