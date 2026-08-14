import React from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '../components/Toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const mockUsers: User[] = [
  { id: 'USR-001', name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15T08:30:00Z' },
  { id: 'USR-002', name: 'Bob Smith', email: 'bob.smith@example.com', role: 'Editor', status: 'active', createdAt: '2024-02-20T14:45:00Z' },
  { id: 'USR-003', name: 'Carol Williams', email: 'carol.williams@example.com', role: 'Viewer', status: 'inactive', createdAt: '2024-03-10T09:15:00Z' },
  { id: 'USR-004', name: 'David Brown', email: 'david.brown@example.com', role: 'Editor', status: 'active', createdAt: '2024-04-05T16:00:00Z' },
  { id: 'USR-005', name: 'Eva Martinez', email: 'eva.martinez@example.com', role: 'Viewer', status: 'inactive', createdAt: '2024-05-12T11:20:00Z' },
];

const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
  const styles: Record<User['status'], string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    inactive: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const UsersPage: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
          <p className="text-slate-400 mt-1">Manage and view all registered users.</p>
        </div>
        <button
          onClick={() => showToast('Create User functionality coming soon!', 'success')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create User
        </button>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full max-w-full text-left" aria-label="Users list">
            <thead className="bg-slate-900/60 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                mockUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;