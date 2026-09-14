import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTurfs, getSports, type DiscoveryTurf, type Sport } from '../services/api/turf';
import { useDebounce } from '../hooks/useDebounce';
import TurfCard from '../components/turf/TurfCard';
import { Input } from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const sortOptions = [
  { value: 'popularity', label: '🔥 Most Popular' },
  { value: 'rating', label: '⭐ Top Rated' },
  { value: 'price_asc', label: '💵 Price: Low to High' },
  { value: 'price_desc', label: '💎 Price: High to Low' },
] as const;

export default function Discovery() {
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [city, setCity] = useState(searchParams.get('city') ?? '');
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

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedCity, sportId, minRating, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Discovery Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-emerald-500/10 pb-8">
        <div>
          <Badge variant="emerald">Live Pitch Locator</Badge>
          <h1 className="mt-2 font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Find Sports Turfs
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Book certified floodlit pitches, box cricket arenas, and football courts near you.
          </p>
        </div>
        {data && (
          <div className="font-mono text-xs text-emerald-400">
            Showing {data.turfs.length} of {data.total} active pitches
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="mt-8 rounded-2xl border border-emerald-500/15 bg-[#0E1713]/90 p-5 backdrop-blur-xl shadow-xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            label="Search Ground"
            placeholder="Arena name or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Input
            label="Location / City"
            placeholder="e.g. Pune, Mumbai..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">Sport</label>
            <select
              value={sportId}
              onChange={(e) => setSportId(e.target.value ? Number(e.target.value) : '')}
              className="rounded-xl border border-emerald-500/20 bg-[#0C1410] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:bg-[#111C17]"
            >
              <option value="">All Sports</option>
              {sports.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : '')}
              className="rounded-xl border border-emerald-500/20 bg-[#0C1410] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:bg-[#111C17]"
            >
              <option value="">Any Rating</option>
              <option value="4">⭐ 4.0 & above</option>
              <option value="3">⭐ 3.0 & above</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase text-slate-400">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-xl border border-emerald-500/20 bg-[#0C1410] px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:bg-[#111C17]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Sport Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-emerald-500/10 pt-4">
          <span className="text-xs text-slate-400">Quick Filter:</span>
          <button
            onClick={() => setSportId('')}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
              sportId === ''
                ? 'bg-emerald-500 text-black font-semibold'
                : 'border border-emerald-500/15 bg-[#121E18] text-slate-300 hover:border-emerald-500/30'
            }`}
          >
            All
          </button>
          {sports.map((s) => (
            <button
              key={s.id}
              onClick={() => setSportId(s.id)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                sportId === s.id
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'border border-emerald-500/15 bg-[#121E18] text-slate-300 hover:border-emerald-500/30'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-4 font-mono text-sm text-emerald-400">Scanning pitch availability...</p>
          </div>
        ) : !data || data.turfs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-emerald-500/20 bg-[#0C1410] py-24 text-center">
            <span className="text-4xl">🏟️</span>
            <h3 className="mt-4 font-display text-xl font-bold uppercase text-white">No Turfs Found</h3>
            <p className="mt-1 text-xs text-slate-400">
              Try adjusting your search query, selecting another sport, or clearing location filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.turfs.map((turf) => (
                <TurfCard key={turf.id} turf={turf} />
              ))}
            </div>

            {/* Pagination Controls */}
            {data.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-10 w-10 rounded-xl font-mono text-sm font-bold transition-all ${
                      p === page
                        ? 'bg-emerald-500 text-black shadow-[0_0_15px_-2px_rgba(34,197,94,0.6)]'
                        : 'border border-emerald-500/15 bg-[#121E18] text-slate-300 hover:border-emerald-500/30 hover:text-white'
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