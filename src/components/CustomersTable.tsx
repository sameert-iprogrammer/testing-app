import React from 'react';

export type CustomerStatus = 'Active' | 'Invited' | 'Churned';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: CustomerStatus;
  joined: string;
}

interface CustomersTableProps {
  customers: Customer[];
}

const CustomerStatusBadge: React.FC<{ status: CustomerStatus }> = ({ status }) => {
  const styles: Record<CustomerStatus, string> = {
    Active: 'bg-emerald-400/10 text-emerald-400',
    Invited: 'bg-amber-400/10 text-amber-400',
    Churned: 'bg-rose-400/10 text-rose-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const CustomersTable: React.FC<CustomersTableProps> = ({ customers }) => {
  return (
    <div className="overflow-x-auto max-w-full">
      <table className="w-full max-w-full text-left" aria-label="Customers">
        <thead>
          <tr className="border-b border-slate-800">
            <th scope="col" className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Company
            </th>
            <th scope="col" className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Joined
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-slate-200">{customer.name}</td>
              <td className="px-6 py-4 text-sm text-slate-200">{customer.email}</td>
              <td className="px-6 py-4 text-sm text-slate-200">{customer.company}</td>
              <td className="px-6 py-4">
                <CustomerStatusBadge status={customer.status} />
              </td>
              <td className="px-6 py-4 text-sm text-slate-200">{customer.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
