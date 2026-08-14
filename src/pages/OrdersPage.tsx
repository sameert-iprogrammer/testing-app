import React from 'react';

interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: string;
}

const mockOrders: Order[] = [
  { id: 'ORD-001', customerName: 'Alice Johnson', orderDate: 'Oct 24, 2023', status: 'Delivered', totalAmount: '$1,234.56' },
  { id: 'ORD-002', customerName: 'Bob Smith', orderDate: 'Oct 25, 2023', status: 'Shipped', totalAmount: '$856.00' },
  { id: 'ORD-003', customerName: 'Carol Williams', orderDate: 'Oct 26, 2023', status: 'Processing', totalAmount: '$2,100.75' },
  { id: 'ORD-004', customerName: 'David Brown', orderDate: 'Oct 27, 2023', status: 'Pending', totalAmount: '$432.90' },
  { id: 'ORD-005', customerName: 'Eva Martinez', orderDate: 'Oct 28, 2023', status: 'Cancelled', totalAmount: '$678.25' },
  { id: 'ORD-006', customerName: 'Frank Lee', orderDate: 'Oct 29, 2023', status: 'Delivered', totalAmount: '$3,450.00' },
  { id: 'ORD-007', customerName: 'Grace Kim', orderDate: 'Oct 30, 2023', status: 'Shipped', totalAmount: '$920.50' },
  { id: 'ORD-008', customerName: 'Henry Davis', orderDate: 'Oct 31, 2023', status: 'Pending', totalAmount: '$1,567.80' },
];

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const styles: Record<Order['status'], string> = {
    Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Processing: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Shipped: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Delivered: 'bg-green-500/10 text-green-500 border-green-500/20',
    Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
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
        <p className="text-slate-400">Manage and track customer orders.</p>
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
                <tr key={order.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-indigo-400">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-200">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{order.orderDate}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-200">{order.totalAmount}</td>
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