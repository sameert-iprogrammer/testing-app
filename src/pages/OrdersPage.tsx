import React from 'react';
import { Eye, Edit3 } from 'lucide-react';

interface MockOrder {
  id: string;
  customer: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
}

const MOCK_ORDERS: MockOrder[] = [
  { id: 'ORD-001', customer: 'Alice Johnson', date: '2026-05-01', status: 'Delivered', total: 1250.00 },
  { id: 'ORD-002', customer: 'Bob Smith', date: '2026-05-03', status: 'Shipped', total: 432.50 },
  { id: 'ORD-003', customer: 'Charlie Brown', date: '2026-05-05', status: 'Pending', total: 89.99 },
  { id: 'ORD-004', customer: 'Diana Prince', date: '2026-05-07', status: 'Cancelled', total: 2100.00 },
  { id: 'ORD-005', customer: 'Eve Martinez', date: '2026-05-09', status: 'Delivered', total: 675.25 },
];

const StatusBadge: React.FC<{ status: MockOrder['status'] }> = ({ status }) => {
  const styles: Record<MockOrder['status'], string> = {
    Pending: 'bg-amber-400/10 text-amber-400',
    Shipped: 'bg-blue-400/10 text-blue-400',
    Delivered: 'bg-emerald-400/10 text-emerald-400',
    Cancelled: 'bg-rose-400/10 text-rose-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const OrdersPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Orders</h1>
        <p className="text-slate-400">View and manage customer orders</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full max-w-full text-left" aria-label="Orders">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-indigo-400">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{order.date}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-200 text-right">
                    ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors" aria-label={`View order ${order.id}`}>
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors" aria-label={`Edit order ${order.id}`}>
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </td>
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