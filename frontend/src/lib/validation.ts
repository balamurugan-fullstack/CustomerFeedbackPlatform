import { z } from 'zod';
import { FEEDBACK_CATEGORIES } from '../types/feedback';

export const feedbackFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter your full name')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  category: z.enum(FEEDBACK_CATEGORIES, { message: 'Please select a category' }),
  comments: z
    .string()
    .trim()
    .min(1, 'Please share your feedback')
    .max(2000, 'Comments cannot exceed 2000 characters'),
});

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;
