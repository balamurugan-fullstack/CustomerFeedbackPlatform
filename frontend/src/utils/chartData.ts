import { CHART_COLORS } from '../constants/chartColors';
import {
  CATEGORY_LABELS,
  type AnalyticsData,
  type FeedbackCategory,
} from '../types/feedback';

export interface ChartDataPoint {
  category: FeedbackCategory;
  label: string;
  count: number;
  percentage: number;
  fill: string;
}

export function buildCategoryChartData(analytics: AnalyticsData | null): ChartDataPoint[] {
  if (!analytics) {
    return [];
  }

  return analytics.categoryBreakdown.map((item) => {
    const category = item.category as FeedbackCategory;

    return {
      category,
      label: CATEGORY_LABELS[category] ?? item.category,
      count: item.count,
      percentage: item.percentage,
      fill: CHART_COLORS[category] ?? '#6366f1',
    };
  });
}

export function buildPieChartData(analytics: AnalyticsData | null): ChartDataPoint[] {
  return buildCategoryChartData(analytics).filter((item) => item.count > 0);
}
