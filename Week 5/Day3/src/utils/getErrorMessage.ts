import axios from 'axios';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      return 'Request timed out. Please check your connection and try again.';
    }
    if (!error.response) {
      return 'Network error. Please check your internet connection.';
    }
    const status = error.response.status;
    if (status === 404) {
      return 'The requested resource was not found (404).';
    }
    if (status >= 500) {
      return 'A server error occurred (500). Please try again later.';
    }
    if (
      error.response.data &&
      typeof error.response.data === 'object' &&
      'message' in error.response.data &&
      typeof error.response.data.message === 'string'
    ) {
      return error.response.data.message;
    }
    return `Server error (${status}). Please try again.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
