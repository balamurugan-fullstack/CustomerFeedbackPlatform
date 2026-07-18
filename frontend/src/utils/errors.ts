import { isAxiosError } from 'axios';

interface ZodFieldErrors {
  fieldErrors?: Record<string, string[] | string>;
  formErrors?: string[];
}

interface ApiErrorBody {
  message?: string;
  details?: ZodFieldErrors | string;
}

const NETWORK_ERROR_MESSAGE =
  'Unable to reach the server. Check your connection and try again.';
const UNKNOWN_ERROR_MESSAGE = 'Something went wrong. Please try again.';

function normalizeMessages(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter((message): message is string => Boolean(message));
  }

  if (typeof value === 'string' && value.trim()) {
    return [value];
  }

  return [];
}

export function getErrorMessage(error: unknown, fallback = UNKNOWN_ERROR_MESSAGE): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return NETWORK_ERROR_MESSAGE;
    }

    const { status, data } = error.response;
    const payload = data?.details;

    if (typeof payload === 'object' && payload && 'formErrors' in payload) {
      const [firstFormError] = normalizeMessages(payload.formErrors);
      if (firstFormError) {
        return firstFormError;
      }
    }

    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message;
    }

    if (status === 404) return 'The requested resource was not found.';
    if (status === 400) return 'The submission could not be processed. Please check the form fields.';
    if (status === 429) return 'Too many requests. Please wait a moment and try again.';
    if (status >= 500) return 'Server error. Please try again later.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function getFieldErrors(error: unknown): Record<string, string> {
  if (!isAxiosError<ApiErrorBody>(error) || !error.response?.data?.details) {
    return {};
  }

  const details = error.response.data.details;

  if (typeof details === 'string' || !details || typeof details !== 'object' || !('fieldErrors' in details)) {
    return {};
  }

  return Object.entries(details.fieldErrors ?? {}).reduce<Record<string, string>>(
    (acc, [field, messages]) => {
      const [firstMessage] = normalizeMessages(Array.isArray(messages) ? messages : [messages]);
      if (firstMessage) {
        acc[field] = firstMessage;
      }
      return acc;
    },
    {}
  );
}

export function getFormErrors(error: unknown): string[] {
  if (!isAxiosError<ApiErrorBody>(error) || !error.response?.data?.details) {
    return [];
  }

  const details = error.response.data.details;

  if (typeof details === 'string') {
    return [details];
  }

  if (typeof details !== 'object' || !details || !('formErrors' in details)) {
    return [];
  }

  return normalizeMessages(details.formErrors);
}
