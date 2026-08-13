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
          {user ? (
            <>
              <span className="text-ink-900/60">Hi, {user.name.split(' ')[0]}</span>
              <Button variant="ghost" className="px-4 py-2 text-sm" onClick={handleLogout}>
                Log Out
              </Button>
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