import React from 'react';
import { useState } from 'react';
import { useToast } from '../components/Toast';
import { Loader2 } from 'lucide-react';
import { Download } from 'lucide-react';

export const mockRequests = [
  { id: 'req-1', title: 'Request A', status: 'pending', createdAt: '2025-01-15' },
  { id: 'req-2', title: 'Request B', status: 'approved', createdAt: '2025-01-12' },
  { id: 'req-3', title: 'Request C', status: 'rejected', createdAt: '2025-01-10' },
];

const RequestsPage: React.FC = () => {
  const { showToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // TODO: replace with actual report-generation logic
      // await generateSampleReport();
      showToast('Report downloaded successfully.', 'success');
    } catch {
      showToast('Failed to download report. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Requests</h1>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          aria-label="Download sample requests report"
          aria-busy={isDownloading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          {isDownloading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download size={16} /> Download Report
            </>
          )}
        </button>
      </div>

      <table className="w-full border border-slate-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {mockRequests.map((req) => (
            <tr key={req.id} className="border-b border-slate-700 hover:bg-slate-900">
              <td className="p-3">{req.id}</td>
              <td className="p-3">{req.title}</td>
              <td className="p-3">{req.status}</td>
              <td className="p-3">{req.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default RequestsPage;