export interface Order {
  id: string;
  date: string;
  customer: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: string;
}

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', date: '2024-01-15', customer: 'Jane Doe', status: 'Delivered', total: '$125.00' },
  { id: 'ORD-002', date: '2024-01-16', customer: 'John Smith', status: 'Shipped', total: '$89.99' },
  { id: 'ORD-003', date: '2024-01-17', customer: 'Alice Johnson', status: 'Processing', total: '$210.50' },
  { id: 'ORD-004', date: '2024-01-18', customer: 'Bob Brown', status: 'Pending', total: '$45.00' },
  { id: 'ORD-005', date: '2024-01-19', customer: 'Carol White', status: 'Cancelled', total: '$175.25' },
];