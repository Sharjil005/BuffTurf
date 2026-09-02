import { api } from './axios';

export interface Complaint {
  id: number;
  userId: number;
  turfId: number | null;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  user?: { id: number; name: string; email: string };
  turf?: { id: number; name: string };
}

export interface CreateComplaintPayload {
  subject: string;
  description: string;
  turfId?: number;
}

export async function createComplaint(payload: CreateComplaintPayload): Promise<Complaint> {
  const res = await api.post('/complaints', payload);
  return res.data.complaint;
}

export async function getMyComplaints(): Promise<Complaint[]> {
  const res = await api.get('/complaints/mine');
  return res.data.complaints;
}

export async function getOwnerComplaints(): Promise<Complaint[]> {
  const res = await api.get('/complaints/owner');
  return res.data.complaints;
}

export async function getAdminComplaints(): Promise<Complaint[]> {
  const res = await api.get('/complaints/admin');
  return res.data.complaints;
}

export async function updateComplaintStatus(
  id: number,
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
): Promise<Complaint> {
  const res = await api.patch(`/complaints/${id}/status`, { status });
  return res.data.complaint;
}
