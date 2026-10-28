import { useState } from 'react';
import { Users as UsersIcon, Mail, Phone, Briefcase, Search } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SearchBar } from '../components/ui/SearchBar';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonTable } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { parseApiError } from '../api/client';

export function UsersPage() {
  const limit = 10;
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const skip = (page - 1) * limit;

  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useUsers({
    limit,
    skip,
    search: searchTerm,
  });

  const totalUsers = usersData?.total ?? 0;
  const totalPages = Math.ceil(totalUsers / limit) || 1;
  const usersList = usersData?.users || [];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            User Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Registered customer and administrator accounts from DummyJSON /users API
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search users by name, username, or role..."
        />
      </div>

      {/* Main Content */}
      {isError ? (
        <ErrorState
          title="Failed to retrieve users"
          message={parseApiError(error)}
          onRetry={refetch}
          isRetrying={isRefetching}
        />
      ) : isLoading ? (
        <SkeletonTable rows={10} />
      ) : usersList.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="w-10 h-10" />}
          title="No users found"
          description={
            searchTerm
              ? `No user profiles match your query "${searchTerm}".`
              : 'The user directory is currently empty.'
          }
          actionText="Clear Search"
          onAction={() => handleSearch('')}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">User</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Company & Role</th>
                    <th className="py-3 px-4">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {usersList.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-10 h-10 rounded-full object-cover bg-indigo-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-slate-400">@{user.username}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[180px]">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {user.company?.title || user.role || 'Member'}
                        </div>
                        <div className="text-slate-400 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          <span>{user.company?.name || 'Independent'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                        {user.address ? (
                          <span>
                            {user.address.city}, {user.address.state}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalUsers}
              limit={limit}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
