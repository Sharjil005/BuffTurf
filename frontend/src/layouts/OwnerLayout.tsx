import { NavLink, Outlet } from 'react-router-dom';
import Badge from '../components/ui/Badge';

const links = [
  { to: '/owner', label: '📊 Overview', end: true },
  { to: '/owner/turfs', label: '🏟️ My Turfs' },
  { to: '/owner/bookings', label: '🎟️ Bookings' },
  { to: '/owner/analytics', label: '📈 Analytics & Revenue' },
  { to: '/owner/complaints', label: '⚠️ Complaints' },
  { to: '/owner/add-turf', label: '➕ Add New Turf' },
];

export default function OwnerLayout() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col md:flex-row gap-8 px-4 py-10 sm:px-6">
      <aside className="w-full md:w-64 shrink-0">
        <div className="rounded-3xl border border-emerald-500/15 bg-[#0E1713]/90 p-5 backdrop-blur-xl">
          <div className="mb-4 px-2">
            <Badge variant="emerald">Arena Management</Badge>
            <h2 className="mt-2 font-display text-xl font-bold uppercase text-white">Owner Portal</h2>
          </div>
          <nav className="flex flex-col gap-1.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-black shadow-[0_0_15px_-3px_rgba(34,197,94,0.5)]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}