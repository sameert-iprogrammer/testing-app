import React from 'react';
import { StatusBadge } from './ReportsPage';

interface Order {
  id: string;
  customer: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  amount: string;
}

const mockOrders: Order[] = [
  { id: 'ORD-001', customer: 'Alice Johnson', date: '2026-05-01', status: 'Delivered', amount: '$1,234.56' },
  { id: 'ORD-002', customer: 'Bob Smith', date: '2026-05-02', status: 'Shipped', amount: '$856.00' },
  { id: 'ORD-003', customer: 'Carol Williams', date: '2026-05-03', status: 'Pending', amount: '$2,100.75' },
  { id: 'ORD-004', customer: 'David Brown', date: '2026-05-04', status: 'Delivered', amount: '$432.99' },
  { id: 'ORD-005', customer: 'Eva Martinez', date: '2026-05-05', status: 'Shipped', amount: '$678.50' },
  { id: 'ORD-006', customer: 'Frank Lee', date: '2026-05-06', status: 'Pending', amount: '$1,543.20' },
];

const OrdersPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Orders</h1>
        <p className="text-slate-400">Manage and track customer orders.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full max-w-full text-left" aria-label="Customer orders">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-indigo-400">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{order.date}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-200">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;