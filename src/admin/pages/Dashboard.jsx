import { useEffect, useState } from 'react';
import {
  getCustomers,
  getOrders,
  getProducts,
} from '../services/adminApi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [products, orders, customers] = await Promise.all([
          getProducts(),
          getOrders(),
          getCustomers(),
        ]);

        const revenue = orders
          .filter((order) => order.status !== 'cancelled')
          .reduce(
            (sum, order) => sum + Number(order.totalPrice || 0),
            0
          );

        setStats({
          products: products.length,
          orders: orders.length,
          customers: customers.length,
          revenue,
        });
      } catch {
        setError(
          'Could not load dashboard data. Check that JSON Server is running.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const cards = [
    ['Products', stats.products],
    ['Orders', stats.orders],
    ['Customers', stats.customers],
    ['Sales total', `₹${stats.revenue.toFixed(2)}`],
  ];

  return (
    <section className="text-[#173b32]">
      <h1 className="text-2xl font-extrabold">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">Store overview</p>

      {loading && <p className="mt-6 text-gray-600">Loading…</p>}

      {error && (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value]) => (
            <article
              key={label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="mt-3 text-3xl font-extrabold text-[#173b32]">
                {value}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Dashboard;