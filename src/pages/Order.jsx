import { useNavigate } from 'react-router-dom';

const Order = ({ order }) => {
  const navigate = useNavigate();

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 pt-28 text-white">
        <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111114] p-8 text-center shadow-xl">
          <h1 className="mb-4 text-2xl font-bold">Order details not found</h1>
          <p className="mb-6 text-gray-400">
            There are no order details to display.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-full bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-600"
          >
            Go Home
          </button>
        </section>
      </main>
    );
  }

  const products = order.products ?? [];

  return (
    <main className="min-h-screen bg-[#09090b] px-4 pb-12 pt-36 text-white">
      <section className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-2xl shadow-purple-950/20 sm:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
          Order confirmed
        </p>
        <h1 className="mb-4 text-3xl font-bold">
          Thank you for your order!
        </h1>
        <p className="mb-8 text-gray-400">
          Your order has been placed successfully. You will receive an email
          confirmation shortly.
        </p>

        <div className="mb-6 border-b border-white/10 pb-6">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <p className="text-gray-300">
            <span className="font-semibold text-white">Order Number: </span>
            {order.orderNumber}
          </p>
        </div>

        <div className="mb-6 border-b border-white/10 pb-6">
          <h2 className="mb-4 text-xl font-semibold">Shipping Information</h2>
          <div className="space-y-1 text-gray-300">
            {order.shippingInformation?.address && (
              <p>{order.shippingInformation.address}</p>
            )}
            {order.shippingInformation?.city && (
              <p>{order.shippingInformation.city}</p>
            )}
            {order.shippingInformation?.zip && (
              <p>{order.shippingInformation.zip}</p>
            )}
          </div>
        </div>

        <div className="mb-6 border-b border-white/10 pb-6">
          <h2 className="mb-4 text-xl font-semibold">Products Ordered</h2>

          <div className="divide-y divide-white/10">
            {products.map((product, index) => {
              const price = Number(product.price) || 0;
              const quantity = Number(product.quantity) || 0;

              return (
                <div
                  key={product.productId ?? product.id ?? index}
                  className="flex justify-between gap-4 py-3 text-sm"
                >
                  <p className="text-gray-300">
                    {product.name} × {quantity}
                  </p>
                  <p className="shrink-0 text-white">
                    ₹{(price * quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8 flex justify-between gap-4 text-xl font-bold">
          <span>Total Price</span>
          <span>
            ₹{(Number(order.totalPrice) || 0).toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="flex-1 rounded-lg border border-purple-500/40 bg-purple-500/10 px-5 py-3 font-semibold text-purple-300 transition hover:bg-purple-500/20"
          >
            Order Tracking
          </button>

          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="flex-1 rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white transition hover:bg-purple-600"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    </main>
  );
};

export default Order;