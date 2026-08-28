import { useEffect, useState } from 'react';
import { getAllBookings, type AdminBooking } from '../../services/api/admin';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-600',
  CONFIRMED: 'bg-pitch-500/10 text-pitch-500',
  CANCELLED: 'bg-red-500/10 text-red-500',
  COMPLETED: 'bg-ink-900/10 text-ink-900/60',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);

  useEffect(() => {
    getAllBookings().then(setBookings);
  }, []);

  if (!bookings) return <p className="text-ink-900/60">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-ink-900">All Bookings</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-ink-900/10">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-900/10 bg-ink-900/5 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-ink-900/60">User</th>
              <th className="px-4 py-3 font-medium text-ink-900/60">Turf</th>
              <th className="px-4 py-3 font-medium text-ink-900/60">Sport</th>
              <th className="px-4 py-3 font-medium text-ink-900/60">Date</th>
              <th className="px-4 py-3 font-medium text-ink-900/60">Amount</th>
              <th className="px-4 py-3 font-medium text-ink-900/60">Status</th>
              <th className="px-4 py-3 font-medium text-ink-900/60">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/5">
            {bookings.map((b) => (
              <tr key={b.id} className="bg-chalk-50">
                <td className="px-4 py-3">
                  <p className="text-ink-900">{b.user.name}</p>
                  <p className="text-xs text-ink-900/50">{b.user.email}</p>
                </td>
                <td className="px-4 py-3 text-ink-900">{b.turf.name}</td>
                <td className="px-4 py-3 text-ink-900/60">{b.sport.name}</td>
                <td className="px-4 py-3 text-ink-900/60">
                  {new Date(b.bookingDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-mono text-turf-700">₹{b.totalPrice}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[b.status]}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-900/60">
                  {b.payment?.status ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}