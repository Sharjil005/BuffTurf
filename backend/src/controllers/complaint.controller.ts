import { Request, Response } from 'express';
import * as complaintService from '../services/complaint.service';
import { ApiError } from '../utils/ApiError';

export async function createComplaint(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const complaint = await complaintService.createComplaint(req.user.id, req.body);
  res.status(201).json({ complaint });
}

export async function getMyComplaints(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const complaints = await complaintService.getMyComplaints(req.user.id);
  res.json({ complaints });
}

export async function getAllComplaints(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const complaints = await complaintService.getAllComplaints();
  res.json({ complaints });
}

export async function getOwnerComplaints(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const complaints = await complaintService.getOwnerComplaints(req.user.id);
  res.json({ complaints });
}

export async function updateStatus(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const complaintId = Number(req.params.id);
  if (isNaN(complaintId)) throw new ApiError(400, 'Invalid complaint ID');

  const { status } = req.body;
  const complaint = await complaintService.updateComplaintStatus(
    complaintId,
    status,
    req.user.id,
    req.user.role
  );
  res.json({ complaint });
}
