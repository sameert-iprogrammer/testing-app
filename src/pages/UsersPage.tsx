import React from 'react';

interface User {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

const mockUsers: User[] = [
  { name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', createdDate: '2026-01-15' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', status: 'Active', createdDate: '2026-02-20' },
  { name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'Viewer', status: 'Inactive', createdDate: '2026-03-10' },
  { name: 'Alice Brown', email: 'alice.brown@example.com', role: 'Editor', status: 'Active', createdDate: '2026-04-05' },
  { name: 'Charlie Wilson', email: 'charlie.wilson@example.com', role: 'Viewer', status: 'Inactive', createdDate: '2026-05-12' },
];

const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
  const styles: Record<User['status'], string> = {
    Active: 'bg-emerald-400/10 text-emerald-400',
    Inactive: 'bg-amber-400/10 text-amber-400',
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
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs uppercase bg-slate-900/50 text-slate-300">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.email} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                  <td className="px-6 py-4">{user.createdDate}</td>
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