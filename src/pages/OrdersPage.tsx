import React from 'react';

interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  totalAmount: string;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  itemCount: number;
}

const mockOrders: Order[] = [
  { id: 'ORD-001', customerName: 'Acme Corp', orderDate: '2026-05-01', totalAmount: '$1,250.00', status: 'completed', itemCount: 3 },
  { id: 'ORD-002', customerName: 'Tech Solutions', orderDate: '2026-05-02', totalAmount: '$890.50', status: 'pending', itemCount: 1 },
  { id: 'ORD-003', customerName: 'Digital Agency', orderDate: '2026-05-03', totalAmount: '$2,450.00', status: 'failed', itemCount: 5 },
  { id: 'ORD-004', customerName: 'Startup Labs', orderDate: '2026-05-04', totalAmount: '$675.00', status: 'processing', itemCount: 2 },
  { id: 'ORD-005', customerName: 'Innovate Ltd', orderDate: '2026-05-05', totalAmount: '$3,100.00', status: 'completed', itemCount: 4 },
];

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const styles: Record<Order['status'], string> = {
    Completed: 'bg-emerald-500/20 text-emerald-400',
    Processing: 'bg-indigo-500/20 text-indigo-400',
    Pending: 'bg-rose-500/20 text-rose-400',
    Failed: 'bg-rose-500/20 text-rose-400',
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
        <h1 className="text-3xl font-bold tracking-tight text-white">Order Management</h1>
        <p className="text-slate-400">View and track customer orders</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full max-w-full text-left" aria-label="Orders">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-200">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{order.orderDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
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