import { useEffect, useState } from 'react';
import { AlertCircle, BarChart3, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AnalyticsCharts } from '../components/dashboard/AnalyticsCharts';
import { FeedbackTable } from '../components/dashboard/FeedbackTable';
import { FeedbackTableSkeleton } from '../components/dashboard/FeedbackTableSkeleton';
import { HealthStatusCard } from '../components/dashboard/HealthStatusCard';
import { SearchFilterBar } from '../components/dashboard/SearchFilterBar';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { useAnalytics } from '../hooks/useAnalytics';
import { useDebounce } from '../hooks/useDebounce';
import { useFeedbackList } from '../hooks/useFeedbackList';
import type { FeedbackCategory, FeedbackSort } from '../types/feedback';

export function DashboardPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<FeedbackCategory | ''>('');
  const [sort, setSort] = useState<FeedbackSort>('newest');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(search);
  const { analytics, isLoading: isLoadingAnalytics, error: analyticsError, reload: reloadAnalytics } =
    useAnalytics();

  const {
    feedback,
    pagination,
    isLoading: isLoadingFeedback,
    error: feedbackError,
    reload: reloadFeedback,
  } = useFeedbackList({
    page,
    limit,
    search: debouncedSearch,
    category,
    sort,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: FeedbackCategory | '') => {
    setCategory(value);
    setPage(1);
  };

  const handleSortChange = (value: FeedbackSort) => {
    setSort(value);
    setPage(1);
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const activeError = feedbackError ?? analyticsError;

  useEffect(() => {
    if (!activeError) {
      return;
    }

    toast.error(feedbackError && analyticsError ? 'Dashboard data unavailable' : 'Request failed', {
      description: activeError,
    });
  }, [activeError, analyticsError, feedbackError]);

  return (
    <PageContainer
      title="Customer intelligence"
      description="Monitor customer feedback, track trends, and review recent submissions in one live workspace."
    >
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Admin console
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Track customer sentiment across the entire feedback lifecycle.
              </h2>
              <p className="mt-2 text-sm text-brand-50/90">
                Review submissions, surface trends, and focus on the categories that need attention most.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Live summary</p>
                <p className="text-xs text-brand-50/80">Updated from the analytics API</p>
              </div>
            </div>
          </div>
        </div>

        <HealthStatusCard />

        <StatsGrid analytics={analytics} isLoading={isLoadingAnalytics} />

        <AnalyticsCharts analytics={analytics} isLoading={isLoadingAnalytics} />

        <SearchFilterBar
          search={search}
          category={category}
          sort={sort}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />

        {activeError && (
          <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{activeError}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                void reloadAnalytics();
                void reloadFeedback();
              }}
            >
              Retry
            </Button>
          </div>
        )}

        {isLoadingFeedback ? (
          <FeedbackTableSkeleton rows={limit > 5 ? 8 : 5} />
        ) : (
          <FeedbackTable
            feedback={feedback}
            pagination={pagination}
            sort={sort}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
            onSortChange={handleSortChange}
          />
        )}
      </div>
    </PageContainer>
  );
}
