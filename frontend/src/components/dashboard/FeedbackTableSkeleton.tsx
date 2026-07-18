import { Skeleton } from '../ui/Skeleton';

export function FeedbackTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
      aria-busy="true"
      aria-label="Loading feedback table"
    >
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
        <div className="flex gap-8">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="hidden h-3 w-24 md:block" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="hidden h-4 w-48 md:block" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}
