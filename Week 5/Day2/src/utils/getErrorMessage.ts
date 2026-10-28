import axios from 'axios';

/**
 * Converts Axios errors and other errors into friendly, human-readable error messages.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Check for timeout or abort
    if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
      return 'Request timed out. Please check your connection and try again.';
    }

    // Network errors where no response was received
    if (!error.response) {
      return 'Network error: Unable to reach the server. Please check your connection.';
    }

    // Server-side HTTP status code handling
    const status = error.response.status;
    if (status === 400) {
      return 'Bad request (400). Please check the submitted information.';
    }
    if (status === 404) {
      return 'The requested resource was not found (404).';
    }
    if (status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    if (status >= 500) {
      return `Server error (${status}). The DummyJSON service encountered an error. Please try again later.`;
    }

    // Any other HTTP response error
    return error.response.data?.message || `Server responded with status ${status}. Please try again.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
