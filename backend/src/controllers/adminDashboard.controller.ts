import { Request, Response } from 'express';
import * as adminService from '../services/adminDashboard.service';

export async function getPlatformStats(req: Request, res: Response) {
  const stats = await adminService.getPlatformStats();
  res.json({ success: true, stats });
}

export async function getAllUsers(req: Request, res: Response) {
  const users = await adminService.getAllUsers();
  res.json({ success: true, users });
}

export async function updateUserRole(req: Request, res: Response) {
  const user = await adminService.updateUserRole(Number(req.params.id), req.body.role);
  res.json({ success: true, user });
}

export async function getAllTurfs(req: Request, res: Response) {
  const turfs = await adminService.getAllTurfs();
  res.json({ success: true, turfs });
}

export async function updateTurfStatus(req: Request, res: Response) {
  const turf = await adminService.updateTurfStatus(Number(req.params.id), req.body.status);
  res.json({ success: true, turf });
}

export async function getAllBookings(req: Request, res: Response) {
  const bookings = await adminService.getAllBookings();
  res.json({ success: true, bookings });
}