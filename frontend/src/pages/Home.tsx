import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useState } from 'react';

const sports = [
  { name: 'Football', icon: '⚽', desc: '5v5 & 7v7 Astro pitches' },
  { name: 'Cricket', icon: '🏏', desc: 'Box cricket with nets' },
  { name: 'Badminton', icon: '🏸', desc: 'Wooden & BWF synthetic courts' },
  { name: 'Tennis', icon: '🎾', desc: 'Clay & synthetic hardcourts' },
  { name: 'Basketball', icon: '🏀', desc: 'Indoor full-court & half-court' },
  { name: 'Volleyball', icon: '🏐', desc: 'Sand & polyurethane turf' },
];

const stats = [
  { label: 'Active Pitches', value: '500+', sub: 'Across 12 top cities' },
  { label: 'Match Bookings', value: '25K+', sub: 'Zero double-bookings' },
  { label: 'Community Rating', value: '4.9 ★', sub: 'Verified player reviews' },
  { label: 'Floodlit Hours', value: '100K+', sub: 'Night play ready' },
];

const steps = [
  {
    step: '01',
    title: 'Spot the Pitch',
    desc: 'Filter by sport, AstroTurf vs natural grass, floodlight amenities, and verified ratings in your city.',
    badge: 'Real-time Discover',
  },
  {
    step: '02',
    title: 'Pick Your Session',
    desc: 'Inspect exact morning or floodlit night slots with transparent non-surge pricing.',
    badge: 'Instant Lock',
  },
  {
    step: '03',
    title: 'Step on the Turf',
    desc: 'Receive your instant digital match pass, show up with your squad, and kick off under the lights.',
    badge: 'Play Hassle-Free',
  },
];

export default function Home() {
  const [quickCity, setQuickCity] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(quickCity ? `/turfs?city=${encodeURIComponent(quickCity)}` : '/turfs');
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Lighting Accents */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-96 -left-48 h-96 w-96 rounded-full bg-emerald-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-[700px] -right-48 h-96 w-96 rounded-full bg-cyan-600/10 blur-[120px]" />

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE BOOKINGS OPEN · EVENING & FLOODLIT SLOTS
          </div>

          <h1 className="mt-8 font-display text-5xl font-black uppercase tracking-tight text-white sm:text-7xl lg:text-8xl">
            PLAY UNDER THE <br />
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-lime-400 bg-clip-text text-transparent floodlight-text-glow">
              FLOODLIGHTS.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
            Discover premier sports pitches, box cricket arenas, and football turfs near you. 
            Real-time slot availability, instant match passes, and guaranteed zero double-bookings.
          </p>

          {/* Quick Discovery Search Bar */}
          <form
            onSubmit={handleQuickSearch}
            className="mx-auto mt-10 max-w-2xl rounded-2xl border border-emerald-500/20 bg-[#0E1713]/90 p-2.5 shadow-2xl backdrop-blur-xl sm:flex sm:items-center sm:gap-2"
          >
            <div className="flex flex-1 items-center gap-3 px-3 py-2">
              <span className="text-xl">📍</span>
              <input
                type="text"
                placeholder="Search city (e.g. Pune, Mumbai, Bangalore)..."
                value={quickCity}
                onChange={(e) => setQuickCity(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
            <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
              Find Pitches ⚡
            </Button>
          </form>

          {/* Action CTA */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span>Popular:</span>
            {['Box Cricket', 'Football 5v5', 'Badminton Indoor', 'Tennis Clay'].map((tag) => (
              <Link
                key={tag}
                to="/turfs"
                className="rounded-lg border border-emerald-500/10 bg-[#121E18] px-2.5 py-1 text-slate-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Floating Live Stat Counters */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-emerald-500/15 bg-[#0C1410]/80 p-6 backdrop-blur-xl sm:grid-cols-4 sm:p-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center sm:border-r sm:border-emerald-500/10 sm:last:border-r-0">
                <div className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
                  <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
                    {s.value}
                  </span>
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-200">
                  {s.label}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <Badge variant="emerald">Arena Categories</Badge>
          <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Choose Your Sport
          </h2>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-400">
            From premier high-grade turf grass to certified indoor badminton courts, book with confidence.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sports.map((sp) => (
            <Link key={sp.name} to="/turfs" className="group">
              <Card className="flex items-center gap-4 p-5 transition-all group-hover:border-emerald-500/40 group-hover:bg-[#15231D]">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-[#0C1410] text-3xl transition-transform group-hover:scale-110">
                  {sp.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-bold text-white uppercase group-hover:text-emerald-400 transition-colors">
                    {sp.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400 truncate">{sp.desc}</p>
                </div>
                <span className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works / 3-Step Match Ready */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <Badge variant="amber">Match Protocol</Badge>
          <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            How BuffTurf Works
          </h2>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-400">
            Locking in your game should be as fast as a counterattack. 3 steps to the pitch.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((st) => (
            <Card key={st.step} className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
                    STEP {st.step}
                  </span>
                  <span className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    {st.badge}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-white uppercase">
                  {st.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{st.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-500/10 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="text-emerald-400">✔</span> Verified Turf Partner Network
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Turf Owner CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-[#0E1B15] via-[#12231B] to-[#0A130F] p-8 sm:p-12">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <Badge variant="emerald">Turf Operators & Arena Owners</Badge>
              <h2 className="mt-3 font-display text-3xl font-black uppercase text-white sm:text-4xl">
                Maximize Your Arena Occupancy
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                List your turf, automate slots with dynamic peak/off-peak pricing, and track revenue with zero double-booking headaches.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  List Your Turf Arena 🚀
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}