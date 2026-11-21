import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const ORDERS_URL = 'http://localhost:5000/orders';

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
          params: { userId: user.id }
        });

        setOrders(response.data);
        setError('');
      } catch {
        setError(
          'Could not load your orders. Check that JSON Server is running.'
        );
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
        status: 'cancelled'
      });

      setOrders((currentOrders) =>
        currentOrders.map((item) =>
          String(item.id) === String(order.id) ? response.data : item
        )
      );

      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Could not cancel the order.'
      );
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

      toast.success('Orders cleared successfully');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Could not clear your orders.'
      );
    } finally {
      setClearingOrders(false);
    }
  };

  if (!user?.id) {
    return (
      <p className="px-6 pt-36 text-center">
        Please log in to view your orders.
      </p>
    );
  }

  return (
    <main className="container mx-auto min-h-screen px-4 pb-12 pt-36 md:px-16 lg:px-24">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">My Orders</h1>

        {orders.length > 0 && (
          <button
            type="button"
            onClick={handleClearOrders}
            disabled={clearingOrders || loading}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {clearingOrders ? 'Clearing...' : 'Clear Orders'}
          </button>
        )}
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>You haven&apos;t placed any orders yet.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => {
          const isCancelled = order.status === 'cancelled';

          return (
            <section
              key={order.id}
              className="rounded border bg-white p-6 shadow"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-semibold">
                    Order #{order.orderNumber || order.id}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={
                      isCancelled
                        ? 'rounded bg-red-100 px-3 py-1 text-sm text-red-700'
                        : 'rounded bg-green-100 px-3 py-1 text-sm text-green-700'
                    }
                  >
                    {isCancelled ? 'Cancelled' : order.status || 'Placed'}
                  </span>

                  {!isCancelled && (
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order)}
                      disabled={cancellingId === order.id}
                      className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancellingId === order.id
                        ? 'Cancelling...'
                        : 'Cancel order'}
                    </button>
                  )}
                </div>
              </div>

              <h3 className="mb-2 font-semibold">Products</h3>

              {(order.products || []).map((product, index) => {
                const quantity = Number(product.quantity || 0);
                const price = Number(product.price || 0);

                return (
                  <div
                    key={product.id ?? index}
                    className="flex items-center justify-between gap-4 border-b py-3 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name || 'Ordered product'}
                          className="h-20 w-20 rounded object-contain"
                        />
                      )}

                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          ₹{price.toFixed(2)} × {quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <p className="mt-4 text-right font-bold">
                Total: ₹{Number(order.totalPrice || 0).toFixed(2)}
              </p>

              {order.shippingInformation?.address && (
                <p className="mt-3 text-sm text-gray-600">
                  Shipping to: {order.shippingInformation.address}
                  {order.shippingInformation.city
                    ? `, ${order.shippingInformation.city}`
                    : ''}
                  {order.shippingInformation.zip
                    ? ` ${order.shippingInformation.zip}`
                    : ''}
                </p>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
};

export default Orders;