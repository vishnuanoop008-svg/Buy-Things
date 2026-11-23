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
  placed: 'border-blue-500/40 bg-blue-500/15 text-blue-300',
  processing: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  shipped: 'border-purple-500/40 bg-purple-500/15 text-purple-300',
  delivered: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  cancelled: 'border-red-500/40 bg-red-500/15 text-red-300',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setError('Could not load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (order, status) => {
    try {
      const updatedOrder = await updateOrder(order.id, { status });

      setOrders(current =>
        current.map(item =>
          item.id === order.id ? updatedOrder : item
        )
      );
      setError('');
    } catch {
      setError('Could not update order status.');
    }
  };

  const columns = [
    {
      key: 'order',
      label: 'Order',
      render: row => row.orderNumber || row.id,
    },
    {
      key: 'customer',
      label: 'Customer',
      render: row => row.userId || '—',
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: row =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : '—',
    },
    {
      key: 'totalPrice',
      label: 'Total',
      render: row => `₹${Number(row.totalPrice || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: row => {
        const status = statuses.includes(row.status)
          ? row.status
          : 'placed';

        return (
          <select
            value={status}
            onChange={event => changeStatus(row, event.target.value)}
            aria-label={`Update status for order ${row.orderNumber || row.id}`}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold capitalize outline-none transition focus:ring-2 focus:ring-purple-500/40 ${
              statusStyles[status]
            }`}
          >
            {statuses.map(option => (
              <option
                key={option}
                value={option}
                className="bg-[#111114] text-white"
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
    <section>
      <h1 className="text-2xl font-bold">Orders</h1>
      <p className="mt-1 text-sm text-gray-400">
        View and update customer orders.
      </p>

      {loading && (
        <p className="mt-6 text-gray-400">Loading orders…</p>
      )}

      {error && (
        <p className="mt-6 text-red-300">{error}</p>
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