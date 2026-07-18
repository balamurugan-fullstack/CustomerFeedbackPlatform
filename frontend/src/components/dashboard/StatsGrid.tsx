import { BarChart3, CalendarDays, MessageSquare, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import type { AnalyticsData } from '../../types/feedback';
import { CATEGORY_LABELS } from '../../types/feedback';

interface StatsGridProps {
  analytics: AnalyticsData | null;
  isLoading: boolean;
}

export function StatsGrid({ analytics, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    );
  }

  const topCategory = analytics?.topCategories[0];
  const topCategoryLabel = topCategory
    ? CATEGORY_LABELS[topCategory.category as keyof typeof CATEGORY_LABELS] ?? topCategory.category
    : '—';

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Feedback"
        value={analytics?.totalFeedback ?? 0}
        subtitle="All time submissions"
        icon={MessageSquare}
      />
      <StatCard
        title="Last 7 Days"
        value={analytics?.recentFeedbackCount ?? 0}
        subtitle="Recent activity"
        icon={CalendarDays}
      />
      <StatCard
        title="Top Category"
        value={topCategoryLabel}
        subtitle={topCategory ? `${topCategory.count} submissions` : 'No data yet'}
        icon={TrendingUp}
      />
      <StatCard
        title="Categories Active"
        value={analytics?.topCategories.length ?? 0}
        subtitle="With at least one response"
        icon={BarChart3}
      />
    </div>
  );
}
