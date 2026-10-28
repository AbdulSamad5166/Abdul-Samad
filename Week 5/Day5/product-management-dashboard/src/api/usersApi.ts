import { apiClient } from './client';
import { UsersResponse } from '../types/user';

export interface GetUsersParams {
  limit?: number;
  skip?: number;
  search?: string;
}

/**
 * Fetch users list from DummyJSON /users
 */
export async function getUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
  const { limit = 10, skip = 0, search = '' } = params;

  let url = '/users';
  const queryParams: Record<string, string | number> = {
    limit,
    skip,
  };

  if (search.trim()) {
    url = '/users/search';
    queryParams.q = search.trim();
  }

  const response = await apiClient.get<UsersResponse>(url, {
    params: queryParams,
  });

  return response.data;
}
