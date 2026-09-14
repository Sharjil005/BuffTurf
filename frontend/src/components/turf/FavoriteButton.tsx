import { useState } from 'react';
import { addFavorite, removeFavorite } from '../../services/api/favorite';
import { useAuth } from '../../hooks/useAuth';

export default function FavoriteButton({
  turfId,
  initialFavorited = false,
}: {
  turfId: number;
  initialFavorited?: boolean;
}) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user || busy) return;
    setBusy(true);
    try {
      if (favorited) {
        await removeFavorite(turfId);
      } else {
        await addFavorite(turfId);
      }
      setFavorited(!favorited);
    } finally {
      setBusy(false);
    }
  }

  if (!user) return null;

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all cursor-pointer backdrop-blur-md ${
        favorited
          ? 'border-red-500/50 bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.35)]'
          : 'border-white/20 bg-black/60 text-slate-300 hover:border-red-500/50 hover:text-red-400 hover:bg-black/80'
      }`}
    >
      <span className="text-sm leading-none">{favorited ? '♥' : '♡'}</span>
    </button>
  );
}