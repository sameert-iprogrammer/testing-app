import React from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', lastActive: '2026-08-14' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', status: 'Active', lastActive: '2026-08-13' },
  { id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'Viewer', status: 'Inactive', lastActive: '2026-07-20' },
  { id: '4', name: 'Alice Williams', email: 'alice.williams@example.com', role: 'Editor', status: 'Active', lastActive: '2026-08-12' },
  { id: '5', name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'Viewer', status: 'Inactive', lastActive: '2026-06-15' },
  { id: '6', name: 'Diana Prince', email: 'diana.prince@example.com', role: 'Admin', status: 'Active', lastActive: '2026-08-14' },
];

const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
  const styles: Record<User['status'], string> = {
    Active: 'bg-emerald-400/10 text-emerald-400',
    Inactive: 'bg-slate-400/10 text-slate-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const UsersPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
        <p className="text-slate-400">Manage and view all registered users</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full max-w-full text-left" aria-label="User listing">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.role}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{user.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;