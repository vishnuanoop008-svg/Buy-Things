import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const ORDERS_URL = 'http://localhost:5000/orders';

const statusStyles = {
  placed: 'bg-sky-100 text-sky-800',
  processing: 'bg-amber-100 text-amber-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-700',
};

const Orders = () => {
  const user = useSelector((state) => state.auth.user);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [clearingOrders, setClearingOrders] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get(ORDERS_URL, {
          params: { userId: user.id },
        });

        setOrders(response.data);
        setError('');
      } catch {
        setError('Could not load your orders. Check that JSON Server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const handleCancelOrder = async (order) => {
    if (String(order.userId) !== String(user?.id)) {
      toast.error('You cannot cancel this order.');
      return;
    }

    setCancellingId(order.id);

    try {
      const response = await axios.patch(`${ORDERS_URL}/${order.id}`, {
        status: 'cancelled',
      });

      setOrders((currentOrders) =>
        currentOrders.map((item) =>
          String(item.id) === String(order.id) ? response.data : item
        )
      );

      toast.success('Order cancelled successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel the order.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleClearOrders = async () => {
    if (!user?.id || orders.length === 0) return;

    setClearingOrders(true);

    try {
      const userOrders = orders.filter(
        (order) => String(order.userId) === String(user.id)
      );

      await Promise.all(
        userOrders.map((order) =>
          axios.delete(`${ORDERS_URL}/${order.id}`)
        )
      );

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) => String(order.userId) !== String(user.id)
        )
      );

      toast.success('Orders cleared successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not clear your orders.');
    } finally {
      setClearingOrders(false);
    }
  };

  if (!user?.id) {
    return (
      <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600">
        Please log in to view your orders.
      </p>
    );
  }

  return (
    <section className="text-[#173b32]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Purchase history
          </p>
          <h2 className="text-2xl font-extrabold">My orders</h2>
        </div>

        {orders.length > 0 && (
          <button
            type="button"
            onClick={handleClearOrders}
            disabled={clearingOrders || loading}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {clearingOrders ? 'Clearing…' : 'Clear orders'}
          </button>
        )}
      </div>

      {loading && (
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">
          Loading orders…
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <h3 className="text-xl font-bold">No orders yet</h3>
          <p className="mt-2 text-gray-600">
            Orders you place will appear here.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Explore products
          </Link>
        </div>
      )}

      <div className="space-y-5">
        {!loading &&
          !error &&
          orders.map((order) => {
            const status = (order.status || 'placed').toLowerCase();
            const statusClass =
              statusStyles[status] || 'bg-gray-100 text-gray-700';

            return (
              <article
                key={order.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-bold">
                      Order #{order.orderNumber || order.id}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClass}`}
                    >
                      {status}
                    </span>

                    {status !== 'cancelled' &&
                      status !== 'delivered' && (
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order)}
                          disabled={cancellingId === order.id}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {cancellingId === order.id
                            ? 'Cancelling…'
                            : 'Cancel order'}
                        </button>
                      )}
                  </div>
                </div>

                <h4 className="mb-3 text-sm font-bold text-gray-700">
                  Products
                </h4>

                <div className="divide-y divide-gray-100">
                  {(order.products || []).map((product, index) => {
                    const quantity = Number(product.quantity) || 0;
                    const price = Number(product.price) || 0;

                    return (
                      <div
                        key={product.productId ?? product.id ?? index}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name || 'Ordered product'}
                              className="h-14 w-14 shrink-0 rounded-lg bg-[#f3f5f3] object-contain p-1"
                            />
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              ₹{price.toFixed(2)} × {quantity}
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 text-sm font-medium text-gray-700">
                          ₹{(price * quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {order.shippingInformation?.address && (
                  <p className="mt-4 text-sm text-gray-500">
                    Shipping to: {order.shippingInformation.address}
                    {order.shippingInformation.city
                      ? `, ${order.shippingInformation.city}`
                      : ''}
                    {order.shippingInformation.zip
                      ? ` ${order.shippingInformation.zip}`
                      : ''}
                  </p>
                )}

                <p className="mt-4 border-t border-gray-100 pt-4 text-right font-bold">
                  Total: ₹{Number(order.totalPrice || 0).toFixed(2)}
                </p>
              </article>
            );
          })}
      </div>
    </section>
  );
};

export default Orders;