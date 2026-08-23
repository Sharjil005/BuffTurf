import { Request, Response } from 'express';
import * as timeSlotService from '../services/timeSlot.service';

export async function createTimeSlot(req: Request, res: Response) {
  const slot = await timeSlotService.createTimeSlot(
    Number(req.params.id),
    req.user!.userId,
    req.user!.role,
    req.body
  );
  res.status(201).json({ success: true, slot });
}

export async function getTurfSlots(req: Request, res: Response) {
  const slots = await timeSlotService.getTurfSlots(Number(req.params.id));
  res.json({ success: true, slots });
}

export async function updateTimeSlot(req: Request, res: Response) {
  const slot = await timeSlotService.updateTimeSlot(
    Number(req.params.id),
    Number(req.params.slotId),
    req.user!.userId,
    req.user!.role,
    req.body
  );
  res.json({ success: true, slot });
}

export async function deleteTimeSlot(req: Request, res: Response) {
  await timeSlotService.deleteTimeSlot(
    Number(req.params.id),
    Number(req.params.slotId),
    req.user!.userId,
    req.user!.role
  );
  res.json({ success: true, message: 'Time slot deleted' });
}