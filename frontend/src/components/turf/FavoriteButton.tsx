import { useState } from 'react';
import { addFavorite, removeFavorite } from '../../services/api/favorite';
import { useAuth } from '../../context/AuthContext';

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
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
        favorited
          ? 'border-red-400 bg-red-50 text-red-500'
          : 'border-ink-900/15 bg-chalk-50 text-ink-900/50 hover:text-red-400'
      }`}
    >
      {favorited ? '♥' : '♡'}
    </button>
  );
}