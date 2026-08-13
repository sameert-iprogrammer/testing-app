import React from 'react';
import type { User } from '../data/users';
import { MOCK_USERS } from '../data/users';

const UsersPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
        <p className="text-slate-400">Manage and view all registered users.</p>
      </div>

      <div className="overflow-x-auto bg-slate-900/40 border border-slate-800 rounded-2xl">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-800">
              <th className="px-6 py-4 text-slate-300 font-medium">Name</th>
              <th className="px-6 py-4 text-slate-300 font-medium">Email</th>
              <th className="px-6 py-4 text-slate-300 font-medium">Role</th>
              <th className="px-6 py-4 text-slate-300 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((user) => (
              <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-slate-200 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-slate-400">{user.email}</td>
                <td className="px-6 py-4 text-slate-400">{user.role}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={user.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
  const styles = {
    Active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    Inactive: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

export default UsersPage;