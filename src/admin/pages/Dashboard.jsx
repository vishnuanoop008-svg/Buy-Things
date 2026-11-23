import { useEffect, useState } from 'react';
import { getCustomers, getOrders, getProducts } from '../services/adminApi';

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
          .filter(order => order.status !== 'cancelled')
          .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

        setStats({
          products: products.length,
          orders: orders.length,
          customers: customers.length,
          revenue,
        });
      } catch {
        setError('Could not load dashboard data. Check that JSON Server is running.');
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
    <section>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-400">Store overview</p>

      {loading && <p className="mt-6 text-gray-400">Loading…</p>}
      {error && <p className="mt-6 text-red-300">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value]) => (
            <article
              key={label}
              className="rounded-xl border border-white/10 bg-[#111114] p-5"
            >
              <p className="text-sm text-gray-400">{label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{value}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Dashboard;