import { ArrowDownAZ, Search } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Select } from '../ui/Select';
import {
  CATEGORY_LABELS,
  FEEDBACK_CATEGORIES,
  SORT_OPTIONS,
  type FeedbackCategory,
  type FeedbackSort,
} from '../../types/feedback';

const categoryOptions = [
  { value: '', label: 'All categories' },
  ...FEEDBACK_CATEGORIES.map((category) => ({
    value: category,
    label: CATEGORY_LABELS[category],
  })),
];

interface SearchFilterBarProps {
  search: string;
  category: FeedbackCategory | '';
  sort: FeedbackSort;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: FeedbackCategory | '') => void;
  onSortChange: (value: FeedbackSort) => void;
}

export function SearchFilterBar({
  search,
  category,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: SearchFilterBarProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr] xl:items-start">
        <div className="flex h-full flex-col gap-2">
          <label htmlFor="feedback-search" className="block text-sm font-medium text-slate-700">
            Search feedback
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="feedback-search"
              type="search"
              placeholder="Search by name, email, or comments..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className={cn(
                "w-full h-12 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:outline-none"
              )}
            />
          </div>
          <p className="mt-auto text-xs text-slate-500">Results update automatically as you type</p>
        </div>

        <div className="flex h-full flex-col gap-2">
          <Select
            label="Category"
            options={categoryOptions}
            value={category}
            onChange={(event) => onCategoryChange(event.target.value as FeedbackCategory | '')}
            className="h-12"
          />
          <p className="mt-auto text-xs text-slate-500">Filter by feedback type</p>
        </div>

        <div className="flex h-full flex-col gap-2">
          <Select
            label="Sort by"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(event) => onSortChange(event.target.value as FeedbackSort)}
            hint="Default: newest first"
            className="h-12"
          />
          <p className="mt-auto text-xs text-slate-500">Arrange rows by date</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <ArrowDownAZ className="h-3.5 w-3.5 text-brand-600" />
        <span>Sorted by submission date ({sort === 'newest' ? 'newest first' : 'oldest first'})</span>
      </div>
    </div>
  );
}
