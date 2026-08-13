import React from 'react';
import { Package, User, Calendar, DollarSign } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: string;
}

const mockOrders: Order[] = [
  { id: 'ORD-7821', customerName: 'Alice Johnson', date: '2026-05-01', status: 'Delivered', totalAmount: '$249.99' },
  { id: 'ORD-7822', customerName: 'Bob Smith', date: '2026-05-02', status: 'Shipped', totalAmount: '$1,045.00' },
  { id: 'ORD-7823', customerName: 'Carol White', date: '2026-05-03', status: 'Processing', totalAmount: '$89.50' },
  { id: 'ORD-7824', customerName: 'David Brown', date: '2026-05-04', status: 'Pending', totalAmount: '$320.00' },
  { id: 'ORD-7825', customerName: 'Eva Martinez', date: '2026-05-05', status: 'Cancelled', totalAmount: '$150.75' },
  { id: 'ORD-7826', customerName: 'Frank Lee', date: '2026-05-06', status: 'Delivered', totalAmount: '$675.20' },
  { id: 'ORD-7827', customerName: 'Grace Kim', date: '2026-05-07', status: 'Shipped', totalAmount: '$432.10' },
  { id: 'ORD-7828', customerName: 'Henry Davis', date: '2026-05-08', status: 'Processing', totalAmount: '$98.00' },
];

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const styles: Record<Order['status'], string> = {
    Pending: 'bg-blue-400/10 text-blue-400',
    Processing: 'bg-yellow-400/10 text-yellow-400',
    Shipped: 'bg-indigo-400/10 text-indigo-400',
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
          <table className="w-full max-w-full text-left" aria-label="Customer orders">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-indigo-400">
                      <Package size={16} />
                      {order.id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-200">
                      <User size={16} className="text-slate-500" />
                      {order.customerName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-200">
                      <Calendar size={16} className="text-slate-500" />
                      {order.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <DollarSign size={16} className="text-slate-500" />
                      {order.totalAmount}
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