import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { submitFeedback } from '../../api/client';
import { feedbackFormSchema, type FeedbackFormValues } from '../../lib/validation';
import { CATEGORY_LABELS, FEEDBACK_CATEGORIES } from '../../types/feedback';
import { getErrorMessage, getFieldErrors, getFormErrors } from '../../utils/errors';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

const defaultValues: FeedbackFormValues = {
  name: '',
  email: '',
  category: 'general',
  comments: '',
};

const categoryOptions = FEEDBACK_CATEGORIES.map((category) => ({
  value: category,
  label: CATEGORY_LABELS[category],
}));

export function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    mode: 'onBlur',
    defaultValues,
  });

  const commentsLength = watch('comments')?.length ?? 0;

  const onSubmit = async (data: FeedbackFormValues) => {
    setSubmitError(null);
    clearErrors();

    try {
      await submitFeedback(data);
      setSubmitted(true);
      reset(defaultValues);
      toast.success('Feedback received', {
        description: 'Thanks for taking the time to share your feedback with us.',
      });
    } catch (error) {
      const message = getErrorMessage(error, 'We could not submit your feedback right now.');
      const fieldErrors = getFieldErrors(error);
      const formErrors = getFormErrors(error);
      const description = formErrors[0] ?? message;

      Object.entries(fieldErrors).forEach(([field, fieldMessage]) => {
        setError(field as keyof FeedbackFormValues, { type: 'server', message: fieldMessage });
      });

      setSubmitError(description);
      toast.error('Submission could not be completed', {
        description,
      });
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Thank you for your feedback!</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your response has been recorded. Our team will review it and use it to improve the product experience.
        </p>
        <Button
          className="mt-6"
          onClick={() => {
            setSubmitted(false);
            setSubmitError(null);
          }}
        >
          Submit another response
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Share a few details</h2>
          <p className="text-sm text-slate-500">We use this to understand what customers care about most.</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          hint="Required · up to 100 characters"
          {...register('name')}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="jane@example.com"
          error={errors.email?.message}
          hint="We'll never share your email"
          autoComplete="email"
          {...register('email')}
        />
      </div>

      <div className="mt-5">
        <Select
          label="Category"
          options={categoryOptions}
          error={errors.category?.message}
          {...register('category')}
        />
      </div>

      <div className="mt-5">
        <Textarea
          label="Your feedback"
          placeholder="Tell us about your experience..."
          error={errors.comments?.message}
          hint="Be as specific as possible so we can improve"
          showCount
          currentLength={commentsLength}
          maxLength={2000}
          {...register('comments')}
        />
      </div>

      {submitError && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {submitError}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Your feedback helps us improve our products and services.
        </p>
        <Button type="submit" size="lg" isLoading={isSubmitting}>
          Submit feedback
        </Button>
      </div>
    </form>
  );
}
