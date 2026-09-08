import { useEffect, useState } from 'react';
import { getMyFavorites } from '../services/api/favorite';
import type { DiscoveryTurf } from '../services/api/turf';
import TurfCard from '../components/turf/TurfCard';
import Badge from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function Favorites() {
  const [turfs, setTurfs] = useState<DiscoveryTurf[] | null>(null);

  useEffect(() => {
    getMyFavorites().then(setTurfs);
  }, []);

  if (turfs === null) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-4 font-mono text-sm text-emerald-400">Loading saved pitches...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-emerald-500/10 pb-6">
        <Badge variant="emerald">Saved Arenas</Badge>
        <h1 className="mt-2 font-display text-4xl font-black uppercase text-white">
          My Favorite Pitches
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Quickly access and book the turfs you play on most frequently.
        </p>
      </div>

      {turfs.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-emerald-500/20 bg-[#0C1410] p-16 text-center">
          <span className="text-4xl">⭐</span>
          <h3 className="mt-4 font-display text-xl font-bold uppercase text-white">No Favorite Arenas Yet</h3>
          <p className="mt-1 text-xs text-slate-400">
            Click the heart icon on any pitch card to save it to your squad's favorites list.
          </p>
          <Link to="/turfs" className="mt-6 inline-block">
            <Button variant="primary" size="sm">
              Explore Turfs ⚡
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {turfs.map((turf) => (
            <TurfCard key={turf.id} turf={turf} />
          ))}
        </div>
      )}
    </div>
  );
}