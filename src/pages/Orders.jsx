import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const ORDERS_URL = 'http://localhost:5000/orders';

const Orders = () => {
  const user = useSelector(state => state.auth.user);

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

  const handleCancelOrder = async order => {
    if (String(order.userId) !== String(user?.id)) {
      toast.error('You cannot cancel this order.');
      return;
    }

    setCancellingId(order.id);

    try {
      const response = await axios.patch(`${ORDERS_URL}/${order.id}`, {
        status: 'cancelled',
      });

      setOrders(currentOrders =>
        currentOrders.map(item =>
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
        order => String(order.userId) === String(user.id)
      );

      await Promise.all(
        userOrders.map(order => axios.delete(`${ORDERS_URL}/${order.id}`))
      );

      setOrders(currentOrders =>
        currentOrders.filter(
          order => String(order.userId) !== String(user.id)
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
      <p className="rounded-xl border border-white/10 bg-[#111114] p-6 text-center text-gray-300">
        Please log in to view your orders.
      </p>
    );
  }

  return (
    <section className="text-white">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
            Purchase history
          </p>
          <h2 className="text-2xl font-bold">My Orders</h2>
        </div>

        {orders.length > 0 && (
          <button
            type="button"
            onClick={handleClearOrders}
            disabled={clearingOrders || loading}
            className="rounded-full border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {clearingOrders ? 'Clearing...' : 'Clear Orders'}
          </button>
        )}
      </div>

      {loading && (
        <p className="rounded-xl border border-white/10 bg-[#111114] p-6 text-gray-300">
          Loading orders...
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-950/30 p-6 text-red-300">
          {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-[#111114] px-6 py-12 text-center">
          <h3 className="text-xl font-semibold">No orders yet</h3>
          <p className="mt-2 text-gray-400">
            Orders you place will appear here.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-full bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-600"
          >
            Explore products
          </Link>
        </div>
      )}

      <div className="space-y-5">
        {!loading &&
          !error &&
          orders.map(order => {
            const isCancelled = order.status === 'cancelled';

            return (
              <article
                key={order.id}
                className="rounded-xl border border-white/10 bg-[#111114]/95 p-5 shadow-lg sm:p-6"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-semibold">
                      Order #{order.orderNumber || order.id}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isCancelled
                          ? 'bg-red-500/10 text-red-300'
                          : 'bg-emerald-500/10 text-emerald-300'
                      }`}
                    >
                      {isCancelled ? 'Cancelled' : order.status || 'Placed'}
                    </span>

                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order)}
                        disabled={cancellingId === order.id}
                        className="rounded-full border border-red-500/30 px-3 py-1.5 text-sm text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {cancellingId === order.id
                          ? 'Cancelling...'
                          : 'Cancel order'}
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="mb-3 text-sm font-semibold text-gray-200">
                  Products
                </h4>

                <div className="divide-y divide-white/10">
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
                              className="h-14 w-14 shrink-0 rounded-lg bg-white object-contain p-1"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              ₹{price.toFixed(2)} × {quantity}
                            </p>
                          </div>
                        </div>
                        <p className="shrink-0 text-sm text-gray-200">
                          ₹{(price * quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {order.shippingInformation?.address && (
                  <p className="mt-4 text-sm text-gray-400">
                    Shipping to: {order.shippingInformation.address}
                    {order.shippingInformation.city
                      ? `, ${order.shippingInformation.city}`
                      : ''}
                    {order.shippingInformation.zip
                      ? ` ${order.shippingInformation.zip}`
                      : ''}
                  </p>
                )}

                <p className="mt-4 border-t border-white/10 pt-4 text-right font-bold">
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