import { useQuery } from '@tanstack/react-query';
import { getUsers, GetUsersParams } from '../api/usersApi';

export const userKeys = {
  all: ['users'] as const,
  list: (params: GetUsersParams) => [...userKeys.all, params] as const,
};

/**
 * Hook to fetch paginated/searched users list from DummyJSON
 */
export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
  });
}
