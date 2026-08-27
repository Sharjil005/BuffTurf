import { useEffect, useState } from 'react';
import {
  getOwnerBookings,
  markBookingCompleted,
  type OwnerBooking,
} from '../../services/api/ownerDashboard';
import Card from '../../components/ui/Card';

const statusStyles: Record<OwnerBooking['status'], string> = {
  PENDING: 'bg-amber-500/10 text-amber-600',
  CONFIRMED: 'bg-pitch-500/10 text-pitch-500',
  CANCELLED: 'bg-red-500/10 text-red-500',
  COMPLETED: 'bg-ink-900/10 text-ink-900/60',
};

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<OwnerBooking[] | null>(null);
  const [actioningId, setActioningId] = useState<number | null>(null);

  function load() {
    getOwnerBookings().then(setBookings);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleComplete(id: number) {
    setActioningId(id);
    try {
      await markBookingCompleted(id);
      load();
    } finally {
      setActioningId(null);
    }
  }

  if (!bookings) return <p className="text-ink-900/60">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-ink-900">Bookings</h1>

      {bookings.length === 0 ? (
        <p className="mt-4 text-ink-900/60">No bookings across your turfs yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.map((b) => (
            <Card key={b.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-ink-900">{b.turf.name}</h3>
                  <p className="mt-1 text-sm text-ink-900/60">
                    {b.user.name} ({b.user.email})
                  </p>
                  <p className="mt-1 text-sm text-ink-900/60">
                    {b.sport.name} · {new Date(b.bookingDate).toLocaleDateString()} ·{' '}
                    {b.timeSlot.startTime}–{b.timeSlot.endTime}
                  </p>
                  <p className="mt-1 font-mono text-sm text-turf-700">₹{b.totalPrice}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[b.status]}`}>
                  {b.status}
                </span>
              </div>
              {b.status === 'CONFIRMED' && new Date(b.bookingDate) < new Date() && (
                <button
                  onClick={() => handleComplete(b.id)}
                  disabled={actioningId === b.id}
                  className="mt-3 text-sm font-medium text-pitch-500 hover:underline"
                >
                  {actioningId === b.id ? 'Updating...' : 'Mark as Completed'}
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}