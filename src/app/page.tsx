import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = 'force-dynamic';

async function getReviews() {
  try {
    await dbConnect();
    // Use lean() for better performance as we just need plain objects
    const reviews = await Review.find({}).sort({ date: -1 }).lean();
    
    // Serialize for props (must handle Date and ObjectId)
    return reviews.map((review: any) => ({
      id: review._id.toString(), // review._id is an object, need string for key
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      date: review.date.toISOString(), // Date object to string
    }));
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
}

export default async function Home() {
  const reviews = await getReviews();

  return (
    <>
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-bg" />
        
        <div className="container text-center">
          <h1 className="hero-title">The 12th Fail</h1>
          <p className="hero-subtitle">
            Beginning and Aftermath. A journey through failure, resilience, and the ultimate test of character.
          </p>
          <div className="hero-actions">
            <a href="/book.pdf" target="_blank" className="btn">Read Now</a>
            <a href="#reviews" className="btn-outline">Reviews</a>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="main-content" id="reviews">
        
        {/* Sidebar: Form & Author */}
        <aside className="review-sidebar">
          
          <ReviewForm />

          <div className="author-box">
            <h4 className="author-title">About the Author</h4>
            <p className="author-text">
              "Sharing a personal journey to inspire others. Failure is just the beginning."
            </p>
          </div>

        </aside>

        {/* Reviews List */}
        <section className="reviews-feed">
          <h3 className="reviews-header">Latest Reviews</h3>
          
          <ReviewList reviews={reviews} />
        </section>

      </main>
    </>
  );
}
