import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  getCustomers,
  getOrders,
  getProducts,
} from '../services/adminApi';

const ORDER_STATUSES = [
  'placed',
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const STATUS_COLORS = {
  placed: '#3b82f6',
  pending: '#f59e0b',
  processing: '#f97316',
  shipped: '#8b5cf6',
  delivered: '#16a34a',
  cancelled: '#ef4444',
};

const normalizeStatus = (status) => {
  const value = String(status || 'placed').toLowerCase();

  if (value === 'canceled') return 'cancelled';
  return ORDER_STATUSES.includes(value) ? value : 'placed';
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Dashboard = () => {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [timeframe, setTimeframe] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);

      try {
        const [productData, orderData, customerData] = await Promise.all([
          getProducts(),
          getOrders(),
          getCustomers(),
        ]);

        if (!isMounted) return;

        setProducts(productData);
        setOrders(orderData);
        setCustomers(customerData);
        setError('');
      } catch {
        if (isMounted) {
          setError(
            'Could not load dashboard data. Check that JSON Server is running.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [location.key]);

  const revenue = useMemo(
    () =>
      orders
        .filter((order) => normalizeStatus(order.status) !== 'cancelled')
        .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
    [orders]
  );

  const statusCounts = useMemo(() => {
    const counts = Object.fromEntries(
      ORDER_STATUSES.map((status) => [status, 0])
    );

    orders.forEach((order) => {
      counts[normalizeStatus(order.status)] += 1;
    });

    return counts;
  }, [orders]);

  const chartBuckets = useMemo(() => {
    const now = new Date();

    if (timeframe === 'day') {
      const buckets = Array.from({ length: 24 }, (_, hour) => ({
        key: hour,
        label:
          hour === 0
            ? '12 AM'
            : hour < 12
              ? `${hour} AM`
              : hour === 12
                ? '12 PM'
                : `${hour - 12} PM`,
        count: 0,
      }));

      orders.forEach((order) => {
        if (!order.createdAt) return;

        const date = new Date(order.createdAt);
        if (date.toDateString() === now.toDateString()) {
          buckets[date.getHours()].count += 1;
        }
      });

      return buckets;
    }

    const buckets = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - 6 + index);

      return {
        key: date.toDateString(),
        label: date.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
        }),
        count: 0,
      };
    });

    const bucketIndexes = new Map(
      buckets.map((bucket, index) => [bucket.key, index])
    );

    orders.forEach((order) => {
      if (!order.createdAt) return;

      const date = new Date(order.createdAt);
      date.setHours(0, 0, 0, 0);

      const index = bucketIndexes.get(date.toDateString());
      if (index !== undefined) buckets[index].count += 1;
    });

    return buckets;
  }, [orders, timeframe]);

  const maxBucketCount = Math.max(
    ...chartBuckets.map((bucket) => bucket.count),
    1
  );

  const statusTotal = ORDER_STATUSES.reduce(
    (sum, status) => sum + statusCounts[status],
    0
  );

  let gradientStart = 0;
  const statusGradient = ORDER_STATUSES.map((status) => {
    const percentage = statusTotal
      ? (statusCounts[status] / statusTotal) * 100
      : 0;
    const start = gradientStart;
    gradientStart += percentage;

    return `${STATUS_COLORS[status]} ${start}% ${gradientStart}%`;
  }).join(', ');

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  const statCards = [
    { label: 'Products', value: products.length },
    { label: 'Orders', value: orders.length },
    { label: 'Customers', value: customers.length },
    { label: 'Sales total', value: formatCurrency(revenue) },
  ];

  const getCustomerLabel = (order) => {
    const customer = customers.find(
      (item) => String(item.id) === String(order.userId)
    );

    return customer?.name || customer?.email || order.userId || '—';
  };

  return (
    <section className="space-y-6 text-[#173b32]">
      <style>{`
        @keyframes donut-flow {
          from {
            transform: rotate(-360deg) scale(0.9);
            opacity: 0.6;
          }
          to {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
        }

        .donut-flow {
          animation: donut-flow 900ms ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .donut-flow {
            animation: none;
          }
        }
      `}</style>

      <div>
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Store overview and recent order activity.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">
          Loading dashboard…
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <article
                key={card.label}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>
                <p className="mt-3 text-2xl font-extrabold text-[#173b32] sm:text-3xl">
                  {card.value}
                </p>
              </article>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold">Orders overview</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {timeframe === 'week'
                      ? 'Orders over the last 7 days'
                      : 'Orders by hour today'}
                  </p>
                </div>

                <div className="flex rounded-lg bg-gray-100 p-1">
                  {['week', 'day'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTimeframe(option)}
                      aria-pressed={timeframe === option}
                      className={`rounded-md px-3 py-1.5 text-sm font-semibold capitalize transition ${
                        timeframe === option
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : 'text-gray-600 hover:text-emerald-800'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="relative mt-6 h-64"
                role="img"
                aria-label={`Orders chart, ${
                  timeframe === 'week' ? 'last seven days' : 'today'
                }`}
              >
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                  {[8, 6, 4, 2, 0].map((tick) => (
                    <div
                      key={tick}
                      className="flex items-center gap-3 text-xs text-gray-400"
                    >
                      <span className="w-4 text-right">{tick}</span>
                      <div className="h-px flex-1 border-t border-dashed border-gray-200" />
                    </div>
                  ))}
                </div>

                <div className="absolute inset-y-0 left-8 right-0 flex items-end justify-around gap-1 sm:gap-3">
                  {chartBuckets.map((bucket) => {
                    const barHeight =
                      bucket.count === 0
                        ? 0
                        : Math.max((bucket.count / maxBucketCount) * 88, 5);

                    return (
                      <div
                        key={bucket.key}
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                        title={`${bucket.label}: ${bucket.count} orders`}
                      >
                        <span className="mb-1 text-xs font-medium text-gray-600">
                          {bucket.count || ''}
                        </span>
                        <div
                          className="w-full max-w-10 rounded-t-md bg-emerald-800 transition-all duration-300"
                          style={{ height: `${barHeight}%` }}
                        />
                        <span className="mt-2 w-full truncate text-center text-[10px] text-gray-500 sm:text-xs">
                          {bucket.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-extrabold">Order status</h2>
              <p className="mt-1 text-sm text-gray-500">
                Breakdown of orders by status.
              </p>

              <div className="flex flex-col items-center justify-center gap-6 py-6 sm:flex-row sm:gap-8">
                <div
                  className="relative h-48 w-48 shrink-0"
                  role="img"
                  aria-label={`Order status chart for ${statusTotal} orders`}
                >
                  <div
                    key={location.key}
                    className="donut-flow absolute inset-0 rounded-full"
                    style={{
                      background:
                        statusTotal > 0
                          ? `conic-gradient(${statusGradient})`
                          : '#e5e7eb',
                    }}
                  />

                  <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-3xl font-extrabold">
                      {statusTotal}
                    </span>
                    <span className="text-xs text-gray-500">Orders</span>
                  </div>
                </div>

                <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-1">
                  {ORDER_STATUSES.map((status) => (
                    <li
                      key={status}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="flex items-center gap-2 capitalize text-gray-600">
                        <span
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: STATUS_COLORS[status] }}
                        />
                        {status}
                      </span>
                      <span className="font-semibold text-[#173b32]">
                        {statusCounts[status]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>

          <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-extrabold">Recent orders</h2>
                <p className="mt-1 text-sm text-gray-500">
                  A quick look at your latest customer orders.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                Latest 5 orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#f8faf8] text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Order</th>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Items</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => {
                      const status = normalizeStatus(order.status);
                      const itemCount = (order.products || []).reduce(
                        (sum, product) =>
                          sum + (Number(product.quantity) || 1),
                        0
                      );

                      return (
                        <tr
                          key={order.id}
                          className="text-[#173b32] hover:bg-[#f8faf8]"
                        >
                          <td className="px-5 py-4 font-semibold">
                            {order.orderNumber || order.id}
                          </td>
                          <td className="px-5 py-4">
                            {getCustomerLabel(order)}
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString(
                                  'en-IN'
                                )
                              : '—'}
                          </td>
                          <td className="px-5 py-4">{itemCount}</td>
                          <td className="px-5 py-4 font-semibold">
                            {formatCurrency(order.totalPrice)}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className="inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize"
                              style={{
                                color: STATUS_COLORS[status],
                                backgroundColor: `${STATUS_COLORS[status]}18`,
                              }}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-gray-500"
                      >
                        No orders have been placed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </>
      )}
    </section>
  );
};

export default Dashboard;