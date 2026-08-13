interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

const mockOrders: Order[] = [
  { id: 'ORD-001', customer: 'Alice Johnson', date: '2026-05-01', total: 249.99, status: 'Delivered' },
  { id: 'ORD-002', customer: 'Bob Smith', date: '2026-05-02', total: 89.50, status: 'Shipped' },
  { id: 'ORD-003', customer: 'Carol White', date: '2026-05-03', total: 1200.00, status: 'Processing' },
  { id: 'ORD-004', customer: 'David Brown', date: '2026-05-04', total: 45.00, status: 'Pending' },
  { id: 'ORD-005', customer: 'Eva Martinez', date: '2026-05-05', total: 320.75, status: 'Delivered' },
  { id: 'ORD-006', customer: 'Frank Lee', date: '2026-05-06', total: 150.00, status: 'Cancelled' },
  { id: 'ORD-007', customer: 'Grace Kim', date: '2026-05-07', total: 890.00, status: 'Shipped' },
  { id: 'ORD-008', customer: 'Henry Wilson', date: '2026-05-08', total: 67.25, status: 'Delivered' },
  { id: 'ORD-009', customer: 'Ivy Chen', date: '2026-05-09', total: 430.50, status: 'Processing' },
  { id: 'ORD-010', customer: 'Jack Davis', date: '2026-05-10', total: 199.99, status: 'Pending' },
  { id: 'ORD-011', customer: 'Karen Taylor', date: '2026-05-11', total: 75.00, status: 'Delivered' },
  { id: 'ORD-012', customer: 'Leo Garcia', date: '2026-05-12', total: 560.00, status: 'Shipped' },
  { id: 'ORD-013', customer: 'Mia Robinson', date: '2026-05-13', total: 210.30, status: 'Cancelled' },
  { id: 'ORD-014', customer: 'Noah Clark', date: '2026-05-14', total: 340.00, status: 'Processing' },
  { id: 'ORD-015', customer: 'Olivia Hall', date: '2026-05-15', total: 98.75, status: 'Pending' },
];

export { mockOrders };