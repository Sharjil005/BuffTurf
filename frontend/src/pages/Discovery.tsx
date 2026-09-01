import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTurfs, getSports, type DiscoveryTurf, type Sport } from '../services/api/turf';
import { useDebounce } from '../hooks/useDebounce';
import TurfCard from '../components/turf/TurfCard';
import { Input } from '../components/ui/Input';

const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
] as const;

export default function Discovery() {
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [city, setCity] = useState('');
  const [sportId, setSportId] = useState<number | ''>('');
  const [minRating, setMinRating] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<typeof sortOptions[number]['value']>('popularity');
  const [page, setPage] = useState(1);

  const [sports, setSports] = useState<Sport[]>([]);
  const [data, setData] = useState<{ turfs: DiscoveryTurf[]; total: number; totalPages: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 400);
  const debouncedCity = useDebounce(city, 400);

  useEffect(() => {
    getSports().then(setSports);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getTurfs({
      search: debouncedSearch || undefined,
      city: debouncedCity || undefined,
      sportId: sportId || undefined,
      minRating: minRating || undefined,
      sortBy,
      page,
    })
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [debouncedSearch, debouncedCity, sportId, minRating, sortBy, page]);

  // Reset to page 1 whenever a filter changes (not when page itself changes)
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedCity, sportId, minRating, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl uppercase text-ink-900">Find a Turf</h1>

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="w-full sm:w-64">
          <Input
            label="Search"
            placeholder="Turf name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Input label="City" placeholder="e.g. Pune" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="w-full sm:w-48">
          <label className="text-sm font-medium text-ink-900">Sport</label>
          <select
            value={sportId}
            onChange={(e) => setSportId(e.target.value ? Number(e.target.value) : '')}
            className="mt-1.5 w-full rounded-md border border-ink-900/15 px-4 py-2.5 text-ink-900 outline-none focus:border-pitch-500"
          >
            <option value="">All Sports</option>
            {sports.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-48">
          <label className="text-sm font-medium text-ink-900">Min Rating</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : '')}
            className="mt-1.5 w-full rounded-md border border-ink-900/15 px-4 py-2.5 text-ink-900 outline-none focus:border-pitch-500"
          >
            <option value="">Any Rating</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
          </select>
        </div>
        <div className="w-full sm:w-56">
          <label className="text-sm font-medium text-ink-900">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="mt-1.5 w-full rounded-md border border-ink-900/15 px-4 py-2.5 text-ink-900 outline-none focus:border-pitch-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-ink-900/60">Loading turfs...</p>
        ) : !data || data.turfs.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-ink-900/60">No turfs match your filters.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-ink-900/50">{data.total} turfs found</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.turfs.map((turf) => (
                <TurfCard key={turf.id} turf={turf} />
              ))}
            </div>

            {data.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-md text-sm font-medium ${
                      p === page ? 'bg-pitch-500 text-chalk-50' : 'text-ink-900/60 hover:bg-ink-900/5'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}