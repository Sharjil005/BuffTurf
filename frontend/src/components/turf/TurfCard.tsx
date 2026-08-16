import { Link } from 'react-router-dom';
import type { DiscoveryTurf } from '../../services/api/turf';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function TurfCard({ turf }: { turf: DiscoveryTurf }) {
  return (
    <Link to={`/turfs/${turf.id}`}>
      <Card className="p-0 overflow-hidden">
        <div className="h-44 w-full bg-ink-900/5">
          {turf.images[0] ? (
            <img src={turf.images[0].url} alt={turf.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-900/30">
              No image
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-ink-900">{turf.name}</h3>
            {turf.reviewCount > 0 && (
              <span className="shrink-0 font-mono text-sm text-amber-500">
                ★ {turf.avgRating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-900/60">{turf.city}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {turf.turfSports.slice(0, 3).map(({ sport }) => (
              <Badge key={sport.id}>{sport.name}</Badge>
            ))}
          </div>
          <div className="mt-4 font-mono text-sm text-turf-700">
            {turf.startingPrice !== null ? `From ₹${turf.startingPrice}/hr` : 'Price on request'}
          </div>
        </div>
      </Card>
    </Link>
  );
}