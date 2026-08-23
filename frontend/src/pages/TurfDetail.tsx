import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTurfById, type Turf } from '../services/api/turf';
import { getTurfSlots, type TimeSlot } from '../services/api/timeSlot';
import Badge from '../components/ui/Badge';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TurfDetail() {
  const { id } = useParams<{ id: string }>();
  const turfId = Number(id);

  const [turf, setTurf] = useState<Turf | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getTurfById(turfId), getTurfSlots(turfId)])
      .then(([turfData, slotsData]) => {
        setTurf(turfData);
        setSlots(slotsData.filter((s) => s.isActive));
      })
      .catch((err) => setError(err.response?.data?.message ?? 'Turf not found'))
      .finally(() => setLoading(false));
  }, [turfId]);

  if (loading) return <p className="px-4 py-10 text-center text-ink-900/60">Loading...</p>;
  if (error || !turf) {
    return <p className="px-4 py-10 text-center text-red-500">{error ?? 'Turf not found'}</p>;
  }

  const startingPrice = slots.length ? Math.min(...slots.map((s) => Number(s.price))) : null;

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
        <div>
          <h1 className="font-display text-4xl uppercase text-ink-900">{turf.name}</h1>
          <p className="mt-1 text-ink-900/60">
            {turf.address}, {turf.city}
          </p>
        </div>
        {startingPrice !== null && (
          <div className="font-mono text-lg text-turf-700">From ₹{startingPrice}/hr</div>
        )}
      </div>

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

      <div className="mt-10">
        <h2 className="font-display text-xl uppercase text-ink-900">Weekly Availability</h2>
        {slots.length === 0 ? (
          <p className="mt-2 text-ink-900/60">This turf hasn't listed its available slots yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {days.map((day, dayIndex) => {
              const daySlots = slots
                .filter((s) => s.dayOfWeek === dayIndex)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));
              if (daySlots.length === 0) return null;
              return (
                <div key={dayIndex}>
                  <h3 className="font-medium text-turf-700">{day}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="rounded-md border border-ink-900/10 px-3 py-2 font-mono text-sm text-ink-900"
                      >
                        {slot.startTime}–{slot.endTime} · ₹{slot.price}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-6 text-sm text-ink-900/50">
          Booking will be available once the booking system goes live in the next phase.
        </p>
      </div>
    </div>
  );
}