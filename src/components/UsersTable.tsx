import React from 'react';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import type { User } from '../types/user';

interface UsersTableProps {
  users: User[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortConfig: { key: keyof User; direction: 'asc' | 'desc' };
  onSortChange: (key: keyof User) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  searchQuery,
  onSearchChange,
  sortConfig,
  onSortChange,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  loading,
}) => {
  const sortHeader = (label: string, sortKey: keyof User) => {
    const active = sortConfig.key === sortKey;
    return (
      <button
        type="button"
        onClick={() => onSortChange(sortKey)}
        className="flex items-center gap-1 hover:text-white transition-colors"
        aria-label={`Sort by ${label}`}
      >
        {label}
        {active ? (
          sortConfig.direction === 'asc' ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )
        ) : (
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 -translate-x-1 group-hover:translate-x-0 transition-all" />
        )}
      </button>
    );
  };

  const statusBadge = (status: User['status']) =>
    status === 'Active' ? (
      <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
        Active
      </span>
    ) : (
      <span className="bg-slate-700/50 text-slate-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
        Inactive
      </span>
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-indigo-400" />
        <span className="ml-3 text-slate-400">Loading users...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>No users found.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          size={18}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users..."
          aria-label="Search users"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left" role="table">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="pb-3 pr-4 text-sm font-medium text-slate-400 group">
                {sortHeader('Name', 'name')}
              </th>
              <th className="pb-3 pr-4 text-sm font-medium text-slate-400 group">
                {sortHeader('Email', 'email')}
              </th>
              <th className="pb-3 pr-4 text-sm font-medium text-slate-400 group">
                {sortHeader('Role', 'role')}
              </th>
              <th className="pb-3 text-sm font-medium text-slate-400 group">
                {sortHeader('Status', 'status')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 pr-4 text-sm text-slate-200">{user.name}</td>
                <td className="py-3 pr-4 text-sm text-slate-400">{user.email}</td>
                <td className="py-3 pr-4 text-sm text-slate-400">{user.role}</td>
                <td className="py-3 text-sm">{statusBadge(user.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-slate-400">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Showing {(currentPage - 1) * pageSize + 1}–
        {Math.min(currentPage * pageSize, users.length)} of {users.length} users
      </p>
    </div>
  );
};

export default UsersTable;