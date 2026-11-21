import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

import RetailStage from '../assets/images/retail-stage.png';
import Modal from '../components/Modal';
import ChangeAddress from '../components/ChangeAddress';
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../redux/cartSlice';

const Cart = () => {
  const cart = useSelector(state => state.cart);
  const products = cart?.products ?? [];
  const totalQuantity = cart?.totalQuantity ?? 0;
  const totalPrice = cart?.totalPrice ?? 0;

  const [address, setAddress] = useState('main street, 0012');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#09090b] px-4 pb-12 pt-36 text-white md:px-10 lg:px-16">
      {/* Background image and readability overlay */}
      <img
        src={RetailStage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-black/65"
      />

      {products.length === 0 ? (
        <section className="relative z-10 mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/50 px-6 py-10 text-center backdrop-blur-sm">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
            Buy Things
          </p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Your cart is empty
          </h1>
          <p className="mt-3 text-gray-200">
            Find something you love and add it to your cart.
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-7 rounded-full bg-purple-600 px-7 py-3 font-semibold text-white transition hover:bg-purple-500"
          >
            Explore products
          </button>
        </section>
      ) : (
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
                Your items
              </p>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
            </div>
            <p className="text-sm text-gray-200">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Cart product cards */}
            <section className="min-w-0 flex-1">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {products.map(product => {
                  const price = Number(product.price) || 0;
                  const quantity = Number(product.quantity) || 0;
                  const productId = product.productId ?? product.id;

                  return (
                    <article
                      key={productId}
                      className="relative overflow-hidden rounded-lg bg-white p-2 text-gray-900 shadow-lg"
                    >
                      <div className="aspect-square overflow-hidden rounded bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <h2 className="mt-2 truncate text-sm font-semibold">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        ₹{price.toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Subtotal: ₹{(price * quantity).toFixed(2)}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-gray-200">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${product.name}`}
                            onClick={() =>
                              dispatch(decreaseQuantity(product.id))
                            }
                            className="px-2 py-1 text-gray-700 transition hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center text-sm">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${product.name}`}
                            onClick={() =>
                              dispatch(increaseQuantity(product.id))
                            }
                            className="px-2 py-1 text-gray-700 transition hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${product.name} from cart`}
                          onClick={() =>
                            dispatch(removeFromCart(product.id))
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50 hover:text-red-700"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Cart total */}
            <aside className="h-fit w-full rounded-xl border border-white/10 bg-[#111114]/95 p-6 shadow-xl backdrop-blur-sm lg:w-80 xl:w-96">
              <h2 className="mb-6 text-xl font-bold">Cart Total</h2>

              <div className="flex justify-between border-b border-white/10 py-3 text-sm">
                <span className="text-gray-400">Total items</span>
                <span>{totalQuantity}</span>
              </div>

              <div className="border-b border-white/10 py-4">
                <p className="mb-2 text-sm font-semibold">Shipping address</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-400">{address}</span>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="shrink-0 text-sm text-purple-400 transition hover:text-purple-300"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-5 text-lg font-bold">
                <span>Total price</span>
                <span>₹{(Number(totalPrice) || 0).toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full rounded-lg bg-purple-700 py-3 font-semibold text-white transition hover:bg-purple-600"
              >
                Proceed to checkout
              </button>
            </aside>
          </div>
        </div>
      )}

      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      >
        <ChangeAddress
          setAddress={setAddress}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </main>
  );
};

export default Cart;