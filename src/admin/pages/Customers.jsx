import { useEffect, useState } from 'react';

import AdminTable from '../components/AdminTable';
import { getCustomers } from '../services/adminApi';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setCustomers(await getCustomers());
        setError('');
      } catch {
        setError('Could not load customers.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (row) => row.role || 'customer',
    },
    { key: 'id', label: 'User ID' },
  ];

  return (
    <section className="text-[#173b32]">
      <h1 className="text-2xl font-extrabold">Customers</h1>
      <p className="mt-1 text-sm text-gray-600">
        Customer records. Passwords are never displayed here.
      </p>

      {loading && (
        <p className="mt-6 text-gray-600">Loading customers…</p>
      )}

      {error && (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="mt-6">
          <AdminTable
            columns={columns}
            rows={customers}
            emptyMessage="No customers found."
          />
        </div>
      )}
    </section>
  );
};

export default Customers;