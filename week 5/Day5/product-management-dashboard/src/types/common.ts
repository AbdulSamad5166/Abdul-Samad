/**
 * Common shared interfaces and types
 */

export interface PaginationParams {
  limit?: number;
  skip?: number;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}

export type SortOrder = 'asc' | 'desc';
export type SortField = 'title' | 'price' | 'rating' | 'stock';
