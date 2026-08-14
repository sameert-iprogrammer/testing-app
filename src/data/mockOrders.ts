interface MockOrder {
  id: string;
  customer: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  amount: string;
}

const mockOrders: MockOrder[] = [
  { id: 'ORD-001', customer: 'Alice Johnson', date: '2026-05-01', status: 'Delivered', amount: '$1,234.56' },
  { id: 'ORD-002', customer: 'Bob Smith', date: '2026-05-03', status: 'Processing', amount: '$567.89' },
  { id: 'ORD-003', customer: 'Charlie Brown', date: '2026-05-05', status: 'Pending', amount: '$89.00' },
  { id: 'ORD-004', customer: 'Diana Prince', date: '2026-05-07', status: 'Shipped', amount: '$2,345.67' },
  { id: 'ORD-005', customer: 'Edward Norton', date: '2026-05-09', status: 'Cancelled', amount: '$432.10' },
  { id: 'ORD-006', customer: 'Fiona Apple', date: '2026-05-11', status: 'Delivered', amount: '$678.90' },
  { id: 'ORD-007', customer: 'George Lucas', date: '2026-05-13', status: 'Processing', amount: '$1,567.23' },
  { id: 'ORD-008', customer: 'Hannah Montana', date: '2026-05-15', status: 'Pending', amount: '$345.67' },
];

export type { MockOrder };
export { mockOrders };