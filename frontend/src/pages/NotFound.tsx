import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-20 text-center">
      <div className="text-6xl">⚽</div>
      <h1 className="mt-4 font-display text-5xl font-black uppercase text-white">
        404 — Out of Bounds
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        The pitch or match page you're searching for does not exist or has been relocated.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary" size="md">
          Back to Center Pitch ⚡
        </Button>
      </Link>
    </div>
  );
}