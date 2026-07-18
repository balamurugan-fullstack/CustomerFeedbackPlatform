import axios from 'axios';
import type {
  AnalyticsResponse,
  CreateFeedbackPayload,
  Feedback,
  FeedbackListResponse,
  FeedbackQueryParams,
} from '../types/feedback';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('customer-feedback-admin');
}

function getAuthHeaders() {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.localStorage.removeItem('customer-feedback-admin');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.assign('/admin/login?reason=session-expired');
      }
    }

    return Promise.reject(error);
  }
);

export async function submitFeedback(payload: CreateFeedbackPayload): Promise<Feedback> {
  const response = await api.post<{ success: boolean; data: Feedback; message?: string }>(
    '/api/feedback',
    payload
  );
  return response.data.data;
}

export async function fetchFeedback(
  params: FeedbackQueryParams = {}
): Promise<FeedbackListResponse> {
  const { data } = await api.get<FeedbackListResponse>('/api/feedback', { params });
  return data;
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const { data } = await api.get<AnalyticsResponse>('/api/analytics', {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function healthCheck() {
  const result = await api.get('/health', { headers: getAuthHeaders() });
  return result.data;
}

export { api };
