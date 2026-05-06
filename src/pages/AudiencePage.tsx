import React from 'react';

interface AudienceMember {
  userName: string;
  email: string;
  location: string;
  device: string;
  lastActive: string;
}

const mockAudience: AudienceMember[] = [
  { userName: "Alice Johnson", email: "alice@example.com", location: "New York, US", device: "Desktop", lastActive: "2 min ago" },
  { userName: "Bob Smith", email: "bob@example.com", location: "London, UK", device: "Mobile", lastActive: "15 min ago" },
  { userName: "Carol White", email: "carol@example.com", location: "Toronto, CA", device: "Tablet", lastActive: "1 hour ago" },
  { userName: "David Brown", email: "david@example.com", location: "Sydney, AU", device: "Desktop", lastActive: "3 hours ago" },
  { userName: "Eva Martinez", email: "eva@example.com", location: "Berlin, DE", device: "Mobile", lastActive: "1 day ago" },
];

const AudiencePage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Audience</h1>
        <p className="text-slate-400">View audience insights and user details</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full max-w-full text-left" aria-label="Audience members">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">User Name</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Device</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {mockAudience.map((member) => (
                <tr key={member.userName} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-200">{member.userName}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{member.location}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{member.device}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{member.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AudiencePage;
