import { useState } from 'react';
import axios from 'axios';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import RetailStage from '../assets/images/retail-stage.png';

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

  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  const updateShippingInfo = event => {
    const { name, value } = event.target;
    setShippingInfo(previous => ({ ...previous, [name]: value }));
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

    const newOrder = {
      products: cart.products,
      orderNumber: `ORD-${Date.now()}`,
      shippingInformation: shippingInfo,
      paymentMethod,
      totalPrice: cart.totalPrice,
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
    'w-full rounded-lg border border-white/10 bg-[#09090b]/80 px-3 py-2.5 text-white placeholder:text-gray-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20';

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#09090b] px-4 pb-12 pt-32 text-white md:px-10 lg:px-16">
      <img
        src={RetailStage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-black/65"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
          Almost there
        </p>
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          <section className="min-w-0 flex-1">
            {/* Billing Information */}
            <div className="mb-5 rounded-xl border border-white/10 bg-[#111114]/90 p-5 shadow-xl backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setBillingToggle(open => !open)}
                aria-expanded={billingToggle}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-lg font-semibold">
                  Billing Information
                </span>
                {billingToggle ? <FaAngleUp /> : <FaAngleDown />}
              </button>

              {billingToggle && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-gray-300">
                    Name
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className={`${inputClass} mt-2`}
                    />
                  </label>

                  <label className="text-sm text-gray-300">
                    Email
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className={`${inputClass} mt-2`}
                    />
                  </label>

                  <label className="text-sm text-gray-300 sm:col-span-2">
                    Phone
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className={`${inputClass} mt-2`}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Shipping Information */}
            <div className="mb-5 rounded-xl border border-white/10 bg-[#111114]/90 p-5 shadow-xl backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setShippingToggle(open => !open)}
                aria-expanded={shippingToggle}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-lg font-semibold">
                  Shipping Information
                </span>
                {shippingToggle ? <FaAngleUp /> : <FaAngleDown />}
              </button>

              {shippingToggle && (
                <div className="mt-5 space-y-4">
                  <label className="block text-sm text-gray-300">
                    Address
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter your address"
                      className={`${inputClass} mt-2`}
                      value={shippingInfo.address}
                      onChange={updateShippingInfo}
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm text-gray-300">
                      City
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter your city"
                        className={`${inputClass} mt-2`}
                        value={shippingInfo.city}
                        onChange={updateShippingInfo}
                      />
                    </label>

                    <label className="text-sm text-gray-300">
                      ZIP Code
                      <input
                        type="text"
                        name="zip"
                        placeholder="Enter ZIP code"
                        className={`${inputClass} mt-2`}
                        value={shippingInfo.zip}
                        onChange={updateShippingInfo}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="mb-5 rounded-xl border border-white/10 bg-[#111114]/90 p-5 shadow-xl backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setPaymentToggle(open => !open)}
                aria-expanded={paymentToggle}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-lg font-semibold">Payment Methods</span>
                {paymentToggle ? <FaAngleUp /> : <FaAngleDown />}
              </button>

              {paymentToggle && (
                <div className="mt-5 space-y-4">
                  <label className="flex items-center gap-3 text-gray-300">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-purple-600"
                    />
                    Cash on Delivery
                  </label>

                  <label className="flex items-center gap-3 text-gray-300">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'dc'}
                      onChange={() => setPaymentMethod('dc')}
                      className="accent-purple-600"
                    />
                    Debit Card
                  </label>

                  {paymentMethod === 'dc' && (
                    <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                      <h3 className="mb-4 font-semibold">
                        Debit Card Information
                      </h3>

                      <label className="mb-4 block text-sm text-gray-300">
                        Card Number
                        <input
                          type="text"
                          placeholder="Enter card number"
                          className={`${inputClass} mt-2`}
                        />
                      </label>

                      <label className="mb-4 block text-sm text-gray-300">
                        Card Holder Name
                        <input
                          type="text"
                          placeholder="Enter card holder name"
                          className={`${inputClass} mt-2`}
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-4">
                        <label className="text-sm text-gray-300">
                          Expiry Date
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className={`${inputClass} mt-2`}
                          />
                        </label>

                        <label className="text-sm text-gray-300">
                          CVV
                          <input
                            type="password"
                            placeholder="CVV"
                            className={`${inputClass} mt-2`}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Order Summary */}
          <aside className="h-fit w-full rounded-xl border border-white/10 bg-[#111114]/95 p-6 shadow-xl backdrop-blur-sm lg:w-96">
            <h2 className="mb-5 text-xl font-bold">Order Summary</h2>

            <div className="max-h-72 space-y-4 overflow-y-auto">
              {cart.products?.map(product => (
                <div
                  key={product.productId ?? product.id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 rounded-lg bg-white object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      ₹{product.price} × {product.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t border-white/10 pt-4 font-semibold">
              <span>Total Price</span>
              <span>₹{Number(cart.totalPrice || 0).toFixed(2)}</span>
            </div>

            <button
              type="button"
              onClick={handleOrder}
              className="mt-6 w-full rounded-lg bg-purple-700 py-3 font-semibold text-white transition hover:bg-purple-600"
            >
              Place Order
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;