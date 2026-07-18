import { Activity, AlertTriangle, CheckCircle2, LoaderCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { healthCheck } from '../../api/client';

interface HealthSnapshot {
  status: string;
  databaseStatus: string;
  timestamp: string | null;
  uptime: number | null;
}

function formatUptime(seconds: number | null) {
  if (!seconds) {
    return '—';
  }

  const value = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const secs = value % 60;

  return `${hours}h ${minutes}m ${secs}s`;
}

export function HealthStatusCard() {
  const [data, setData] = useState<HealthSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await healthCheck();
        if (!isMounted) {
          return;
        }

        setData({
          status: response?.status ?? 'unknown',
          databaseStatus: response?.database?.status ?? 'unknown',
          timestamp: response?.timestamp ?? null,
          uptime: response?.uptime ?? null,
        });
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : 'Health check unavailable');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const isHealthy = data?.status === 'healthy';

  const statusLabel = useMemo(() => {
    if (isLoading) {
      return 'Checking';
    }

    if (error) {
      return 'Attention';
    }

    return isHealthy ? 'Healthy' : 'Degraded';
  }, [error, isHealthy, isLoading]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              error ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : error ? <AlertTriangle className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">System health</p>
            <p className="text-sm text-slate-500">Live API and database status for the admin workspace.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
          {error ? <AlertTriangle className="h-4 w-4 text-amber-600" /> : isHealthy ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Activity className="h-4 w-4 text-slate-500" />}
          <span>{statusLabel}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">API status</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{isLoading ? 'Checking…' : error ? 'Unavailable' : data?.status ?? 'Unknown'}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Database</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{isLoading ? 'Checking…' : error ? 'Unavailable' : data?.databaseStatus ?? 'Unknown'}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Uptime</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{isLoading ? 'Checking…' : error ? 'Unavailable' : formatUptime(data?.uptime ?? null)}</p>
        </div>
      </div>
    </section>
  );
}
