import { CATEGORY_LABELS, type FeedbackCategory } from '../../types/feedback';
import { cn } from '../../utils/cn';

const categoryStyles: Record<FeedbackCategory, string> = {
  general: 'bg-slate-100 text-slate-700',
  product: 'bg-blue-50 text-blue-700',
  service: 'bg-emerald-50 text-emerald-700',
  support: 'bg-amber-50 text-amber-700',
  billing: 'bg-purple-50 text-purple-700',
  other: 'bg-rose-50 text-rose-700',
};

interface CategoryBadgeProps {
  category: FeedbackCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        categoryStyles[category],
        className
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}
