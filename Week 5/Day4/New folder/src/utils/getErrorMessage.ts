interface ApiErrorResponse {
  message?: string;
}

interface HttpErrorLike {
  isAxiosError?: unknown;
  code?: unknown;
  response?: {
    status?: unknown;
    data?: ApiErrorResponse;
  };
}

function asHttpError(error: unknown): HttpErrorLike | undefined {
  if (typeof error !== "object" || error === null || !("isAxiosError" in error)) {
    return undefined;
  }

  const candidate = error as HttpErrorLike;
  return candidate.isAxiosError === true ? candidate : undefined;
}

export function getErrorStatus(error: unknown): number | undefined {
  const status = asHttpError(error)?.response?.status;
  return typeof status === "number" ? status : undefined;
}

export function getErrorMessage(error: unknown): string {
  const httpError = asHttpError(error);
  if (!httpError) {
    return "Something went wrong. Please try again.";
  }

  const status = getErrorStatus(error);

  if (status === 400) {
    return httpError.response?.data?.message ?? "Please check the information and try again.";
  }

  if (status === 401) {
    return "Your session is not authorized. Please log in again.";
  }

  if (status === 404) {
    return "The requested resource could not be found.";
  }

  if (status !== undefined && status >= 500) {
    return "The service is temporarily unavailable. Please try again later.";
  }

  if (httpError.code === "ECONNABORTED" || httpError.code === "ETIMEDOUT") {
    return "The request timed out. Please try again.";
  }

  if (!httpError.response) {
    return "Unable to connect. Check your internet connection and try again.";
  }

  return "Something went wrong. Please try again.";
}
