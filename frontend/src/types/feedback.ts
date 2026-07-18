export const FEEDBACK_CATEGORIES = [
  'general',
  'product',
  'service',
  'support',
  'billing',
  'other',
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export interface Feedback {
  _id: string;
  name: string;
  email: string;
  category: FeedbackCategory;
  comments: string;
  createdAt: string;
}

export interface CreateFeedbackPayload {
  name: string;
  email: string;
  category: FeedbackCategory;
  comments: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FeedbackListResponse {
  success: boolean;
  data: Feedback[];
  pagination: PaginationMeta;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  totalFeedback: number;
  categoryBreakdown: CategoryBreakdown[];
  recentFeedbackCount: number;
  topCategories: CategoryBreakdown[];
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

export interface FeedbackQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: FeedbackCategory;
  sort?: FeedbackSort;
}

export type FeedbackSort = 'newest' | 'oldest';

export const SORT_OPTIONS: { value: FeedbackSort; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];

export const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  general: 'General',
  product: 'Product',
  service: 'Service',
  support: 'Support',
  billing: 'Billing',
  other: 'Other',
};
