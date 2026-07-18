import { FilterQuery } from 'mongoose';
import { Feedback, IFeedback } from '../models/Feedback';
import { CreateFeedbackInput, GetFeedbackQuery } from '../validators/feedback.validator';
import { sendFeedbackNotification } from '../utils/mailer';

export type FeedbackRecord = Pick<
  IFeedback,
  'name' | 'email' | 'category' | 'comments' | 'createdAt'
> & {
  _id: IFeedback['_id'];
};

export interface PaginatedFeedbackResult {
  data: FeedbackRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

function buildFeedbackFilter(query: GetFeedbackQuery): FilterQuery<IFeedback> {
  const filter: FilterQuery<IFeedback> = {};

  if (query.category) {
    filter.category = query.category;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { comments: searchRegex },
    ];
  }

  return filter;
}

function resolveSortDirection(sort?: GetFeedbackQuery['sort']): 1 | -1 {
  return sort === 'oldest' ? 1 : -1;
}

export async function createFeedback(input: CreateFeedbackInput): Promise<IFeedback> {
  const feedback = await Feedback.create(input);

  try {
    await sendFeedbackNotification({
      name: feedback.name,
      email: feedback.email,
      category: feedback.category,
      comments: feedback.comments,
      createdAt: feedback.createdAt ?? new Date(),
    });
  } catch {
    // Swallow notification failures so feedback submission still succeeds.
  }

  return feedback;
}

export async function getFeedback(query: GetFeedbackQuery): Promise<PaginatedFeedbackResult> {
  const filter = buildFeedbackFilter(query);
  const skip = (query.page - 1) * query.limit;
  const sortDirection = resolveSortDirection(query.sort);

  const [data, total] = await Promise.all([
    Feedback.find(filter)
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Feedback.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / query.limit) || 1;

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPrevPage: query.page > 1,
    },
  };
}
