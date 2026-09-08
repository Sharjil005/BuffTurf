import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking, payForBooking, type Booking } from '../services/api/booking';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const statusBadgeVariant: Record<Booking['status'], 'amber' | 'emerald' | 'red' | 'slate'> = {
  PENDING: 'amber',
  CONFIRMED: 'emerald',
  CANCELLED: 'red',
  COMPLETED: 'slate',
};

type Tab = 'upcoming' | 'past' | 'cancelled';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [tab, setTab] = useState<Tab>('upcoming');
  const [actioningId, setActioningId] = useState<number | null>(null);
  const [paymentError, setPaymentError] = useState<Record<number, string>>({});

  function load() {
    getMyBookings().then(setBookings);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel(id: number) {
    if (!confirm('Cancel this match booking? Your slot will be released.')) return;
    setActioningId(id);
    try {
      await cancelBooking(id);
      load();
    } finally {
      setActioningId(null);
    }
  }

  async function handlePay(id: number) {
    setActioningId(id);
    setPaymentError((prev) => ({ ...prev, [id]: '' }));
    try {
      const result = await payForBooking(id);
      if (result.payment.status === 'FAILED') {
        setPaymentError((prev) => ({ ...prev, [id]: 'Payment transaction could not be authorized. Please try again.' }));
      }
      load();
    } catch (err: any) {
      setPaymentError((prev) => ({ ...prev, [id]: err.response?.data?.message ?? 'Something went wrong' }));
    } finally {
      setActioningId(null);
    }
  }

  if (bookings === null) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-4 font-mono text-sm text-emerald-400">Loading your match passes...</p>
      </div>
    );
  }

  const now = new Date();
  const filtered = bookings.filter((b) => {
    if (tab === 'cancelled') return b.status === 'CANCELLED';
    const isPast = new Date(b.bookingDate) < now;
    if (tab === 'past') return b.status !== 'CANCELLED' && isPast;
    return b.status !== 'CANCELLED' && !isPast;
  });

  const tabs: { key: Tab; label: string; count: number }[] = [
    {
      key: 'upcoming',
      label: 'Upcoming Games',
      count: bookings.filter((b) => b.status !== 'CANCELLED' && new Date(b.bookingDate) >= now).length,
    },
    {
      key: 'past',
      label: 'Past Matches',
      count: bookings.filter((b) => b.status !== 'CANCELLED' && new Date(b.bookingDate) < now).length,
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      count: bookings.filter((b) => b.status === 'CANCELLED').length,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="border-b border-emerald-500/10 pb-6">
        <Badge variant="emerald">Player Dashboard</Badge>
        <h1 className="mt-2 font-display text-4xl font-black uppercase text-white">
          My Match Passes & Bookings
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          View your confirmed match tickets, pay for pending sessions, or review past games.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-emerald-500/10 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              tab === t.key
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_-3px_rgba(34,197,94,0.5)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                tab === t.key ? 'bg-black text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Booking Match Passes */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-emerald-500/20 bg-[#0C1410] p-16 text-center">
          <span className="text-4xl">🎟️</span>
          <h3 className="mt-4 font-display text-xl font-bold uppercase text-white">No {tab} match passes</h3>
          <p className="mt-1 text-xs text-slate-400">
            Ready to hit the pitch? Browse open slots in your city.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((booking) => (
            <Card key={booking.id} className="relative overflow-hidden p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-bold uppercase text-white">
                      {booking.turf.name}
                    </h3>
                    <Badge variant={statusBadgeVariant[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <span className="rounded-md border border-emerald-500/20 bg-[#121E18] px-2 py-0.5 font-semibold text-emerald-400">
                      ⚽ {booking.sport.name}
                    </span>
                    <span className="font-mono text-slate-300">
                      📅 {new Date(booking.bookingDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      ⏰ {booking.timeSlot.startTime} – {booking.timeSlot.endTime}
                    </span>
                  </div>
                  <div className="mt-2 font-mono text-sm font-bold text-white">
                    Fee: <span className="text-emerald-400">₹{booking.totalPrice}</span>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-3">
                  {booking.status === 'PENDING' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePay(booking.id)}
                        disabled={actioningId === booking.id}
                      >
                        {actioningId === booking.id ? 'Processing...' : 'Pay Fee ⚡'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancel(booking.id)}
                        disabled={actioningId === booking.id}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(booking.id)}
                      disabled={actioningId === booking.id}
                    >
                      {actioningId === booking.id ? 'Cancelling...' : 'Cancel Slot'}
                    </Button>
                  )}
                </div>
              </div>

              {paymentError[booking.id] && (
                <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-400">
                  {paymentError[booking.id]}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}