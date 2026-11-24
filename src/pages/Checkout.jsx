import { useState } from 'react';
import axios from 'axios';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = ({ setOrder }) => {
  const [billingToggle, setBillingToggle] = useState(true);
  const [shippingToggle, setShippingToggle] = useState(false);
  const [paymentToggle, setPaymentToggle] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    zip: '',
  });

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const updateShippingInfo = (event) => {
    const { name, value } = event.target;
    setShippingInfo((previous) => ({ ...previous, [name]: value }));
  };

  const handleOrder = async () => {
    if (!user?.id) {
      toast.error('Please log in before placing an order.');
      return;
    }

    if (!cart.products?.length) {
      toast.error('Your cart is empty.');
      return;
    }

    if (
      !shippingInfo.address.trim() ||
      !shippingInfo.city.trim() ||
      !shippingInfo.zip.trim()
    ) {
      setShippingToggle(true);
      toast.error('Please complete your shipping information.');
      return;
    }

    const newOrder = {
      products: cart.products,
      orderNumber: `ORD-${Date.now()}`,
      shippingInformation: shippingInfo,
      paymentMethod,
      totalPrice: Number(cart.totalPrice) || 0,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/orders',
        newOrder
      );

      setOrder(response.data);
      navigate('/order-confirmation');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Could not place the order. Check that JSON Server is running.'
      );
    }
  };

  const inputClass =
    'mt-2 w-full rounded-lg border border-gray-300 bg-[#f5f8f6] px-3 py-2.5 text-[#173b32] outline-none transition placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15';

  const sectionClass =
    'mb-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm';

  const sectionHeadingClass =
    'flex w-full items-center justify-between text-left text-lg font-bold text-[#173b32]';

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 pb-12 pt-36 text-[#173b32] md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          Almost there
        </p>
        <h1 className="mb-8 text-3xl font-extrabold">Checkout</h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          <section className="min-w-0 flex-1">
            {/* Billing information */}
            <div className={sectionClass}>
              <button
                type="button"
                onClick={() => setBillingToggle((open) => !open)}
                aria-expanded={billingToggle}
                className={sectionHeadingClass}
              >
                <span>Billing information</span>
                {billingToggle ? <FaAngleUp /> : <FaAngleDown />}
              </button>

              {billingToggle && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-gray-700">
                    Name
                    <input
                      type="text"
                      name="name"
                      defaultValue={user?.name || ''}
                      placeholder="Enter your name"
                      autoComplete="name"
                      className={inputClass}
                    />
                  </label>

                  <label className="text-sm font-medium text-gray-700">
                    Email
                    <input
                      type="email"
                      name="email"
                      defaultValue={user?.email || ''}
                      placeholder="Enter your email"
                      autoComplete="email"
                      className={inputClass}
                    />
                  </label>

                  <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                    Phone
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Shipping information */}
            <div className={sectionClass}>
              <button
                type="button"
                onClick={() => setShippingToggle((open) => !open)}
                aria-expanded={shippingToggle}
                className={sectionHeadingClass}
              >
                <span>Shipping information</span>
                {shippingToggle ? <FaAngleUp /> : <FaAngleDown />}
              </button>

              {shippingToggle && (
                <div className="mt-5 space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter your address"
                      autoComplete="street-address"
                      className={inputClass}
                      value={shippingInfo.address}
                      onChange={updateShippingInfo}
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-gray-700">
                      City
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter your city"
                        autoComplete="address-level2"
                        className={inputClass}
                        value={shippingInfo.city}
                        onChange={updateShippingInfo}
                      />
                    </label>

                    <label className="text-sm font-medium text-gray-700">
                      ZIP code
                      <input
                        type="text"
                        name="zip"
                        placeholder="Enter ZIP code"
                        autoComplete="postal-code"
                        className={inputClass}
                        value={shippingInfo.zip}
                        onChange={updateShippingInfo}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Payment methods */}
            <div className={sectionClass}>
              <button
                type="button"
                onClick={() => setPaymentToggle((open) => !open)}
                aria-expanded={paymentToggle}
                className={sectionHeadingClass}
              >
                <span>Payment method</span>
                {paymentToggle ? <FaAngleUp /> : <FaAngleDown />}
              </button>

              {paymentToggle && (
                <div className="mt-5 space-y-4">
                  <label className="flex items-center gap-3 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-4 w-4 accent-emerald-800"
                    />
                    Cash on delivery
                  </label>

                  <label className="flex items-center gap-3 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'dc'}
                      onChange={() => setPaymentMethod('dc')}
                      className="h-4 w-4 accent-emerald-800"
                    />
                    Debit card
                  </label>

                  {paymentMethod === 'dc' && (
                    <div className="rounded-lg border border-gray-200 bg-[#f8faf8] p-4">
                      <h3 className="mb-4 font-semibold text-[#173b32]">
                        Debit card information
                      </h3>

                      <label className="mb-4 block text-sm font-medium text-gray-700">
                        Card number
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter card number"
                          autoComplete="cc-number"
                          className={inputClass}
                        />
                      </label>

                      <label className="mb-4 block text-sm font-medium text-gray-700">
                        Cardholder name
                        <input
                          type="text"
                          placeholder="Enter cardholder name"
                          autoComplete="cc-name"
                          className={inputClass}
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-4">
                        <label className="text-sm font-medium text-gray-700">
                          Expiry date
                          <input
                            type="text"
                            placeholder="MM/YY"
                            autoComplete="cc-exp"
                            className={inputClass}
                          />
                        </label>

                        <label className="text-sm font-medium text-gray-700">
                          CVV
                          <input
                            type="password"
                            inputMode="numeric"
                            placeholder="CVV"
                            autoComplete="cc-csc"
                            className={inputClass}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Order summary */}
          <aside className="h-fit w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:w-96">
            <h2 className="mb-5 text-xl font-extrabold">Order summary</h2>

            <div className="max-h-72 space-y-4 overflow-y-auto">
              {cart.products?.map((product) => (
                <div
                  key={product.productId ?? product.id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 rounded-lg bg-[#f3f5f3] object-contain p-1"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      ₹{product.price} × {product.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t border-gray-200 pt-4 font-bold">
              <span>Total price</span>
              <span>₹{Number(cart.totalPrice || 0).toFixed(2)}</span>
            </div>

            <button
              type="button"
              onClick={handleOrder}
              className="mt-6 w-full rounded-lg bg-emerald-800 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Place order
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;