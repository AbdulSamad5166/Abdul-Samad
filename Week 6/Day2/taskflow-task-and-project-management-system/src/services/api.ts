import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Single configured Axios instance with interceptors and centralized error handling.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem('taskflow_auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // safe fallback if localStorage not accessible
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle errors centrally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let errorMessage = 'An unexpected network error occurred.';
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again shortly.';
      } else {
        errorMessage =
          (error.response.data as { message?: string })?.message ||
          `Request failed with status code ${status}`;
      }
    } else if (error.request) {
      errorMessage = 'No response received from server. Operating in offline/local storage mode.';
    } else {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
