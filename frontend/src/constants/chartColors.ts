import type { FeedbackCategory } from '../types/feedback';

export const CHART_COLORS: Record<FeedbackCategory, string> = {
  general: '#64748b',
  product: '#3b82f6',
  service: '#10b981',
  support: '#f59e0b',
  billing: '#8b5cf6',
  other: '#f43f5e',
};

export const CHART_COLOR_LIST = Object.values(CHART_COLORS);

export const CHART_GRID_COLOR = '#e2e8f0';
export const CHART_AXIS_COLOR = '#94a3b8';
export const CHART_TOOLTIP_BG = '#ffffff';
