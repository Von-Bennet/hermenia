document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsList = document.getElementById('reviewsList');
    const starContainer = document.getElementById('starContainer');
    const ratingInput = document.getElementById('rating');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    // === Star Rating Logic ===
    starContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('star-btn')) {
            const rating = parseInt(e.target.dataset.rating);
            ratingInput.value = rating;
            updateStars(rating);
        }
    });

    function updateStars(rating) {
        const stars = starContainer.querySelectorAll('.star-btn');
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            if (starRating <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // === Fetch Reviews ===
    async function fetchReviews() {
        try {
            const res = await fetch('/api/reviews');
            const reviews = await res.json();
            renderReviews(reviews);
        } catch (error) {
            reviewsList.innerHTML = '<p class="text-error">Failed to load reviews.</p>';
        }
    }

    function renderReviews(reviews) {
        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="space-y-6">
                    <h3 class="mb-6" style="font-size: 1.5rem; font-family: var(--font-serif);">Recent Reviews</h3>
                    <p class="italic" style="color: var(--text-muted);">No reviews yet. Be the first to review!</p>
                </div>
            `;
            return;
        }

        const html = `
            <h3 class="mb-6" style="font-size: 1.5rem; font-family: var(--font-serif);">Recent Reviews</h3>
            ${reviews.map(review => `
                <div class="review-card animate-fade-in">
                    <div class="review-header">
                        <span class="review-author">${escapeHtml(review.name)}</span>
                        <div class="review-stars">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                        </div>
                    </div>
                    <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
                    <p class="review-text mt-4">"${escapeHtml(review.comment)}"</p>
                </div>
            `).join('')}
        `;
        reviewsList.innerHTML = html;
    }

    // === Submit Review ===
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            rating: parseInt(document.getElementById('rating').value),
            comment: document.getElementById('comment').value
        };

        // Loading State
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        formStatus.textContent = '';
        formStatus.className = 'mt-4 text-center';

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit');
            }

            // Success
            formStatus.textContent = 'Thank you for your review!';
            formStatus.classList.add('text-success');
            reviewForm.reset();
            updateStars(5); // Reset stars to 5
            ratingInput.value = 5;
            
            // Refresh reviews
            fetchReviews();

            // Reset status after 3s
            setTimeout(() => {
                formStatus.textContent = '';
            }, 3000);

        } catch (error) {
            formStatus.textContent = error.message;
            formStatus.classList.add('text-error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Review';
        }
    });

    // Helper to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Initial Load
    fetchReviews();
});
