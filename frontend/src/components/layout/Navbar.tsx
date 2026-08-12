import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-primary">
          BuffTurf
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-secondary">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>
    </header>
  );
}