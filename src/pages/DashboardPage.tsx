import React from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import CustomersTable, { type Customer } from '../components/CustomersTable';

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-alice-nguyen',
    name: 'Alice Nguyen',
    email: 'alice.nguyen@example.com',
    company: 'Northwind Traders',
    status: 'Active',
    joined: '2025-11-12',
  },
  {
    id: 'cust-ben-ortega',
    name: 'Ben Ortega',
    email: 'ben.ortega@example.com',
    company: 'Contoso Labs',
    status: 'Invited',
    joined: '2026-01-04',
  },
  {
    id: 'cust-chandra-patel',
    name: 'Chandra Patel',
    email: 'chandra.patel@example.com',
    company: 'Fabrikam Inc.',
    status: 'Active',
    joined: '2025-08-22',
  },
  {
    id: 'cust-diego-muller',
    name: 'Diego Müller',
    email: 'diego.muller@example.com',
    company: 'Adventure Works',
    status: 'Churned',
    joined: '2025-03-30',
  },
  {
    id: 'cust-elena-rossi',
    name: 'Elena Rossi',
    email: 'elena.rossi@example.com',
    company: 'Tailspin Toys',
    status: 'Active',
    joined: '2026-04-18',
  },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome back, John! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          change="+20.1%" 
          trend="up" 
          icon={<DollarSign className="text-indigo-400" size={20} />} 
        />
        <StatCard 
          title="Active Users" 
          value="2,350" 
          change="+180.1%" 
          trend="up" 
          icon={<Users className="text-indigo-400" size={20} />} 
        />
        <StatCard 
          title="Page Views" 
          value="12,234" 
          change="-4.5%" 
          trend="down" 
          icon={<Eye className="text-indigo-400" size={20} />} 
        />
        <StatCard 
          title="Active Sessions" 
          value="573" 
          change="+12.5%" 
          trend="up" 
          icon={<TrendingUp className="text-indigo-400" size={20} />} 
        />
      </div>

      {/* Charts / Tables placeholder area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-lg">Revenue Over Time</h3>
            <select className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1 text-sm focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 12 Months</option>
            </select>
          </div>
          <div className="flex-1 border-b border-l border-slate-800 relative">
            {/* Visual representation of a chart using divs for premium feel */}
            <div className="absolute inset-x-0 bottom-0 h-full flex items-end justify-between px-4 pb-2">
              {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                <div key={i} className="w-12 bg-indigo-600/20 hover:bg-indigo-600/40 transition-colors rounded-t-lg relative group" style={{ height: `${h}%` }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 bg-slate-800 text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">
                    ${(h * 123).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-6">Recent Transactions</h3>
          <div className="space-y-6">
            <TransactionItem name="Stripe Payout" date="2 hours ago" amount="+$1,200.00" />
            <TransactionItem name="AWS Cloud" date="5 hours ago" amount="-$342.12" />
            <TransactionItem name="Google Workspace" date="Yesterday" amount="-$12.00" />
            <TransactionItem name="GitHub Pro" date="Yesterday" amount="-$7.00" />
            <TransactionItem name="Stripe Payout" date="2 days ago" amount="+$850.00" />
          </div>
          <button className="w-full mt-8 py-2 border border-slate-800 rounded-lg text-sm text-slate-400 hover:bg-slate-800 transition-colors">
            View All Transactions
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-lg">Customers</h3>
          <p className="text-slate-400 text-sm mt-1">Recent accounts on the platform</p>
        </div>
        <CustomersTable customers={MOCK_CUSTOMERS} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, trend, icon }: { title: string, value: string, change: string, trend: 'up' | 'down', icon: React.ReactNode }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-indigo-600/20 transition-colors">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const TransactionItem = ({ name, date, amount }: { name: string, date: string, amount: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
      </div>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-slate-500">{date}</p>
      </div>
    </div>
    <p className={`text-sm font-semibold ${amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-300'}`}>
      {amount}
    </p>
  </div>
);

export default DashboardPage;
