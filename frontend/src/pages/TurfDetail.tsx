import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTurfById, type Turf } from '../services/api/turf';
import { getAvailability, type SlotAvailability } from '../services/api/timeSlot';
import { getTurfReviews, type Review } from '../services/api/review';
import { getMyBookings } from '../services/api/booking';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-4 font-mono text-sm text-emerald-400">Loading pitch details...</p>
      </div>
    );
  }

  if (error || !turf) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <p className="text-red-400 font-semibold">{error ?? 'Turf not found'}</p>
        <Link to="/turfs" className="mt-4 inline-block">
          <Button variant="secondary" size="sm">Back to Discovery</Button>
        </Link>
      </div>
    );
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

  // Group slots into time-of-day categories for modern scheduling experience
  const morningSlots = availability.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = availability.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });

  const floodlightSlots = availability.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 17;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/turfs" className="hover:text-emerald-400">Turfs</Link>
        <span>/</span>
        <span className="text-slate-300">{turf.city}</span>
        <span>/</span>
        <span className="text-emerald-400 font-medium">{turf.name}</span>
      </div>

      {/* Hero Showcase Grid */}
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {/* Gallery Showcase */}
        <div className="lg:col-span-2 overflow-hidden rounded-3xl border border-emerald-500/15 bg-[#0C1410] relative min-h-[320px] sm:min-h-[420px]">
          {turf.images[0] ? (
            <img
              src={turf.images[0].url}
              alt={turf.name}
              className="h-full w-full object-cover min-h-[320px] sm:min-h-[420px]"
            />
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center text-slate-600 font-display text-lg uppercase">
              No Pitch Photography Available
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D0B] via-transparent to-black/40" />

          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton turfId={turf.id} />
          </div>

          <div className="absolute bottom-6 left-6 right-6 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-500/30 bg-[#090D0B]/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                📍 {turf.city}
              </span>
              {turf.turfSports.map(({ sport }) => (
                <span
                  key={sport.id}
                  className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-md"
                >
                  {sport.name}
                </span>
              ))}
            </div>
            <h1 className="mt-2 font-display text-3xl font-black uppercase text-white sm:text-5xl">
              {turf.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              {turf.address}, {turf.city}
            </p>
          </div>
        </div>

        {/* Quick Pitch Summary Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-emerald-500/20 bg-[#0E1713]/90 p-6 backdrop-blur-xl shadow-2xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Arena Tier
              </span>
              <Badge variant="emerald">Verified Pitch</Badge>
            </div>

            <div className="mt-6">
              <span className="text-xs uppercase text-slate-400 block font-semibold">Starting From</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-black text-emerald-400">
                  {startingPrice !== null ? `₹${startingPrice}` : 'Custom'}
                </span>
                <span className="text-xs text-slate-400">/ 60 min session</span>
              </div>
            </div>

            {turf.description && (
              <div className="mt-6 border-t border-emerald-500/10 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Pitch Overview
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {turf.description}
                </p>
              </div>
            )}

            {turf.facilities.length > 0 && (
              <div className="mt-6 border-t border-emerald-500/10 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Pitch Amenities
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {turf.facilities.map(({ facility }) => (
                    <span
                      key={facility.id}
                      className="rounded-lg border border-emerald-500/15 bg-[#121E18] px-2.5 py-1 text-xs text-slate-300"
                    >
                      ⚡ {facility.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-500/15 bg-[#121E18] p-4 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>🛡️</span> Instant Confirmed Booking
            </div>
            <p className="text-slate-400 text-[11px]">
              Slots locked atomically. Double-booking is strictly prohibited by our core platform engine.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Pitch Slot Booking Engine */}
      <div className="mt-12 rounded-3xl border border-emerald-500/20 bg-[#0E1713]/90 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-500/10 pb-6">
          <div>
            <Badge variant="amber">Live Pitch Grid</Badge>
            <h2 className="mt-2 font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Select Your Session Slot
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Pick a match date to inspect active morning, afternoon, and floodlit evening slots.
            </p>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase text-slate-400">Match Date:</span>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-emerald-500/30 bg-[#121E18] px-4 py-2 text-xs font-mono font-bold text-white outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {bookingSuccess && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <span>Booking confirmed! Your match pass has been issued.</span>
            </div>
            <Link to="/my-bookings" className="font-bold underline hover:text-emerald-300">
              View Match Passes →
            </Link>
          </div>
        )}

        {/* Slot Category Grids */}
        <div className="mt-8">
          {loadingAvailability ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
              <p className="mt-3 font-mono text-xs text-emerald-400">Loading pitch availability...</p>
            </div>
          ) : availability.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-emerald-500/20 bg-[#0C1410] py-16 text-center">
              <p className="text-sm text-slate-400">No time slots scheduled for this day of the week.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Floodlight Evening Slots */}
              {floodlightSlots.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <span>⚡ Floodlit Evening Sessions (17:00+)</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px]">Peak Action</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {floodlightSlots.map((slot) => (
                      <button
                        key={slot.id}
                        disabled={slot.isBooked}
                        onClick={() => handleBookClick(slot)}
                        className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all ${
                          slot.isBooked
                            ? 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600 opacity-60'
                            : 'border-emerald-500/20 bg-[#121E18] text-slate-200 hover:border-emerald-400 hover:bg-[#16271F] hover:shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)] cursor-pointer'
                        }`}
                      >
                        <div className="font-mono text-xs font-semibold">
                          {slot.startTime} – {slot.endTime}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span
                            className={`font-mono text-xs font-bold ${
                              slot.isBooked ? 'text-slate-600' : 'text-emerald-400'
                            }`}
                          >
                            ₹{slot.price}
                          </span>
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              slot.isBooked
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black'
                            }`}
                          >
                            {slot.isBooked ? 'Booked' : 'Select'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Afternoon Slots */}
              {afternoonSlots.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <span>🌤️ Afternoon Sessions (12:00 – 17:00)</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {afternoonSlots.map((slot) => (
                      <button
                        key={slot.id}
                        disabled={slot.isBooked}
                        onClick={() => handleBookClick(slot)}
                        className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all ${
                          slot.isBooked
                            ? 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600 opacity-60'
                            : 'border-emerald-500/20 bg-[#121E18] text-slate-200 hover:border-emerald-400 hover:bg-[#16271F] hover:shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)] cursor-pointer'
                        }`}
                      >
                        <div className="font-mono text-xs font-semibold">
                          {slot.startTime} – {slot.endTime}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span
                            className={`font-mono text-xs font-bold ${
                              slot.isBooked ? 'text-slate-600' : 'text-emerald-400'
                            }`}
                          >
                            ₹{slot.price}
                          </span>
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              slot.isBooked
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black'
                            }`}
                          >
                            {slot.isBooked ? 'Booked' : 'Select'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Morning Slots */}
              {morningSlots.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <span>☀️ Morning Sessions (&lt; 12:00)</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {morningSlots.map((slot) => (
                      <button
                        key={slot.id}
                        disabled={slot.isBooked}
                        onClick={() => handleBookClick(slot)}
                        className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all ${
                          slot.isBooked
                            ? 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600 opacity-60'
                            : 'border-emerald-500/20 bg-[#121E18] text-slate-200 hover:border-emerald-400 hover:bg-[#16271F] hover:shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)] cursor-pointer'
                        }`}
                      >
                        <div className="font-mono text-xs font-semibold">
                          {slot.startTime} – {slot.endTime}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span
                            className={`font-mono text-xs font-bold ${
                              slot.isBooked ? 'text-slate-600' : 'text-emerald-400'
                            }`}
                          >
                            ₹{slot.price}
                          </span>
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              slot.isBooked
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black'
                            }`}
                          >
                            {slot.isBooked ? 'Booked' : 'Select'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="mt-12 rounded-3xl border border-emerald-500/20 bg-[#0E1713]/90 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-emerald-500/10 pb-6">
          <div>
            <Badge variant="amber">Community Reviews</Badge>
            <h2 className="mt-2 font-display text-2xl font-black uppercase text-white">
              Player Experiences
            </h2>
          </div>
        </div>

        <div className="mt-6">
          <ReviewList reviews={reviews} />
        </div>

        {completedBookingId && (
          <div className="mt-8 border-t border-emerald-500/10 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Leave a Verified Review
            </h3>
            <div className="mt-4">
              <ReviewForm
                turfId={turfId}
                bookingId={completedBookingId}
                onSuccess={loadReviews}
              />
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
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