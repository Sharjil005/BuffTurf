import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';
import type { CreateComplaintInput } from '../validators/complaint.validator';
import { createNotification } from './notification.service';

export async function createComplaint(userId: number, input: CreateComplaintInput) {
  if (input.turfId) {
    const turf = await prisma.turf.findUnique({ where: { id: input.turfId } });
    if (!turf) throw new ApiError(404, 'Turf not found');
  }

  return prisma.complaint.create({
    data: {
      userId,
      turfId: input.turfId ?? null,
      subject: input.subject,
      description: input.description,
      status: 'OPEN',
    },
    include: {
      turf: { select: { id: true, name: true } },
    },
  });
}

export async function getMyComplaints(userId: number) {
  return prisma.complaint.findMany({
    where: { userId },
    include: {
      turf: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllComplaints() {
  return prisma.complaint.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      turf: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOwnerComplaints(ownerId: number) {
  const turfs = await prisma.turf.findMany({
    where: { ownerId },
    select: { id: true },
  });
  const turfIds = turfs.map((t) => t.id);

  if (turfIds.length === 0) return [];

  return prisma.complaint.findMany({
    where: { turfId: { in: turfIds } },
    include: {
      user: { select: { id: true, name: true, email: true } },
      turf: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateComplaintStatus(
  complaintId: number,
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED',
  requesterUserId: number,
  role: string
) {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
    include: { turf: true },
  });

  if (!complaint) throw new ApiError(404, 'Complaint not found');

  if (role !== 'ADMIN') {
    if (!complaint.turf || complaint.turf.ownerId !== requesterUserId) {
      throw new ApiError(403, 'You do not have permission to modify this complaint');
    }
  }

  const updatedComplaint = await prisma.complaint.update({
    where: { id: complaintId },
    data: { status },
    include: {
      user: { select: { id: true, name: true, email: true } },
      turf: { select: { id: true, name: true } },
    },
  });

  // Notify complaint creator of status update
  await createNotification(
    complaint.userId,
    'COMPLAINT_UPDATED',
    `Your support request regarding "${complaint.subject}" status is now ${status.replace('_', ' ')}.`
  );

  return updatedComplaint;
}
