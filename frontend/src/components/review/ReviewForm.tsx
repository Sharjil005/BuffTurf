import { useState } from 'react';
import { createReview } from '../../services/api/review';
import Button from '../ui/Button';

interface ReviewFormProps {
  turfId: number;
  bookingId: number;
  onSuccess: () => void;
}

export default function ReviewForm({ turfId, bookingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating'); return; }
    setSubmitting(true);
    setError(null);
    try {
      await createReview(turfId, { bookingId, rating, comment: comment.trim() || undefined });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-emerald-500/20 bg-[#0C1410] p-5">
      <h3 className="font-display text-base font-bold uppercase text-white">Leave a Review</h3>

      <div className="mt-3 flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
              star <= rating ? 'text-amber-400' : 'text-slate-600 hover:text-amber-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={3}
        className="mt-3 w-full rounded-xl border border-emerald-500/20 bg-[#121E18] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all focus:border-emerald-400 focus:bg-[#16271F]"
      />

      {error && <p className="mt-2 text-xs font-semibold text-red-400">{error}</p>}

      <Button type="submit" variant="primary" disabled={submitting} className="mt-3 px-5 py-2 text-xs">
        {submitting ? 'Submitting...' : 'Submit Review ⚡'}
      </Button>
    </form>
  );
}