import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-emerald-500/10 bg-[#070B09] py-14 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-black font-black text-sm">
                ⚡
              </div>
              <span className="font-display text-xl font-bold tracking-wider text-white uppercase">
                Buff<span className="text-emerald-400">Turf</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The premier online arena for discovering, scheduling, and locking down top sports pitches and turfs under floodlights.
            </p>
            <div className="flex gap-2 font-mono text-xs text-emerald-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                Live Arena Availability
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-200">
              Popular Sports
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link to="/turfs" className="hover:text-emerald-400 transition-colors">Box Cricket Arenas</Link></li>
              <li><Link to="/turfs" className="hover:text-emerald-400 transition-colors">5-a-Side & 7-a-Side Football</Link></li>
              <li><Link to="/turfs" className="hover:text-emerald-400 transition-colors">Badminton Indoor Courts</Link></li>
              <li><Link to="/turfs" className="hover:text-emerald-400 transition-colors">Tennis & Pickleball Pitches</Link></li>
              <li><Link to="/turfs" className="hover:text-emerald-400 transition-colors">Basketball Hardcourts</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-200">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link to="/turfs" className="hover:text-emerald-400 transition-colors">Explore All Turfs</Link></li>
              <li><Link to="/my-bookings" className="hover:text-emerald-400 transition-colors">My Match Passes</Link></li>
              <li><Link to="/support" className="hover:text-emerald-400 transition-colors">Dispute & Support Desk</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Partner as Turf Owner</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-200">
              Arena Guarantee
            </h4>
            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-[#0E1713] p-3.5 space-y-2">
              <p className="text-xs text-slate-300">
                🔒 <strong>Zero Double-Bookings:</strong> Atomic database locking guarantees your reserved slot is yours exclusively.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">Instant confirmation passes.</div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-emerald-500/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} BuffTurf Network Inc. Built for athletes and arena managers.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-300">Terms of Booking</span>
            <span>·</span>
            <span className="hover:text-slate-300">Refund Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}