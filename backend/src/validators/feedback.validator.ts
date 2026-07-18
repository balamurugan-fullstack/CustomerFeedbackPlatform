import { z } from 'zod';
import { FEEDBACK_CATEGORIES } from '../models/Feedback';

const feedbackSortSchema = z.enum(['newest', 'oldest']).default('newest');

export const createFeedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be at most 255 characters'),
  category: z.enum(FEEDBACK_CATEGORIES, {
    errorMap: () => ({
      message: `Category must be one of: ${FEEDBACK_CATEGORIES.join(', ')}`,
    }),
  }),
  comments: z
    .string()
    .trim()
    .min(1, 'Comments are required')
    .max(2000, 'Comments must be at most 2000 characters'),
});

export const getFeedbackQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(100).optional(),
  category: z.enum(FEEDBACK_CATEGORIES).optional(),
  sort: feedbackSortSchema.optional(),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type GetFeedbackQuery = z.infer<typeof getFeedbackQuerySchema>;
