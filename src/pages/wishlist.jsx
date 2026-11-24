import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { clearWishlist } from '../redux/wishlistSlice';
import ProductCard from '../components/productCard';

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(
    (state) => state.wishlist?.items ?? []
  );

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 pb-12 pt-36 text-[#173b32] md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Saved for later
            </p>
            <h1 className="text-3xl font-extrabold">
              My wishlist ({wishlistItems.length})
            </h1>
          </div>

          {wishlistItems.length > 0 && (
            <button
              type="button"
              onClick={() => dispatch(clearWishlist())}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              Clear wishlist
            </button>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
            {wishlistItems.map((product) => (
              <ProductCard
                key={product.productId ?? product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <section className="mx-auto flex min-h-[45vh] max-w-xl flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-4xl" aria-hidden="true">
              ♡
            </p>
            <h2 className="mt-3 text-2xl font-extrabold">
              Your wishlist is empty
            </h2>
            <p className="mt-3 text-gray-600">
              Save products you like, and they’ll appear here.
            </p>
            <Link
              to="/shop"
              className="mt-7 rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Continue shopping
            </Link>
          </section>
        )}
      </div>
    </main>
  );
};

export default Wishlist;