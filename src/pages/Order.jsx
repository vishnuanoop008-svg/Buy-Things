import { useNavigate } from 'react-router-dom';

const Order = ({ order }) => {
  const navigate = useNavigate();

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7f5] px-4 pt-28 text-[#173b32]">
        <section className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-4 text-2xl font-extrabold">
            Order details not found
          </h1>
          <p className="mb-6 text-gray-600">
            There are no order details to display.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Go home
          </button>
        </section>
      </main>
    );
  }

  const products = order.products ?? [];

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 pb-12 pt-36 text-[#173b32]">
      <section className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          Order confirmed
        </p>
        <h1 className="mb-4 text-3xl font-extrabold">
          Thank you for your order!
        </h1>
        <p className="mb-8 text-gray-600">
          Your order has been placed successfully. You will receive an email
          confirmation shortly.
        </p>

        <div className="mb-6 border-b border-gray-200 pb-6">
          <h2 className="mb-4 text-xl font-bold">Order summary</h2>
          <p className="text-gray-600">
            <span className="font-semibold text-[#173b32]">Order number: </span>
            {order.orderNumber || 'Not available'}
          </p>
        </div>

        <div className="mb-6 border-b border-gray-200 pb-6">
          <h2 className="mb-4 text-xl font-bold">Shipping information</h2>
          <div className="space-y-1 text-gray-600">
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

        <div className="mb-6 border-b border-gray-200 pb-6">
          <h2 className="mb-4 text-xl font-bold">Products ordered</h2>

          <div className="divide-y divide-gray-100">
            {products.map((product, index) => {
              const price = Number(product.price) || 0;
              const quantity = Number(product.quantity) || 0;

              return (
                <div
                  key={product.productId ?? product.id ?? index}
                  className="flex justify-between gap-4 py-3 text-sm"
                >
                  <p className="text-gray-600">
                    {product.name} × {quantity}
                  </p>
                  <p className="shrink-0 font-medium text-[#173b32]">
                    ₹{(price * quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8 flex justify-between gap-4 text-xl font-extrabold">
          <span>Total price</span>
          <span>₹{(Number(order.totalPrice) || 0).toFixed(2)}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate('/profile/orders')}
            className="flex-1 rounded-lg border border-emerald-800 px-5 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50"
          >
            Order tracking
          </button>

          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="flex-1 rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Continue shopping
          </button>
        </div>
      </section>
    </main>
  );
};

export default Order;