import axios, { AxiosError } from 'axios';
import { getRawToken } from '../utils/storage';

// Base Axios instance configured for DummyJSON
export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: injects the auth token into headers if available
apiClient.interceptors.request.use(
  (config) => {
    const token = getRawToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to convert Axios errors into user-friendly messages based on HTTP status codes
export function parseApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    
    // Server responded with an HTTP status code outside 2xx
    if (axiosError.response) {
      const status = axiosError.response.status;
      const serverMessage = axiosError.response.data?.message;

      if (serverMessage) {
        return serverMessage;
      }

      switch (status) {
        case 400:
          return 'Bad Request: Please check your input and try again.';
        case 401:
          return 'Unauthorized: Invalid username or password, or session expired.';
        case 403:
          return 'Forbidden: You do not have permission to perform this action.';
        case 404:
          return 'Not Found: The requested resource could not be found.';
        case 429:
          return 'Too Many Requests: Please slow down and try again in a moment.';
        case 500:
          return 'Internal Server Error: DummyJSON server encountered an error.';
        default:
          return `Request failed with status code ${status}.`;
      }
    }

    // Request was made but no response was received (network issues or timeout)
    if (axiosError.request) {
      return 'Network Error: Unable to reach the server. Please check your internet connection.';
    }

    return axiosError.message || 'An unexpected request error occurred.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
