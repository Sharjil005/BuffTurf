import { useEffect, useState, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getTurfSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  type TimeSlot,
} from '../../services/api/timeSlot';
import { getTurfById, type Turf } from '../../services/api/turf';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ManageSlots() {
  const { id } = useParams<{ id: string }>();
  const turfId = Number(id);

  const [turf, setTurf] = useState<Turf | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('07:00');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadData() {
    try {
      const [turfData, slotsData] = await Promise.all([
        getTurfById(turfId),
        getTurfSlots(turfId),
      ]);
      setTurf(turfData);
      setSlots(slotsData);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to load turf');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [turfId]);

  async function handleAddSlot(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await createTimeSlot(turfId, { dayOfWeek, startTime, endTime, price: Number(price) });
      setPrice('');
      await loadData();
    } catch (err: any) {
      setFormError(err.response?.data?.message ?? 'Failed to add slot');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(slot: TimeSlot) {
    await updateTimeSlot(turfId, slot.id, { isActive: !slot.isActive });
    loadData();
  }

  async function handleDelete(slotId: number) {
    if (!confirm('Delete this slot?')) return;
    await deleteTimeSlot(turfId, slotId);
    loadData();
  }

  if (loading) return <p className="px-4 py-10 text-ink-900/60">Loading...</p>;
  if (error) return <p className="px-4 py-10 text-red-500">{error}</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/owner/turfs" className="text-sm text-pitch-500 hover:underline">
        ← Back to My Turfs
      </Link>
      <h1 className="mt-2 font-display text-3xl uppercase text-ink-900">
        Manage Slots — {turf?.name}
      </h1>

      <form
        onSubmit={handleAddSlot}
        className="mt-8 flex flex-wrap items-end gap-4 rounded-lg border border-ink-900/10 p-5"
      >
        <div>
          <label className="text-sm font-medium text-ink-900">Day</label>
          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(Number(e.target.value))}
            className="mt-1.5 block rounded-md border border-ink-900/15 px-3 py-2 text-ink-900 outline-none focus:border-pitch-500"
          >
            {days.map((d, i) => (
              <option key={i} value={i}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink-900">Start</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1.5 block rounded-md border border-ink-900/15 px-3 py-2 text-ink-900 outline-none focus:border-pitch-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-900">End</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1.5 block rounded-md border border-ink-900/15 px-3 py-2 text-ink-900 outline-none focus:border-pitch-500"
          />
        </div>
        <div className="w-32">
          <Input
            label="Price (₹)"
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Slot'}
        </Button>
      </form>
      {formError && <p className="mt-2 text-sm text-red-500">{formError}</p>}

      <div className="mt-10 space-y-6">
        {days.map((day, dayIndex) => {
          const daySlots = slots.filter((s) => s.dayOfWeek === dayIndex);
          if (daySlots.length === 0) return null;
          return (
            <div key={dayIndex}>
              <h3 className="font-display text-xl uppercase text-turf-700">{day}</h3>
              <div className="mt-2 space-y-2">
                {daySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between rounded-md border border-ink-900/10 px-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-ink-900">
                        {slot.startTime} – {slot.endTime}
                      </span>
                      <span className="font-mono text-sm text-pitch-500">₹{slot.price}</span>
                      {!slot.isActive && (
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-500">
                          Blocked
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleActive(slot)}
                        className="text-sm font-medium text-ink-900/60 hover:text-pitch-500"
                      >
                        {slot.isActive ? 'Block' : 'Unblock'}
                      </button>
                      <button
                        onClick={() => handleDelete(slot.id)}
                        className="text-sm font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {slots.length === 0 && (
          <p className="text-ink-900/60">
            No slots added yet — use the form above to set your weekly schedule.
          </p>
        )}
      </div>
    </div>
  );
}