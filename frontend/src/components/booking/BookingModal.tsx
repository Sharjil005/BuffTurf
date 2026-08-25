import { useState } from 'react';
import { createBooking } from '../../services/api/booking';
import type { SlotAvailability } from '../../services/api/timeSlot';
import Button from '../ui/Button';

interface BookingModalProps {
  turfId: number;
  turfName: string;
  sportId: number;
  sportName: string;
  date: string;
  slot: SlotAvailability;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({
  turfId,
  turfName,
  sportId,
  sportName,
  date,
  slot,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      await createBooking({ turfId, timeSlotId: slot.id, sportId, bookingDate: date });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Booking failed, please try again');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-chalk-50 p-6">
        <h2 className="font-display text-2xl uppercase text-ink-900">Confirm Booking</h2>

        <div className="mt-4 space-y-2 text-sm text-ink-900/80">
          <div className="flex justify-between">
            <span>Turf</span>
            <span className="font-medium">{turfName}</span>
          </div>
          <div className="flex justify-between">
            <span>Sport</span>
            <span className="font-medium">{sportName}</span>
          </div>
          <div className="flex justify-between">
            <span>Date</span>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex justify-between">
            <span>Time</span>
            <span className="font-medium">
              {slot.startTime} – {slot.endTime}
            </span>
          </div>
          <div className="flex justify-between border-t border-ink-900/10 pt-2 font-mono text-turf-700">
            <span>Total</span>
            <span>₹{slot.price}</span>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Booking...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}