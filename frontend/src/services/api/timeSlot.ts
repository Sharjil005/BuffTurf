import { api } from './axios';

export interface TimeSlot {
  id: number;
  turfId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  price: string;
  isActive: boolean;
}

export interface CreateTimeSlotData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  price: number;
}

export async function getTurfSlots(turfId: number): Promise<TimeSlot[]> {
  const res = await api.get(`/turfs/${turfId}/slots`);
  return res.data.slots;
}

export async function createTimeSlot(
  turfId: number,
  data: CreateTimeSlotData
): Promise<TimeSlot> {
  const res = await api.post(`/turfs/${turfId}/slots`, data);
  return res.data.slot;
}

export async function updateTimeSlot(
  turfId: number,
  slotId: number,
  data: Partial<CreateTimeSlotData & { isActive: boolean }>
): Promise<TimeSlot> {
  const res = await api.patch(`/turfs/${turfId}/slots/${slotId}`, data);
  return res.data.slot;
}

export async function deleteTimeSlot(turfId: number, slotId: number): Promise<void> {
  await api.delete(`/turfs/${turfId}/slots/${slotId}`);
}

export interface SlotAvailability extends TimeSlot {
  isBooked: boolean;
}

export async function getAvailability(turfId: number, date: string): Promise<SlotAvailability[]> {
  const res = await api.get(`/turfs/${turfId}/availability`, { params: { date } });
  return res.data.slots;
}