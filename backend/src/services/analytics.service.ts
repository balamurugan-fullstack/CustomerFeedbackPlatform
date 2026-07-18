import { Feedback, FEEDBACK_CATEGORIES } from '../models/Feedback';

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface AnalyticsResult {
  totalFeedback: number;
  categoryBreakdown: CategoryBreakdown[];
  recentFeedbackCount: number;
  topCategories: CategoryBreakdown[];
}

export async function getAnalytics(): Promise<AnalyticsResult> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [totalFeedback, categoryAggregation, recentFeedbackCount] = await Promise.all([
    Feedback.countDocuments(),
    Feedback.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Feedback.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
  ]);

  const countByCategory = new Map(
    categoryAggregation.map((item) => [item._id, item.count])
  );

  const categoryBreakdown: CategoryBreakdown[] = FEEDBACK_CATEGORIES.map((category) => {
    const count = countByCategory.get(category) ?? 0;
    const percentage = totalFeedback > 0 ? Number(((count / totalFeedback) * 100).toFixed(2)) : 0;

    return { category, count, percentage };
  });

  const topCategories = [...categoryBreakdown]
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalFeedback,
    categoryBreakdown,
    recentFeedbackCount,
    topCategories,
  };
}
