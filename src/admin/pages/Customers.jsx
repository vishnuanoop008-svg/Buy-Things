import { useEffect, useState } from 'react';
import AdminTable from '../components/AdminTable';
import { getCustomers } from '../services/adminApi';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch(() => setError('Could not load customers.'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: row => row.role || 'customer',
    },
    { key: 'id', label: 'User ID' },
  ];

  return (
    <section>
      <h1 className="text-2xl font-bold">Customers</h1>
      <p className="mt-1 text-sm text-gray-400">
        Customer records. Passwords are never displayed here.
      </p>
      {loading && <p className="mt-6 text-gray-400">Loading customers…</p>}
      {error && <p className="mt-6 text-red-300">{error}</p>}
      {!loading && !error && (
        <div className="mt-6">
          <AdminTable columns={columns} rows={customers} emptyMessage="No customers found." />
        </div>
      )}
    </section>
  );
};

export default Customers;