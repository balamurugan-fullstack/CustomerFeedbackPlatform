import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchAnalytics } from '../api/client';
import { getErrorMessage } from '../utils/errors';
import type { AnalyticsData } from '../types/feedback';

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (showToastOnError = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchAnalytics();
      setAnalytics(response.data);
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to load analytics data.');
      setError(message);
      if (showToastOnError) {
        toast.error('Analytics unavailable', { description: message });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  return { analytics, isLoading, error, reload: () => load(true) };
}
