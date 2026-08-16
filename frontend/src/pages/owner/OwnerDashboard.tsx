import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyTurfs, type Turf } from '../../services/api/turf';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const statusStyles: Record<Turf['status'], string> = {
  PENDING: 'bg-amber-500/10 text-amber-600',
  APPROVED: 'bg-pitch-500/10 text-pitch-500',
  REJECTED: 'bg-red-500/10 text-red-500',
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
    return <p className="text-red-500">{error}</p>;
  }

  if (turfs === null) {
    return <p className="text-ink-900/60">Loading your turfs...</p>;
  }

  if (turfs.length === 0) {
    return (
      <div className="text-center">
        <h2 className="font-display text-2xl uppercase text-ink-900">No turfs yet</h2>
        <p className="mt-2 text-ink-900/60">List your first ground to start getting bookings.</p>
        <Link to="/owner/add-turf">
          <Button variant="primary" className="mt-6">
            Add Your First Turf
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-ink-900">My Turfs</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {turfs.map((turf) => (
          <Card key={turf.id}>
            {turf.images[0] && (
              <img
                src={turf.images[0].url}
                alt={turf.name}
                className="mb-4 h-40 w-full rounded-md object-cover"
              />
            )}
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-ink-900">{turf.name}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[turf.status]}`}
              >
                {turf.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-900/60">
              {turf.address}, {turf.city}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {turf.turfSports.map(({ sport }) => (
                <Badge key={sport.id}>{sport.name}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}