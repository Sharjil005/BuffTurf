import { Request, Response } from 'express';
import * as analyticsService from '../services/analytics.service';
import { ApiError } from '../utils/ApiError';

export async function getOwnerAnalytics(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const analytics = await analyticsService.getOwnerAnalytics(req.user.id);
  res.json({ analytics });
}

export async function getAdminAnalytics(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const analytics = await analyticsService.getAdminAnalytics();
  res.json({ analytics });
}

export async function exportBookingsCSV(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
  const csvData = await analyticsService.exportBookingsCSV(
    req.user.id,
    req.user.role,
    startDate,
    endDate
  );

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="buffturf-bookings-export.csv"');
  res.status(200).send(csvData);
}
