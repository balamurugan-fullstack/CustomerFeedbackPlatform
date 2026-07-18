import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, Mail } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().trim().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sessionExpiredMessage = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('reason') === 'session-expired' ? 'Session expired. Please sign in again.' : null;
  }, [location.search]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Unable to sign in.');
      }

      window.localStorage.setItem('customer-feedback-admin', payload.token);
      toast.success('Signed in successfully');
      navigate('/admin', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in.';
      setSubmitError(message);
      toast.error('Sign in failed', { description: message });
    }
  };

  return (
    <PageContainer title="Admin access" description="Secure sign in for operational dashboards and health monitoring.">
      <div className="mx-auto flex max-w-md flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Admin sign in</h2>
            <p className="text-sm text-slate-500">Access customer insights and system health.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="admin@gmail.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          {(submitError || sessionExpiredMessage) && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {submitError ?? sessionExpiredMessage}
            </div>
          )}

          <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
            Sign in
          </Button>
        </form>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <Mail className="h-4 w-4" />
          <span>Use the credentials configured for the backend admin account.</span>
        </div>
      </div>
    </PageContainer>
  );
}
