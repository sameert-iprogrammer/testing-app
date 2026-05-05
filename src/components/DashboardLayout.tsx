import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  LogOut,
  ChevronRight,
  Download,
  Loader2,
} from 'lucide-react';
import { generateSampleReport } from '../utils/generateSampleReport';
import { ToastProvider, useToast } from './Toast';

interface LayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-950 text-slate-200 flex">
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-md hidden md:flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">Nexus Analytics</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active />
            <NavItem icon={<Users size={20} />} label="Audience" />
            <NavItem icon={<BarChart3 size={20} />} label="Reports" />
            <NavItem icon={<Settings size={20} />} label="Settings" />
          </nav>

          <div className="p-4 mt-auto border-t border-slate-800">
            <div className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer group">
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=John+Doe&background=4f46e5&color=fff" alt="User" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-slate-500 truncate">Admin Account</p>
              </div>
              <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6 md:p-10">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

const DashboardHeader: React.FC = () => {
  const { showToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateSampleReport();
      showToast('Report downloaded successfully.', 'success');
    } catch {
      showToast('Failed to download report. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden text-slate-400">
          <Menu size={24} />
        </button>
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search analytics..."
            className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
        </button>
        <div className="h-8 w-px bg-slate-800 mx-2"></div>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          aria-label="Download sample analytics report"
          aria-busy={isDownloading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          {isDownloading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download size={16} />
              Download Report
            </>
          )}
        </button>
      </div>
    </header>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <a href="#" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${active ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
    <span className={active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}>{icon}</span>
    <span className="font-medium text-sm flex-1">{label}</span>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>}
    {!active && <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-slate-600" />}
  </a>
);

export default DashboardLayout;
