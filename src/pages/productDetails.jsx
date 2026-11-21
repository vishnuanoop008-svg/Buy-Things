import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { productImages } from '../assets/mockData';
import { addToCart } from '../redux/cartSlice';
import {
  addToWishlist,
  removeFromWishlist
} from '../redux/wishlistSlice';

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector(
    (state) => state.wishlist?.items ?? []
  );

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
          `http://localhost:5000/products/${id}`,
          { signal: controller.signal }
        );

        setProduct({
          ...data,
          image: productImages[data.image] ?? data.image
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

  const wishlistProduct = wishlistItems.find(
    (item) => String(item.productId) === String(product?.id)
  );

  const isWishlisted = Boolean(wishlistProduct);

  const handleAddToCart = async () => {
    if (!user?.id) {
      toast.error('Please log in first.');
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

  if (loading) return <p className="p-8 pt-36">Loading product…</p>;
  if (error) return <p className="p-8 pt-36 text-red-600">{error}</p>;
  if (!product) return <p className="p-8 pt-36">Product not found.</p>;

  const rating = Math.max(0, Math.min(5, Number(product.rating) || 0));
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-6 pb-12 pt-36 md:grid-cols-2">
      <div className="flex min-h-96 items-center justify-center rounded border bg-gray-50 p-6">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-96 max-w-full object-contain"
        />
      </div>

      <section>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-4 text-2xl font-semibold">₹{product.price}</p>

        <div
          className="mt-3 text-xl text-amber-500"
          role="img"
          aria-label={`Rating: ${rating} out of 5`}
        >
          {'★'.repeat(fullStars)}
          {hasHalfStar ? '½' : ''}
          {'☆'.repeat(emptyStars)}
          <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
        </div>

        <p
          className={`mt-3 font-medium ${
            product.inStock ? 'text-green-700' : 'text-red-600'
          }`}
        >
          {product.inStock ? 'In stock' : 'Out of stock'}
        </p>

        <h2 className="mt-6 text-lg font-semibold">Description</h2>
        <p className="mt-2 text-gray-700">
          {product.description || 'Product details coming soon.'}
        </p>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="rounded bg-violet-900 px-6 py-3 text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Add to Cart
          </button>

          <button
            type="button"
            onClick={handleWishlist}
            className="rounded border border-violet-900 px-6 py-3 text-violet-900 hover:bg-violet-50"
          >
            {isWishlisted ? 'Remove from Wishlist ♥' : 'Add to Wishlist ♡'}
          </button>
        </div>

        <Link
          to="/shop"
          className="mt-6 inline-block text-violet-700 underline"
        >
          Back to shop
        </Link>
      </section>
    </main>
  );
}

export default ProductDetails;