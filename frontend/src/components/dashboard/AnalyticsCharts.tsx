import { BarChart3 } from 'lucide-react';
import type { AnalyticsData } from '../../types/feedback';
import { buildCategoryChartData, buildPieChartData } from '../../utils/chartData';
import { CategoryPieChart } from './CategoryPieChart';
import { FeedbackBarChart } from './FeedbackBarChart';

interface AnalyticsChartsProps {
  analytics: AnalyticsData | null;
  isLoading: boolean;
}

function ChartsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="h-[420px] animate-pulse rounded-2xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
}

export function AnalyticsCharts({ analytics, isLoading }: AnalyticsChartsProps) {
  const barData = buildCategoryChartData(analytics);
  const pieData = buildPieChartData(analytics);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Analytics</h2>
          <p className="text-sm text-slate-500">Visual breakdown of customer feedback trends</p>
        </div>
      </div>

      {isLoading ? (
        <ChartsSkeleton />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryPieChart data={pieData} />
          <FeedbackBarChart data={barData} />
        </div>
      )}
    </section>
  );
}
