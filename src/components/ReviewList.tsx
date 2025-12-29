
interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <div className="space-y-6">
      <h3 className="mb-6" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Recent Reviews</h3>
      {reviews.length === 0 ? (
        <p className="italic" style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-meta">
              <span className="review-author">{review.name}</span>
              <div className="review-stars">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            <span className="review-date">
              {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <p className="review-body">"{review.comment}"</p>
          </div>
        ))
      )}
    </div>
  );
}
