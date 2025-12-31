import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendNotificationEmail } from '@/lib/email';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

const reviewSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

export async function GET() {
  try {
    await dbConnect();
    // Sort by date descending
    const reviews = await Review.find({}).sort({ date: -1 }).lean();
    
    // Convert _id to string id for the frontend
    const serializedReviews = reviews.map((review: any) => ({
      ...review,
      id: review._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(serializedReviews);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validate input
    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      // ZodError issues are in .issues
      const issues = result.error.issues;
      const errorMessage = issues.map((e: any) => e.message).join(', ');
      return NextResponse.json({ error: errorMessage, errors: issues }, { status: 400 });
    }

    const { name, rating, comment } = result.data;

    // Create new review in MongoDB
    const newReview = await Review.create({
      name,
      rating,
      comment,
      date: new Date(),
    });

    // Send email notification (Awaited to ensure completion in serverless environments)
    try {
      await sendNotificationEmail({ name, rating, comment });
    } catch (emailError) {
      console.error('[API] Email notification failed:', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      review: {
        ...newReview.toObject(),
        id: newReview._id.toString(),
        _id: undefined
      }
    });

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
