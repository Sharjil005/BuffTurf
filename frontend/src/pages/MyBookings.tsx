import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking, payForBooking, type Booking } from '../services/api/booking';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const statusStyles: Record<Booking['status'], string> = {
  PENDING: 'bg-amber-500/10 text-amber-600',
  CONFIRMED: 'bg-pitch-500/10 text-pitch-500',
  CANCELLED: 'bg-red-500/10 text-red-500',
  COMPLETED: 'bg-ink-900/10 text-ink-900/60',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [actioningId, setActioningId] = useState<number | null>(null);
  const [paymentError, setPaymentError] = useState<Record<number, string>>({});

  function load() {
    getMyBookings().then(setBookings);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel(id: number) {
    if (!confirm('Cancel this booking?')) return;
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
        setPaymentError((prev) => ({
          ...prev,
          [id]: 'Payment failed. Please try again.',
        }));
      }
      load();
    } catch (err: any) {
      setPaymentError((prev) => ({
        ...prev,
        [id]: err.response?.data?.message ?? 'Something went wrong',
      }));
    } finally {
      setActioningId(null);
    }
  }

  if (bookings === null) {
    return <p className="mx-auto max-w-3xl px-4 py-10 text-ink-900/60">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl uppercase text-ink-900">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="mt-4 text-ink-900/60">You haven't made any bookings yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-ink-900">{booking.turf.name}</h3>
                  <p className="mt-1 text-sm text-ink-900/60">
                    {booking.sport.name} · {new Date(booking.bookingDate).toLocaleDateString()} ·{' '}
                    {booking.timeSlot.startTime}–{booking.timeSlot.endTime}
                  </p>
                  <p className="mt-1 font-mono text-sm text-turf-700">₹{booking.totalPrice}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>

              {paymentError[booking.id] && (
                <p className="mt-3 text-sm text-red-500">{paymentError[booking.id]}</p>
              )}

              <div className="mt-4 flex gap-4">
                {booking.status === 'PENDING' && (
                  <>
                    <Button
                      variant="primary"
                      className="px-4 py-2 text-sm"
                      onClick={() => handlePay(booking.id)}
                      disabled={actioningId === booking.id}
                    >
                      {actioningId === booking.id ? 'Processing...' : 'Pay Now'}
                    </Button>
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={actioningId === booking.id}
                      className="text-sm font-medium text-red-500 hover:underline"
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
                {booking.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={actioningId === booking.id}
                    className="text-sm font-medium text-red-500 hover:underline"
                  >
                    {actioningId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}