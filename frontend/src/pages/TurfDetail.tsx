import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTurfById, type Turf } from '../services/api/turf';
import { getAvailability, getTurfSlots, type SlotAvailability, type TimeSlot } from '../services/api/timeSlot';
import { getTurfReviews, type Review } from '../services/api/review';
import { getMyBookings } from '../services/api/booking';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import DatePicker from '../components/booking/DatePicker';
import BookingModal from '../components/booking/BookingModal';
import ReviewForm from '../components/review/ReviewForm';
import ReviewList from '../components/review/ReviewList';
import FavoriteButton from '../components/turf/FavoriteButton';

export default function TurfDetail() {
  const { id } = useParams<{ id: string }>();
  const turfId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState<SlotAvailability[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotAvailability | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [completedBookingId, setCompletedBookingId] = useState<number | null>(null);

  function loadReviews() {
    getTurfReviews(turfId).then(setReviews);
  }

  useEffect(() => {
    Promise.all([getTurfById(turfId), getTurfReviews(turfId)])
      .then(([turfData, reviewsData]) => {
        setTurf(turfData);
        setReviews(reviewsData);
      })
      .catch((err) => setError(err.response?.data?.message ?? 'Turf not found'))
      .finally(() => setLoading(false));
  }, [turfId]);

  useEffect(() => {
    if (!date) return;
    setLoadingAvailability(true);
    getAvailability(turfId, date)
      .then(setAvailability)
      .finally(() => setLoadingAvailability(false));
  }, [turfId, date]);

  useEffect(() => {
    if (!user) return;
    getMyBookings().then((bookings) => {
      const completed = bookings.find(
        (b) => b.turfId === turfId && b.status === 'COMPLETED'
      );
      setCompletedBookingId(completed?.id ?? null);
    });
  }, [user, turfId]);

  useEffect(() => {
    setAvailability([]);
    setDate((d) => d);
  }, []);

  if (loading) return <p className="px-4 py-10 text-center text-ink-900/60">Loading...</p>;
  if (error || !turf) {
    return <p className="px-4 py-10 text-center text-red-500">{error ?? 'Turf not found'}</p>;
  }

  const startingPrice = availability.length
    ? Math.min(...availability.map((s) => Number(s.price)))
    : null;

  function handleBookClick(slot: SlotAvailability) {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedSlot(slot);
  }

  function handleBookingSuccess() {
    setSelectedSlot(null);
    setBookingSuccess(true);
    getAvailability(turfId, date).then(setAvailability);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="h-64 w-full overflow-hidden rounded-lg bg-ink-900/5 sm:h-80">
        {turf.images[0] ? (
          <img src={turf.images[0].url} alt={turf.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-900/30">No image</div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-4xl uppercase text-ink-900">{turf.name}</h1>
          <FavoriteButton turfId={turf.id} />
        </div>
        {startingPrice !== null && (
          <div className="font-mono text-lg text-turf-700">From ₹{startingPrice}/hr</div>
        )}
      </div>

      <p className="mt-1 text-ink-900/60">
        {turf.address}, {turf.city}
      </p>

      {turf.description && <p className="mt-4 text-ink-900/70">{turf.description}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        {turf.turfSports.map(({ sport }) => (
          <Badge key={sport.id}>{sport.name}</Badge>
        ))}
      </div>

      {turf.facilities.length > 0 && (
        <div className="mt-6">
          <h2 className="font-display text-xl uppercase text-ink-900">Facilities</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {turf.facilities.map(({ facility }) => (
              <span
                key={facility.id}
                className="rounded-full bg-ink-900/5 px-3 py-1 text-sm text-ink-900/70"
              >
                {facility.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 rounded-lg border border-ink-900/10 p-6">
        <h2 className="font-display text-xl uppercase text-ink-900">Book a Slot</h2>

        {bookingSuccess && (
          <div className="mt-4 rounded-md bg-pitch-500/10 px-4 py-3 text-sm text-pitch-500">
            Booking confirmed!{' '}
            <Link to="/my-bookings" className="font-medium underline">
              View my bookings
            </Link>
          </div>
        )}

        <div className="mt-4">
          <DatePicker value={date} onChange={setDate} />
        </div>

        <div className="mt-6">
          {loadingAvailability ? (
            <p className="text-sm text-ink-900/60">Checking availability...</p>
          ) : availability.length === 0 ? (
            <p className="text-sm text-ink-900/60">
              No slots available on this day of the week.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {availability.map((slot) => (
                <button
                  key={slot.id}
                  disabled={slot.isBooked}
                  onClick={() => handleBookClick(slot)}
                  className={`rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                    slot.isBooked
                      ? 'cursor-not-allowed border-ink-900/10 bg-ink-900/5 text-ink-900/30'
                      : 'border-pitch-500/30 text-ink-900 hover:border-pitch-500 hover:bg-pitch-500/5'
                  }`}
                >
                  <div className="font-mono">
                    {slot.startTime} – {slot.endTime}
                  </div>
                  <div className="mt-1 font-mono text-pitch-500">
                    {slot.isBooked ? 'Booked' : `₹${slot.price}`}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl uppercase text-ink-900">Reviews</h2>
        <div className="mt-4">
          <ReviewList reviews={reviews} />
        </div>
        {completedBookingId && (
          <div className="mt-6">
            <ReviewForm
              turfId={turfId}
              bookingId={completedBookingId}
              onSuccess={loadReviews}
            />
          </div>
        )}
      </div>

      {selectedSlot && (
        <BookingModal
          turfId={turfId}
          turfName={turf.name}
          sportId={turf.turfSports[0]?.sport.id ?? 0}
          sportName={turf.turfSports[0]?.sport.name ?? ''}
          date={date}
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}