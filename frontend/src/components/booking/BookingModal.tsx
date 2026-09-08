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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-emerald-500/25 bg-[#0F1A15] p-6 shadow-2xl text-slate-100 sm:p-8">
        <div className="flex items-center justify-between border-b border-emerald-500/10 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Match Checkout Pass
            </span>
            <h2 className="font-display text-2xl font-black uppercase text-white">
              Confirm Pitch Slot
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-3.5 rounded-2xl border border-emerald-500/15 bg-[#0A120E] p-4 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Venue Pitch:</span>
            <span className="font-bold text-white text-right">{turfName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Sport:</span>
            <span className="font-bold text-emerald-400">{sportName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Match Date:</span>
            <span className="font-mono font-semibold text-white">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Session Window:</span>
            <span className="font-mono font-semibold text-emerald-400">
              {slot.startTime} – {slot.endTime}
            </span>
          </div>
          <div className="flex justify-between border-t border-emerald-500/10 pt-3">
            <span className="font-bold uppercase tracking-wider text-slate-300">Total Due:</span>
            <span className="font-mono text-lg font-black text-emerald-400">₹{slot.price}</span>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Locking Pitch...' : 'Lock Slot Now ⚡'}
          </Button>
        </div>
      </div>
    </div>
  );
}