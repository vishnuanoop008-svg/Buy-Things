import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Orders = () => {
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/orders', {
          params: { userId: user.id }
        });

        setOrders(response.data);
        setError('');
      } catch (err) {
        setError('Could not load your orders. Check that JSON Server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  if (!user?.id) {
    return <p className="px-6 pt-36 text-center">Please log in to view your orders.</p>;
  }

  return (
    <main className="container mx-auto min-h-screen px-4 pb-12 pt-36 md:px-16 lg:px-24">
      <h1 className="mb-8 text-2xl font-bold">My Orders</h1>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>You haven't placed any orders yet.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <section key={order.id} className="rounded border bg-white p-6 shadow">
            <div className="mb-4 flex flex-wrap justify-between gap-2 border-b pb-4">
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

              <p className="font-bold">
                Total: ₹{Number(order.totalPrice || 0).toFixed(2)}
              </p>
            </div>

            <h3 className="mb-2 font-semibold">Products</h3>

            {(order.products || []).map((product, index) => (
              <div
                key={product.id ?? index}
                className="flex justify-between border-b py-2 last:border-0"
              >
                <span>
                  {product.name} × {product.quantity}
                </span>
                <span>
                  ₹{(
                    Number(product.price || 0) * Number(product.quantity || 0)
                  ).toFixed(2)}
                </span>
              </div>
            ))}

            {order.shippingInformation?.address && (
              <p className="mt-4 text-sm text-gray-600">
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
        ))}
      </div>
    </main>
  );
};

export default Orders;