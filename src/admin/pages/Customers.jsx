import { useEffect, useState } from 'react';
import axios from 'axios';

import AdminTable from '../components/AdminTable';

const USERS_URL = 'http://localhost:5000/users';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadCustomers = async () => {
      try {
        const { data } = await axios.get(USERS_URL);

        if (isMounted) {
          // Admin accounts are not included in customer totals or actions.
          setCustomers(data.filter((user) => user.role !== 'admin'));
          setError('');
        }
      } catch {
        if (isMounted) setError('Could not load customers.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCustomers();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleBlock = async (customer) => {
    const isBlocked = Boolean(customer.blocked);
    setUpdatingId(customer.id);
    setError('');

    try {
      const { data: updatedCustomer } = await axios.patch(
        `${USERS_URL}/${customer.id}`,
        { blocked: !isBlocked }
      );

      setCustomers((current) =>
        current.map((item) =>
          String(item.id) === String(customer.id)
            ? { ...item, ...updatedCustomer }
            : item
        )
      );
    } catch {
      setError(
        `Could not ${isBlocked ? 'unblock' : 'block'} this customer.`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const activeCount = customers.filter(
    (customer) => !customer.blocked
  ).length;
  const blockedCount = customers.filter(
    (customer) => Boolean(customer.blocked)
  ).length;

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (customer) => customer.name || '—',
    },
    {
      key: 'email',
      label: 'Email',
      render: (customer) => customer.email || '—',
    },
    {
      key: 'role',
      label: 'Role',
      render: (customer) => customer.role || 'customer',
    },
    {
      key: 'id',
      label: 'User ID',
      render: (customer) => customer.id || '—',
    },
    {
      key: 'status',
      label: 'Account status',
      render: (customer) =>
        customer.blocked ? (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            Blocked
          </span>
        ) : (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            Active
          </span>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (customer) => {
        const isBlocked = Boolean(customer.blocked);
        const isUpdating = String(updatingId) === String(customer.id);

        return (
          <button
            type="button"
            onClick={() => toggleBlock(customer)}
            disabled={isUpdating}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-wait disabled:opacity-60 ${
              isBlocked
                ? 'bg-emerald-800 text-white hover:bg-emerald-700'
                : 'bg-red-600 text-white hover:bg-red-500'
            }`}
          >
            {isUpdating
              ? 'Saving…'
              : isBlocked
                ? 'Unblock'
                : 'Block'}
          </button>
        );
      },
    },
  ];

  return (
    <section className="text-[#173b32]">
      <h1 className="text-2xl font-extrabold">Customers</h1>
      <p className="mt-1 text-sm text-gray-600">
        Manage customer accounts and access.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ['Total customers', customers.length],
          ['Active customers', activeCount],
          ['Blocked customers', blockedCount],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-3 text-3xl font-extrabold">{value}</p>
          </article>
        ))}
      </div>

      {error && (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-gray-600">Loading customers…</p>
      ) : (
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