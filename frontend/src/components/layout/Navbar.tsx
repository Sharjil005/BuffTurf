import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-500/10 bg-[#090D0B]/85 backdrop-blur-xl transition-all">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 p-0.5 shadow-[0_0_20px_-3px_rgba(34,197,94,0.5)] transition-transform group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0A110E]">
              <span className="text-lg font-black tracking-tighter text-emerald-400">⚡</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-black uppercase tracking-wider text-white">
              Buff<span className="text-emerald-400">Turf</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest uppercase text-emerald-500/80 -mt-1">
              Match Pitches
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#101914]/60 p-1.5 rounded-2xl border border-emerald-500/10">
          <Link
            to="/"
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all ${
              isActive('/')
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_-3px_rgba(34,197,94,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>
          <Link
            to="/turfs"
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all ${
              isActive('/turfs')
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_-3px_rgba(34,197,94,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Find Turfs
          </Link>
          {user && (
            <>
              <Link
                to="/my-bookings"
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all ${
                  isActive('/my-bookings')
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_-3px_rgba(34,197,94,0.5)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Passes & Bookings
              </Link>
              {user.role === 'TURF_OWNER' && (
                <Link
                  to="/owner"
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all ${
                    location.pathname.startsWith('/owner')
                      ? 'bg-emerald-500 text-black shadow-[0_0_15px_-3px_rgba(34,197,94,0.5)]'
                      : 'text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  Owner Suite
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-emerald-500 text-black shadow-[0_0_15px_-3px_rgba(34,197,94,0.5)]'
                      : 'text-amber-400 hover:bg-amber-500/10'
                  }`}
                >
                  Admin Portal
                </Link>
              )}
              <Link
                to="/favorites"
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all ${
                  isActive('/favorites')
                    ? 'bg-emerald-500 text-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Favorites
              </Link>
              <Link
                to="/support"
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all ${
                  isActive('/support')
                    ? 'bg-emerald-500 text-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Support
              </Link>
            </>
          )}
        </div>

        {/* User Right Action */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <NotificationDropdown />
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-[#121E18] px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-emerald-500/40 hover:text-white transition-all"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <NotificationDropdown />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-[#121E18] text-slate-300 hover:text-white"
            aria-label="Toggle Navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-emerald-500/15 bg-[#0A100D]/95 px-4 py-4 backdrop-blur-2xl md:hidden space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            Home
          </Link>
          <Link
            to="/turfs"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            Find Turfs
          </Link>
          {user ? (
            <>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                My Bookings
              </Link>
              {user.role === 'TURF_OWNER' && (
                <Link
                  to="/owner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10"
                >
                  Owner Dashboard
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-amber-400 hover:bg-amber-500/10"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                Favorites
              </Link>
              <Link
                to="/support"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                Support Center
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                Profile Settings
              </Link>
              <div className="pt-2">
                <Button variant="danger" size="sm" className="w-full" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}