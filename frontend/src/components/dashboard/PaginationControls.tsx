import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import type { PaginationMeta } from '../../types/feedback';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 per page' },
  { value: '25', label: '25 per page' },
  { value: '50', label: '50 per page' },
];

interface PaginationControlsProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

function getVisiblePages(current: number, total: number): number[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current]);

  for (let offset = -1; offset <= 1; offset += 1) {
    const page = current + offset;
    if (page >= 1 && page <= total) {
      pages.add(page);
    }
  }

  return [...pages].sort((a, b) => a - b);
}

export function PaginationControls({
  pagination,
  onPageChange,
  onLimitChange,
}: PaginationControlsProps) {
  const { page, limit, total, totalPages, hasPrevPage, hasNextPage } = pagination;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{start}</span>–
          <span className="font-medium text-slate-700">{end}</span> of{' '}
          <span className="font-medium text-slate-700">{total}</span> results
        </p>

        <div className="w-36">
          <Select
            options={PAGE_SIZE_OPTIONS}
            value={String(limit)}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            aria-label="Results per page"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        <div className="mx-1 flex items-center gap-1">
          {visiblePages.map((pageNumber, index) => {
            const prevPage = visiblePages[index - 1];
            const showEllipsis = prevPage !== undefined && pageNumber - prevPage > 1;

            return (
              <span key={pageNumber} className="flex items-center gap-1">
                {showEllipsis && <span className="px-1 text-slate-400">…</span>}
                <button
                  type="button"
                  onClick={() => onPageChange(pageNumber)}
                  aria-label={`Page ${pageNumber}`}
                  aria-current={pageNumber === page ? 'page' : undefined}
                  className={
                    pageNumber === page
                      ? 'min-w-8 rounded-lg bg-brand-600 px-2.5 py-1.5 text-sm font-medium text-white'
                      : 'min-w-8 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100'
                  }
                >
                  {pageNumber}
                </button>
              </span>
            );
          })}
        </div>

        <Button
          variant="secondary"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
