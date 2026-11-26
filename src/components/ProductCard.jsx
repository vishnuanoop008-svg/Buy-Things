import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { addToCart, clearCartState } from '../redux/cartSlice';
import { logout } from '../redux/authSlice';
import {
  addToWishlist,
  removeFromWishlist,
  resetWishlist,
} from '../redux/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector((state) => state.wishlist?.items ?? []);

  const productId = product.productId ?? product.id;

  const wishlistProduct = wishlistItems.find(
    (item) =>
      String(item.productId ?? item.id) === String(productId)
  );

  const isWishlisted = Boolean(wishlistProduct);
  const rating = Math.max(0, Math.min(5, Number(product.rating) || 0));
  const inStock = product.inStock !== false;

  const openProduct = () => {
    navigate(`/product/${productId}`);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProduct();
    }
  };

  const handleWishlist = async (event) => {
    event.stopPropagation();

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
        toast.success('Added to wishlist.');
      }
    } catch (error) {
      toast.error(error || 'Wishlist operation failed.');
    }
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation();

    if (!user?.id) {
      toast.error('Please log in first.');
      return;
    }

    if (!inStock) {
      toast.error('This product is out of stock.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/users/${encodeURIComponent(user.id)}`
      );

      const currentUser = response.data;
      const isBlocked =
        currentUser.blocked === true ||
        currentUser.isBlocked === true ||
        currentUser.status === 'blocked';

      if (isBlocked) {
        
        dispatch(clearCartState());
        dispatch(resetWishlist());
        toast.error('Your account has been blocked. You can no longer shop.');
        return;
      }

      await dispatch(addToCart(product)).unwrap();
      toast.success('Product added to cart successfully!');
    } catch (error) {
      if (error.response?.status === 404) {
       
        dispatch(clearCartState());
        dispatch(resetWishlist());
        toast.error('Your account could not be found. Please log in again.');
        return;
      }

      toast.error(
        error.response?.data?.message ||
          'Unable to verify your account. Please try again.'
      );
    }
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openProduct}
      onKeyDown={handleCardKeyDown}
      aria-label={`View ${product.name}`}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white text-[#173b32] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow transition hover:bg-gray-100"
        >
          {isWishlisted ? (
            <FaHeart className="text-sm text-red-500" />
          ) : (
            <FaRegHeart className="text-sm" />
          )}
        </button>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-semibold">{product.name}</h3>

        <p className="mt-1 text-sm text-gray-600">₹{product.price}</p>

        <div
          className="mt-2 flex gap-0.5"
          aria-label={`Rating: ${rating} out of 5`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`text-xs ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        <p
          className={`mt-1 text-xs ${
            inStock ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {inStock ? 'In stock' : 'Out of stock'}
        </p>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!inStock}
        aria-label="Add to cart"
        className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-sm text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        +
      </button>
    </article>
  );
};

export default ProductCard;