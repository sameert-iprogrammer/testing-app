import React from 'react';

interface StatusBadgeProps {
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

const statusStyles: Record<StatusBadgeProps['status'], string> = {
  Pending: 'bg-yellow-400/10 text-yellow-400',
  Processing: 'bg-blue-400/10 text-blue-400',
  Shipped: 'bg-indigo-400/10 text-indigo-400',
  Delivered: 'bg-emerald-400/10 text-emerald-400',
  Cancelled: 'bg-rose-400/10 text-rose-400',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
    {status}
  </span>
);

export default StatusBadge;