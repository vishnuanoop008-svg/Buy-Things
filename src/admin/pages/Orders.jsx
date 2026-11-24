import { useEffect, useState } from 'react';

import AdminTable from '../components/AdminTable';
import { getOrders, updateOrder } from '../services/adminApi';

const statuses = [
  'placed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const statusStyles = {
  placed: 'border-sky-200 bg-sky-50 text-sky-800',
  processing: 'border-amber-200 bg-amber-50 text-amber-800',
  shipped: 'border-violet-200 bg-violet-50 text-violet-800',
  delivered: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  cancelled: 'border-red-200 bg-red-50 text-red-700',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setOrders(await getOrders());
        setError('');
      } catch {
        setError('Could not load orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const changeStatus = async (order, status) => {
    setUpdatingId(order.id);
    setError('');

    try {
      const updatedOrder = await updateOrder(order.id, { status });

      setOrders((current) =>
        current.map((item) =>
          String(item.id) === String(order.id)
            ? { ...item, ...updatedOrder }
            : item
        )
      );
    } catch {
      setError('Could not update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      key: 'order',
      label: 'Order',
      render: (row) => row.orderNumber || row.id,
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => row.userId || '—',
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : '—',
    },
    {
      key: 'totalPrice',
      label: 'Total',
      render: (row) =>
        `₹${Number(row.totalPrice || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const status = statuses.includes(row.status)
          ? row.status
          : 'placed';

        return (
          <select
            value={status}
            onChange={(event) => changeStatus(row, event.target.value)}
            disabled={updatingId === row.id}
            aria-label={`Update status for order ${
              row.orderNumber || row.id
            }`}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold capitalize outline-none transition focus:ring-2 focus:ring-emerald-700/20 disabled:cursor-wait disabled:opacity-60 ${
              statusStyles[status]
            }`}
          >
            {statuses.map((option) => (
              <option
                key={option}
                value={option}
                className="bg-white text-gray-800"
              >
                {option}
              </option>
            ))}
          </select>
        );
      },
    },
  ];

  return (
    <section className="text-[#173b32]">
      <h1 className="text-2xl font-extrabold">Orders</h1>
      <p className="mt-1 text-sm text-gray-600">
        View and update customer orders.
      </p>

      {loading && (
        <p className="mt-6 text-gray-600">Loading orders…</p>
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
            rows={orders}
            emptyMessage="No orders yet."
          />
        </div>
      )}
    </section>
  );
};

export default Orders;