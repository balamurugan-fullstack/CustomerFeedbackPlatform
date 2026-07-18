import { useCallback, useEffect, useState } from 'react';
import { fetchFeedback } from '../api/client';
import { getErrorMessage } from '../utils/errors';
import type {
  Feedback,
  FeedbackCategory,
  FeedbackQueryParams,
  FeedbackSort,
  PaginationMeta,
} from '../types/feedback';

interface UseFeedbackListOptions {
  page: number;
  limit: number;
  search: string;
  category: FeedbackCategory | '';
  sort: FeedbackSort;
}

export function useFeedbackList({
  page,
  limit,
  search,
  category,
  sort,
}: UseFeedbackListOptions) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const params: FeedbackQueryParams = {
      page,
      limit,
      sort,
      ...(search && { search }),
      ...(category && { category }),
    };

    try {
      const response = await fetchFeedback(params);
      setFeedback(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to load feedback submissions.');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, category, sort]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      await load();
      if (!isMounted) {
        return;
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [load]);

  return { feedback, pagination, isLoading, error, reload: load };
}
