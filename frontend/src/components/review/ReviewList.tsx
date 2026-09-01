import type { Review } from '../../services/api/review';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500">
      {'★'.repeat(rating)}
      <span className="text-ink-900/20">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-ink-900/50">No reviews yet — be the first to review this turf.</p>;
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-2xl text-amber-500">{avgRating.toFixed(1)}</span>
        <Stars rating={Math.round(avgRating)} />
        <span className="text-sm text-ink-900/50">({reviews.length} reviews)</span>
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-t border-ink-900/5 pt-4">
            <div className="flex items-center gap-3">
              <Stars rating={review.rating} />
              <span className="text-sm font-medium text-ink-900">{review.user.name}</span>
              <span className="text-xs text-ink-900/40">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.comment && <p className="mt-2 text-sm text-ink-900/70">{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}