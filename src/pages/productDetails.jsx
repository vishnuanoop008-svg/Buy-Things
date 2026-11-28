import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { productImages } from '../assets/mockData';
import { addToCart } from '../redux/cartSlice';
import {
  addToWishlist,
  removeFromWishlist,
} from '../redux/wishlistSlice';

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth?.user);
  const wishlistItems = useSelector(state => state.wishlist?.items ?? []);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const { data } = await axios.get(
          `http://localhost:5000/products/${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        setProduct({
          ...data,
          image: productImages[data.image] ?? data.image,
        });
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Failed to fetch product:', err);
          setError(
            'Could not load this product. Check that JSON Server is running on port 5000.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  const productId = product?.productId ?? product?.id;

  const wishlistProduct = wishlistItems.find(
    item => String(item.productId ?? item.id) === String(productId)
  );

  const isWishlisted = Boolean(wishlistProduct);
  const quantity = product
    ? Math.max(
        0,
        Number(product.quantity ?? (product.inStock === false ? 0 : 10))
      )
    : 0;
  const isAvailable =
    product?.active !== false && product?.inStock !== false && quantity > 0;
  const isLowStock = quantity > 0 && quantity < 5;

  const handleAddToCart = async () => {
    if (!user?.id) {
      toast.error('Please log in first.');
      return;
    }

    if (!isAvailable) {
      toast.error('This product is currently unavailable.');
      return;
    }

    try {
      await dispatch(addToCart(product)).unwrap();
      toast.success('Product added to cart successfully!');
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error(err || 'Unable to add product to cart.');
    }
  };

  const handleWishlist = async () => {
    if (!user?.id) {
      toast.error('Please log in first.');
      return;
    }

    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(wishlistProduct.id)).unwrap();
        toast.success('Removed from wishlist.');
      } else {
        await dispatch(addToWishlist(product)).unwrap();
        toast.success('Added to wishlist successfully!');
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error(err || 'Wishlist operation failed.');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f7f5] px-4 pb-12 pt-36 text-[#173b32]">
        <p className="mx-auto max-w-6xl rounded-xl border border-gray-200 bg-white p-6 text-gray-600">
          Loading product…
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#f5f7f5] px-4 pb-12 pt-36 text-[#173b32]">
        <section className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-red-700">{error || 'Product not found.'}</p>
          <Link
            to="/shop"
            className="mt-5 inline-flex rounded-lg bg-emerald-800 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
          >
            Back to shop
          </Link>
        </section>
      </main>
    );
  }

  const rating = Math.max(0, Math.min(5, Number(product.rating) || 0));
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 pb-12 pt-36 text-[#173b32]">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/shop"
          className="mb-6 inline-flex items-center text-sm font-semibold text-emerald-800 transition hover:text-emerald-600"
        >
          ← Back to shop
        </Link>

        <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 md:grid-cols-2">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f3f5f3] p-5">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-sm text-gray-400">Image unavailable</span>
            )}
          </div>

          <section className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
              Product details
            </p>

            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl font-bold text-[#173b32]">
              ₹{product.price}
            </p>

            <div
              className="mt-3 text-xl text-amber-500"
              role="img"
              aria-label={`Rating: ${rating} out of 5`}
            >
              {'★'.repeat(fullStars)}
              {hasHalfStar ? '½' : ''}
              {'☆'.repeat(emptyStars)}
              <span className="ml-2 text-sm text-gray-500">{rating}/5</span>
            </div>

            <p
              className={`mt-3 font-semibold ${
                !isAvailable || isLowStock
                  ? 'text-red-600'
                  : 'text-emerald-700'
              }`}
            >
              {isAvailable
                ? `In stock (${quantity} stock available)`
                : 'Currently unavailable'}
            </p>

            <div className="mt-6 border-t border-gray-200 pt-5">
              <h2 className="text-lg font-bold">Description</h2>
              <p className="mt-2 leading-7 text-gray-600">
                {product.description || 'Product details coming soon.'}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className="rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Add to cart
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className="rounded-lg border border-emerald-800 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                {isWishlisted ? 'Remove from wishlist ♥' : 'Add to wishlist ♡'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;