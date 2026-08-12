import React from 'react';
import { Users as UsersIcon, Mail, MapPin } from 'lucide-react';

interface User {
  name: string;
  email: string;
  address: string;
}

const mockUsers: User[] = [
  { name: 'Alice Johnson', email: 'alice@example.com', address: '123 Main St, Springfield' },
  { name: 'Bob Smith', email: 'bob@example.com', address: '456 Oak Ave, Shelbyville' },
  { name: 'Charlie Brown', email: 'charlie@example.com', address: '789 Pine Rd, Capital City' },
  { name: 'Diana Prince', email: 'diana@example.com', address: '321 Elm St, Metropolis' },
  { name: 'Edward Norton', email: 'edward@example.com', address: '654 Maple Dr, Gotham' },
];

const UsersPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Users Listing</h1>
        <p className="text-slate-400">View and manage all registered users</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full max-w-full text-left" aria-label="Users list">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Address</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.name} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-200">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.address}</td>
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