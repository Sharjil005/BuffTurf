import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyTurfs, type Turf } from '../../services/api/turf';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const statusBadgeVariant: Record<Turf['status'], 'amber' | 'emerald' | 'red'> = {
  PENDING: 'amber',
  APPROVED: 'emerald',
  REJECTED: 'red',
};

export default function OwnerDashboard() {
  const [turfs, setTurfs] = useState<Turf[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyTurfs()
      .then(setTurfs)
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load turfs'));
  }, []);

  if (error) {
    return <p className="text-red-400 font-semibold">{error}</p>;
  }

  if (turfs === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-3 font-mono text-xs text-emerald-400">Loading your arenas...</p>
      </div>
    );
  }

  if (turfs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-emerald-500/20 bg-[#0C1410] p-16 text-center">
        <span className="text-4xl">🏟️</span>
        <h2 className="mt-4 font-display text-2xl font-black uppercase text-white">No Arenas Listed Yet</h2>
        <p className="mt-1 text-xs text-slate-400">
          List your first turf ground to start scheduling slots and taking bookings.
        </p>
        <Link to="/owner/add-turf" className="mt-6 inline-block">
          <Button variant="primary" size="md">
            Add Your First Turf Arena 🚀
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-emerald-500/10 pb-4">
        <div>
          <Badge variant="emerald">Arena Portfolio</Badge>
          <h1 className="mt-2 font-display text-3xl font-black uppercase text-white">My Turfs</h1>
        </div>
        <Link to="/owner/add-turf">
          <Button variant="primary" size="sm">
            + New Turf
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {turfs.map((turf) => (
          <Card key={turf.id} className="overflow-hidden p-0">
            {turf.images[0] ? (
              <div className="relative h-44 w-full bg-[#0A110E]">
                <img
                  src={turf.images[0].url}
                  alt={turf.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101A15] via-transparent to-black/30" />
                <div className="absolute top-3 right-3">
                  <Badge variant={statusBadgeVariant[turf.status]}>{turf.status}</Badge>
                </div>
              </div>
            ) : (
              <div className="flex h-44 w-full items-center justify-center bg-[#0A110E] text-xs text-slate-500 uppercase font-mono">
                No Imagery
              </div>
            )}

            <div className="p-5">
              <h3 className="font-display text-xl font-bold uppercase text-white">{turf.name}</h3>
              <p className="mt-1 text-xs text-slate-400">
                {turf.address}, {turf.city}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {turf.turfSports.map(({ sport }) => (
                  <span
                    key={sport.id}
                    className="rounded-md border border-emerald-500/20 bg-[#121E18] px-2 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase"
                  >
                    {sport.name}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-emerald-500/10 pt-3">
                <Link
                  to={`/owner/turfs/${turf.id}/slots`}
                  className="font-mono text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  Manage Slots & Pricing →
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}