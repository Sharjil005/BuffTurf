import { Link } from 'react-router-dom';
import type { DiscoveryTurf } from '../../services/api/turf';
import Card from '../ui/Card';
import FavoriteButton from './FavoriteButton';

export default function TurfCard({ turf }: { turf: DiscoveryTurf }) {
  return (
    <Link to={`/turfs/${turf.id}`} className="group block">
      <Card className="overflow-hidden p-0 transition-all group-hover:border-emerald-500/40">
        {/* Pitch Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-[#0A110E]">
          {turf.images[0] ? (
            <img
              src={turf.images[0].url}
              alt={turf.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-sm uppercase text-slate-600">
              🏟️ Arena Photo Coming Soon
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101A15] via-transparent to-black/30" />

          {/* Top Badges */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <span className="rounded-full border border-emerald-500/30 bg-[#090D0B]/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
              📍 {turf.city}
            </span>
          </div>

          <div className="absolute right-3 top-3">
            <FavoriteButton turfId={turf.id} />
          </div>

          {/* Rating floating tag */}
          {turf.reviewCount > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg border border-amber-500/30 bg-[#090D0B]/85 px-2 py-0.5 text-xs font-bold text-amber-400 backdrop-blur-md">
              <span>★</span>
              <span>{turf.avgRating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400">({turf.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white transition-colors group-hover:text-emerald-400">
              {turf.name}
            </h3>
          </div>

          <p className="mt-1 text-xs text-slate-400 line-clamp-1">
            {turf.address}
          </p>

          {/* Sports supported */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {turf.turfSports.slice(0, 3).map(({ sport }) => (
              <span
                key={sport.id}
                className="rounded-md border border-emerald-500/20 bg-[#14231C] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400"
              >
                {sport.name}
              </span>
            ))}
            {turf.turfSports.length > 3 && (
              <span className="rounded-md border border-slate-700 bg-slate-800/50 px-2 py-0.5 text-[10px] text-slate-400">
                +{turf.turfSports.length - 3} more
              </span>
            )}
          </div>

          {/* Pricing & CTA footer */}
          <div className="mt-5 flex items-center justify-between border-t border-emerald-500/10 pt-3.5">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                Session Rate
              </span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {turf.startingPrice !== null ? `₹${turf.startingPrice}/hr` : 'Custom Rates'}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
              Book Slot →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}