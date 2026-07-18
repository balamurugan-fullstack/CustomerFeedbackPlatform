import { ArrowRight, MessageSquareQuote } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { FeedbackForm } from '../components/feedback/FeedbackForm';

export function FeedbackPage() {
  return (
    <PageContainer
      title="Tell us what matters"
      description="Capture product feedback in seconds and help the team prioritise the moments that matter most."
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
            <MessageSquareQuote className="h-4 w-4" />
            Public feedback channel
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
            A modern way to collect customer sentiment
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            Every submission becomes a signal for product, service, and support teams, helping BM teams respond faster and make better decisions.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ['Fast capture', 'A guided form for customer feedback.'],
              ['Structured data', 'Category-aware submissions for analysis.'],
              ['Team-ready view', 'Insights available on the admin dashboard.'],
            ].map(([title, subtitle]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
              </div>
            ))}
          </div>
          <a
            href="/admin"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
          >
            Explore admin insights <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <FeedbackForm />
      </div>
    </PageContainer>
  );
}
