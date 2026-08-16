import { Request, Response } from 'express';
import * as turfService from '../services/turf.service';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../config/db';

export async function createTurf(req: Request, res: Response) {
  const turf = await turfService.createTurf(req.user!.userId, req.body);
  res.status(201).json({ success: true, turf });
}

export async function getMyTurfs(req: Request, res: Response) {
  const turfs = await turfService.getMyTurfs(req.user!.userId);
  res.json({ success: true, turfs });
}

export async function getTurf(req: Request, res: Response) {
  const turf = await turfService.getTurfById(Number(req.params.id));
  res.json({ success: true, turf });
}

export async function updateTurf(req: Request, res: Response) {
  const turf = await turfService.updateTurf(
    Number(req.params.id),
    req.user!.userId,
    req.user!.role,
    req.body
  );
  res.json({ success: true, turf });
}

export async function deleteTurf(req: Request, res: Response) {
  await turfService.deleteTurf(Number(req.params.id), req.user!.userId, req.user!.role);
  res.json({ success: true, message: 'Turf deleted' });
}

export async function uploadTurfImage(req: Request, res: Response) {
  if (!req.file) throw new ApiError(400, 'No image file provided');
  const url = await uploadBufferToCloudinary(req.file.buffer, 'buffturf/turfs');
  const image = await turfService.addTurfImage(
    Number(req.params.id),
    req.user!.userId,
    req.user!.role,
    url
  );
  res.status(201).json({ success: true, image });
}

export async function deleteTurfImage(req: Request, res: Response) {
  await turfService.deleteTurfImage(
    Number(req.params.id),
    Number(req.params.imageId),
    req.user!.userId,
    req.user!.role
  );
  res.json({ success: true, message: 'Image deleted' });
}

export async function listSports(req: Request, res: Response) {
  const sports = await prisma.sport.findMany({ orderBy: { name: 'asc' } });
  res.json({ success: true, sports });
}

export async function listFacilities(req: Request, res: Response) {
  const facilities = await prisma.facility.findMany({ orderBy: { name: 'asc' } });
  res.json({ success: true, facilities });
}