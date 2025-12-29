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
    <div className="form-card">
      <h3 className="form-title">Leave a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            required
            className="form-input"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={status === 'submitting'}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, rating: star })}
                disabled={status === 'submitting'}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Review</label>
          <textarea
            required
            rows={4}
            className="form-input" 
            placeholder="Your thoughts..."
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            disabled={status === 'submitting'}
          />
        </div>

        <button 
          type="submit" 
          className="btn" 
          style={{ width: '100%' }}
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit'}
        </button>

        {status === 'success' && (
          <p className="text-status text-center success animate-fade-in">Thank you for your review!</p>
        )}
        
        {status === 'error' && (
          <p className="text-status text-center error animate-fade-in">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
