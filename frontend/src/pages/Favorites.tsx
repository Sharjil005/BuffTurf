import { useEffect, useState } from 'react';
import { getMyFavorites } from '../services/api/favorite';
import type { DiscoveryTurf } from '../services/api/turf';
import TurfCard from '../components/turf/TurfCard';

export default function Favorites() {
  const [turfs, setTurfs] = useState<DiscoveryTurf[] | null>(null);

  useEffect(() => {
    getMyFavorites().then(setTurfs);
  }, []);

  if (turfs === null) return <p className="px-4 py-10 text-center text-ink-900/60">Loading...</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl uppercase text-ink-900">My Favorites</h1>
      {turfs.length === 0 ? (
        <p className="mt-4 text-ink-900/60">You haven't favorited any turfs yet.</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {turfs.map((turf) => (
            <TurfCard key={turf.id} turf={turf} />
          ))}
        </div>
      )}
    </div>
  );
}