import mongoose, { Schema, model, models } from 'mongoose';

const ReviewSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    minlength: 5,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite upon initial compile
const Review = models.Review || model('Review', ReviewSchema);

export default Review;
