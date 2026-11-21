import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import RetailStage from '../assets/images/retail-stage.png';
import { clearWishlist } from '../redux/wishlistSlice';
import ProductCard from '../components/productCard';

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist?.items ?? []);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#09090b] px-4 pb-12 pt-36 text-white md:px-10 lg:px-16">
      {/* Full-page background */}
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

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
              Saved for later
            </p>
            <h1 className="text-3xl font-bold">
              My Wishlist ({wishlistItems.length})
            </h1>
          </div>

          {wishlistItems.length > 0 && (
            <button
              type="button"
              onClick={() => dispatch(clearWishlist())}
              className="rounded-full border border-white/20 bg-black/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-purple-400 hover:bg-purple-700"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
            {wishlistItems.map(product => (
              <ProductCard
                key={product.productId ?? product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <section className="mx-auto flex min-h-[45vh] max-w-xl flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/45 px-6 py-12 text-center backdrop-blur-sm">
            <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
            <p className="mt-3 text-gray-300">
              Save products you like, and they’ll appear here.
            </p>
            <Link
              to="/shop"
              className="mt-7 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-500"
            >
              Continue Shopping
            </Link>
          </section>
        )}
      </div>
    </main>
  );
};

export default Wishlist;