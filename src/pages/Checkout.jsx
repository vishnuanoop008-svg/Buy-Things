import React, { useState } from 'react';
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
    zip: ''
  });

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

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
      createdAt: new Date().toISOString()
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

  return (
    <div className="container mx-auto px-4 pb-8 pt-36 md:px-16 lg:px-24">
      <h3 className="mb-4 text-2xl font-semibold">CHECKOUT</h3>

      <div className="mt-8 flex flex-col justify-between gap-10 md:flex-row">
        <div className="md:w-2/3">
          <div className="mb-6 border p-2">
            <div
              className="flex items-center justify-between"
              onClick={() => setBillingToggle(!billingToggle)}
            >
              <h3 className="mb-2 text-lg font-semibold">
                Billing Information
              </h3>
              {billingToggle ? <FaAngleDown /> : <FaAngleUp />}
            </div>

            <div className={`space-y-4 ${billingToggle ? '' : 'hidden'}`}>
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter the name"
                  className="w-full border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  className="w-full border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone #"
                  className="w-full border px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="mb-6 border p-2">
            <div
              className="flex items-center justify-between"
              onClick={() => setShippingToggle(!shippingToggle)}
            >
              <h3 className="mb-2 text-lg font-semibold">
                Shipping Information
              </h3>
              {shippingToggle ? <FaAngleDown /> : <FaAngleUp />}
            </div>

            <div className={`space-y-4 ${shippingToggle ? '' : 'hidden'}`}>
              <div>
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter Address"
                  className="w-full border px-3 py-2"
                  value={shippingInfo.address}
                  onChange={(event) =>
                    setShippingInfo({
                      ...shippingInfo,
                      address: event.target.value
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter City Name"
                  className="w-full border px-3 py-2"
                  value={shippingInfo.city}
                  onChange={(event) =>
                    setShippingInfo({
                      ...shippingInfo,
                      city: event.target.value
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700">Zip Code</label>
                <input
                  type="text"
                  name="zip"
                  placeholder="Enter Zip Code"
                  className="w-full border px-3 py-2"
                  value={shippingInfo.zip}
                  onChange={(event) =>
                    setShippingInfo({
                      ...shippingInfo,
                      zip: event.target.value
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div className="mb-6 border p-2">
            <div
              className="flex items-center justify-between"
              onClick={() => setPaymentToggle(!paymentToggle)}
            >
              <h3 className="mb-2 text-lg font-semibold">Payment Methods</h3>
              {paymentToggle ? <FaAngleDown /> : <FaAngleUp />}
            </div>

            <div className={`space-y-4 ${paymentToggle ? '' : 'hidden'}`}>
              <div className="mb-2 flex items-center">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <label className="ml-2 block text-gray-700">
                  Cash on Delivery
                </label>
              </div>

              <div className="mb-2 flex items-center">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'dc'}
                  onChange={() => setPaymentMethod('dc')}
                />
                <label className="ml-2 block text-gray-700">Debit Card</label>
              </div>

              {paymentMethod === 'dc' && (
                <div className="mb-4 rounded-lg bg-gray-100 p-4">
                  <h3 className="mb-4 text-xl font-semibold">
                    Debit Card Information
                  </h3>

                  <div className="mb-4">
                    <label className="mb-2 block font-semibold text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Card number"
                      className="w-full rounded border p-2"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block font-semibold text-gray-700">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter card holder name"
                      className="w-full rounded border p-2"
                      required
                    />
                  </div>

                  <div className="mb-4 flex justify-between">
                    <div className="mr-2 w-1/2">
                      <label className="mb-2 block font-semibold text-gray-700">
                        Expire Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full rounded border p-2"
                        required
                      />
                    </div>

                    <div className="ml-2 w-1/2">
                      <label className="mb-2 block font-semibold text-gray-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-full rounded border p-2"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border bg-white p-6 shadow-md md:w-1/3">
          <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

          <div className="space-y-4">
            {cart.products?.map((product) => (
              <div key={product.id} className="flex justify-between">
                <div className="flex items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded object-contain"
                  />
                  <div className="ml-4">
                    <h4 className="text-md font-semibold">{product.name}</h4>
                    <p className="text-gray-600">
                      ₹{product.price} × {product.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between">
              <span>Total Price:</span>
              <span className="font-semibold">
                ₹{Number(cart.totalPrice || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full bg-violet-900 py-2 text-white hover:bg-red-800"
            onClick={handleOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;