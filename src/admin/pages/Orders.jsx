import { useEffect, useState } from 'react';
import AdminTable from '../components/AdminTable';
import { getOrders, updateOrder } from '../services/adminApi';

const statuses = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

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
      const updated = await updateOrder(order.id, { status });
      setOrders(current =>
        current.map(item => (item.id === order.id ? updated : item))
      );
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
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—',
    },
    {
      key: 'totalPrice',
      label: 'Total',
      render: row => `₹${Number(row.totalPrice || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: row => (
        <select
          value={row.status || 'placed'}
          onChange={event => changeStatus(row, event.target.value)}
          className="rounded border border-white/10 bg-[#09090b] px-2 py-1 text-white"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <section>
      <h1 className="text-2xl font-bold">Orders</h1>
      <p className="mt-1 text-sm text-gray-400">View and update customer orders.</p>
      {loading && <p className="mt-6 text-gray-400">Loading orders…</p>}
      {error && <p className="mt-6 text-red-300">{error}</p>}
      {!loading && !error && (
        <div className="mt-6">
          <AdminTable columns={columns} rows={orders} emptyMessage="No orders yet." />
        </div>
      )}
    </section>
  );
};

export default Orders;