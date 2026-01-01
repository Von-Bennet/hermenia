'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        // Handle Zod validation errors
        if (data.errors) {
            const msg = data.errors.map((e: any) => e.message).join(', ');
            throw new Error(msg);
        }
        throw new Error(data.error || 'Failed to submit');
      }

      setStatus('success');
      setFormData({ name: '', rating: 5, comment: '' });
      router.refresh();

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message || "Something went wrong");
    }
  };

  return (
    <div className="premium-form-card">
      <div className="form-header">
        <div className="form-icon">✍️</div>
        <h3 className="premium-form-title">Share Your Thoughts</h3>
        <p className="form-subtitle">Your review helps others discover great reads</p>
      </div>
      
      <form onSubmit={handleSubmit} className="premium-form">
        {/* Name Input */}
        <div className="premium-form-group">
          <label className="premium-label">
            <span className="label-text">Your Name</span>
            <span className="label-required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              required
              className="premium-input"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={status === 'submitting'}
            />
            <div className="input-border-glow"></div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="premium-form-group">
          <label className="premium-label">
            <span className="label-text">Rating</span>
            <span className="label-required">*</span>
          </label>
          <div className="premium-star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`premium-star ${star <= (hoveredStar || formData.rating) ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, rating: star })}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                disabled={status === 'submitting'}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
            ))}
          </div>
          <div className="rating-text">
            {formData.rating === 5 && "Outstanding! ⭐"}
            {formData.rating === 4 && "Great read! 👍"}
            {formData.rating === 3 && "Good 👌"}
            {formData.rating === 2 && "Could be better 🤔"}
            {formData.rating === 1 && "Not recommended 👎"}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="premium-form-group">
          <label className="premium-label">
            <span className="label-text">Your Review</span>
            <span className="label-required">*</span>
          </label>
          <div className="input-wrapper">
            <textarea
              required
              rows={5}
              className="premium-textarea" 
              placeholder="Share your experience with this book..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              disabled={status === 'submitting'}
            />
            <div className="input-border-glow"></div>
          </div>
          <div className="char-count">{formData.comment.length} characters</div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="premium-submit-btn" 
          disabled={status === 'submitting'}
        >
          <span className="btn-content">
            {status === 'submitting' ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : (
              <>
                <span className="btn-icon">📝</span>
                Submit Review
              </>
            )}
          </span>
          <div className="btn-glow"></div>
        </button>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="status-message success">
            <span className="status-icon">✓</span>
            Thank you for your review!
          </div>
        )}
        
        {status === 'error' && (
          <div className="status-message error">
            <span className="status-icon">✕</span>
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}
