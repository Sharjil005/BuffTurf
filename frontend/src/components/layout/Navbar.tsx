import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="border-b border-ink-900/10 bg-chalk-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="font-display text-2xl uppercase tracking-wide text-turf-700">
          BuffTurf
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-ink-900">
          <Link to="/" className="hover:text-pitch-500">
            Home
          </Link>
          <Link to="/turfs" className="hover:text-pitch-500">
            Find Turfs
          </Link>
          {user ? (
            <>
              <Link to="/my-bookings" className="hover:text-pitch-500">
                My Bookings
              </Link>
              {user.role === 'TURF_OWNER' && (
                <Link to="/owner" className="hover:text-pitch-500">
                  Dashboard
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="hover:text-pitch-500">Admin</Link>
              )}
              <span className="text-ink-900/60">Hi, {user.name.split(' ')[0]}</span>
              <Button variant="ghost" className="px-4 py-2 text-sm" onClick={handleLogout}>
                Log Out
              </Button>
              <Link to="/favorites" className="hover:text-pitch-500">Favorites</Link>
              <Link to="/profile" className="hover:text-pitch-500">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-pitch-500">
                Login
              </Link>
              <Link to="/register">
                <Button variant="primary" className="px-4 py-2 text-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}