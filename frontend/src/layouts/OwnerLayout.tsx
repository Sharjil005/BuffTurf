import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/owner', label: 'Overview', end: true },
  { to: '/owner/turfs', label: 'My Turfs' },
  { to: '/owner/bookings', label: 'Bookings' },
  { to: '/owner/add-turf', label: 'Add Turf' },
];

export default function OwnerLayout() {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-10">
      <aside className="w-56 shrink-0">
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-pitch-500/10 text-pitch-500' : 'text-ink-900/70 hover:bg-ink-900/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}