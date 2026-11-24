import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

import Modal from '../components/Modal';
import ChangeAddress from '../components/ChangeAddress';
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../redux/cartSlice';

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const products = cart?.products ?? [];
  const totalQuantity = cart?.totalQuantity ?? 0;
  const totalPrice = cart?.totalPrice ?? 0;

  const [address, setAddress] = useState('Main Street, 0012');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 pb-12 pt-36 text-[#173b32] md:px-8 lg:px-12">
      {products.length === 0 ? (
        <section className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            BUY THINGS
          </p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Your cart is empty
          </h1>
          <p className="mt-3 text-gray-600">
            Find something you love and add it to your cart.
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-7 rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Explore products
          </button>
        </section>
      ) : (
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                Your items
              </p>
              <h1 className="text-3xl font-extrabold">Shopping cart</h1>
            </div>
            <p className="text-sm text-gray-600">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            <section className="min-w-0 flex-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                  const price = Number(product.price) || 0;
                  const quantity = Number(product.quantity) || 0;
                  const productId = product.id ?? product.productId;

                  return (
                    <article
                      key={productId}
                      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
                    >
                      <div className="aspect-square overflow-hidden rounded-lg bg-[#f3f5f3]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <h2 className="mt-3 truncate text-sm font-bold text-[#173b32]">
                        {product.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-600">
                        ₹{price.toFixed(2)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Subtotal: ₹{(price * quantity).toFixed(2)}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${product.name}`}
                            onClick={() => dispatch(decreaseQuantity(productId))}
                            className="px-3 py-1.5 text-gray-700 transition hover:bg-[#eaf2ed]"
                          >
                            −
                          </button>

                          <span className="min-w-9 text-center text-sm">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={`Increase quantity of ${product.name}`}
                            onClick={() => dispatch(increaseQuantity(productId))}
                            className="px-3 py-1.5 text-gray-700 transition hover:bg-[#eaf2ed]"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${product.name} from cart`}
                          onClick={() => dispatch(removeFromCart(productId))}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50 hover:text-red-700"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="h-fit w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:w-80 xl:w-96">
              <h2 className="mb-5 text-xl font-extrabold">Cart total</h2>

              <div className="flex justify-between border-b border-gray-200 py-3 text-sm">
                <span className="text-gray-600">Total items</span>
                <span className="font-semibold">{totalQuantity}</span>
              </div>

              <div className="border-b border-gray-200 py-4">
                <p className="mb-2 text-sm font-semibold">Shipping address</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-600">{address}</span>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="shrink-0 text-sm font-semibold text-emerald-800 transition hover:text-emerald-600"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-5 text-lg font-extrabold">
                <span>Total price</span>
                <span>₹{(Number(totalPrice) || 0).toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full rounded-lg bg-emerald-800 py-3 font-semibold text-white transition hover:bg-emerald-700"
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