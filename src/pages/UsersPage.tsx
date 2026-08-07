import React, { useCallback } from 'react';
import UsersTable from '../components/UsersTable';
import useUsers from '../hooks/useUsers';
import type { User } from '../types/user';

const UsersPage: React.FC = () => {
  const {
    paginatedUsers: users,
    searchQuery,
    setSearchQuery,
    sortConfig,
    setSortConfig,
    currentPage,
    totalPages,
    pageSize,
    nextPage,
    prevPage,
    error,
    loading,
    fetchUsers,
  } = useUsers();

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery],
  );

  const handleSortChange = useCallback(
    (key: keyof User) => {
      setSortConfig((prev) => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
      }));
    },
    [setSortConfig],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page > currentPage) {
        nextPage();
      } else if (page < currentPage) {
        prevPage();
      }
    },
    [currentPage, nextPage, prevPage],
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          User Management
        </h1>
        <p className="text-slate-400">
          View and manage all system users.
        </p>
      </div>

      {error && (
        <div
          className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between"
          role="alert"
        >
          <p className="text-rose-400 text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchUsers}
            className="text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <UsersTable
        users={users}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
};

export default UsersPage;