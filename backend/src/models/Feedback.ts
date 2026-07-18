import mongoose, { Document, Schema } from 'mongoose';

export const FEEDBACK_CATEGORIES = [
  'general',
  'product',
  'service',
  'support',
  'billing',
  'other',
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export interface IFeedback extends Document {
  name: string;
  email: string;
  category: FeedbackCategory;
  comments: string;
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    category: {
      type: String,
      required: true,
      enum: FEEDBACK_CATEGORIES,
    },
    comments: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

feedbackSchema.index({ category: 1, createdAt: -1 });
feedbackSchema.index({ name: 'text', email: 'text', comments: 'text' });

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
