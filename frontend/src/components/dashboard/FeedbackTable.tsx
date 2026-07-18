import { ArrowDown, ArrowUp, X } from 'lucide-react';
import { useState } from 'react';
import { CategoryBadge } from '../feedback/CategoryBadge';
import { EmptyState } from './EmptyState';
import { PaginationControls } from './PaginationControls';
import type { Feedback, FeedbackSort, PaginationMeta } from '../../types/feedback';

interface FeedbackTableProps {
  feedback: Feedback[];
  pagination: PaginationMeta | null;
  sort: FeedbackSort;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortChange: (sort: FeedbackSort) => void;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

function CommentModal({ item, onClose }: { item: Feedback | null; onClose: () => void }) {
  if (!item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-3 py-4 sm:px-4">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Customer comment</p>
            <p className="mt-1 text-sm text-slate-500">
              {item.name} · {item.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close comment"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-2.5 py-1">{item.category}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1">{formatDate(item.createdAt)}</span>
          </div>
          <div className="max-h-64 overflow-hidden overflow-y-auto break-words whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            {item.comments || 'No comment content provided.'}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function FeedbackTable({
  feedback,
  pagination,
  sort,
  onPageChange,
  onLimitChange,
  onSortChange,
}: FeedbackTableProps) {
  const [selectedComment, setSelectedComment] = useState<Feedback | null>(null);

  if (feedback.length === 0) {
    return <EmptyState />;
  }

  const SortIcon = sort === 'newest' ? ArrowDown : ArrowUp;
  const toggleSort = () => {
    onSortChange(sort === 'newest' ? 'oldest' : 'newest');
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  Comments
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                  <button
                    type="button"
                    onClick={toggleSort}
                    className="inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <span>Date</span>
                    <SortIcon className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    <span className="sr-only">
                      {sort === 'newest' ? 'sorted newest first' : 'sorted oldest first'}
                    </span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feedback.map((item) => (
                <tr key={item._id} className="transition hover:bg-slate-50/80">
                  <td className="px-4 py-4 sm:px-6">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <CategoryBadge category={item.category} />
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 sm:px-6">
                    <div className="flex min-w-[12rem] max-w-[18rem] flex-col gap-2 overflow-hidden w-full">
                      <p className="break-all whitespace-pre-wrap overflow-hidden line-clamp-2 max-w-full text-sm leading-6 text-slate-700">
                        {item.comments.length > 50 ? `${item.comments.slice(0, 50)}...` : item.comments}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedComment(item)}
                        className="w-fit text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                      >
                        View
                      </button>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500 sm:px-6">
                    <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && (
          <PaginationControls
            pagination={pagination}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
        )}
      </div>

      <CommentModal item={selectedComment} onClose={() => setSelectedComment(null)} />
    </>
  );
}
