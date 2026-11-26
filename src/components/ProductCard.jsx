import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { addToCart } from '../redux/cartSlice';
import {
  addToWishlist,
  removeFromWishlist,
} from '../redux/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth?.user);
  const wishlistItems = useSelector(
    (state) => state.wishlist?.items ?? []
  );

  const productId = product.productId ?? product.id;

  const wishlistProduct = wishlistItems.find(
    (item) =>
      String(item.productId ?? item.id) === String(productId)
  );

  const isWishlisted = Boolean(wishlistProduct);
  const rating = Math.max(0, Math.min(5, Number(product.rating) || 0));
  const isInStock = product.inStock !== false;
  const isActive = product.active !== false;
  const isAvailable = isInStock && isActive;

  const availabilityLabel = !isInStock
    ? 'Out of stock'
    : !isActive
      ? 'Inactive'
      : 'In stock';

  const openProduct = () => {
    if (productId != null) {
      navigate(`/product/${productId}`);
    }
  };

  const handleCardKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;

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
      toast.error(
        typeof error === 'string' ? error : 'Wishlist operation failed.'
      );
    }
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation();

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
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'Unable to add product to cart.'
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
      <div className="relative aspect-square w-full overflow-hidden bg-[#f3f5f3]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Image unavailable
          </div>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition hover:text-red-500"
        >
          {isWishlisted ? (
            <FaHeart className="text-sm text-red-500" />
          ) : (
            <FaRegHeart className="text-sm" />
          )}
        </button>

        {!isAvailable && (
          <span className="absolute bottom-2 left-2 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
            {availabilityLabel}
          </span>
        )}
      </div>

      <div className="bg-white p-3">
        <h3 className="truncate text-sm font-semibold text-[#173b32]">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-gray-600">
          ₹{Number(product.price || 0).toLocaleString('en-IN')}
        </p>

        <div
          className="mt-2 flex gap-0.5"
          role="img"
          aria-label={`Rating: ${rating} out of 5`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              aria-hidden="true"
              className={`text-xs ${
                star <= rating ? 'text-amber-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        <p
          className={`mt-1 text-xs font-medium ${
            isAvailable ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {availabilityLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!isAvailable}
        aria-label={`Add ${product.name} to cart`}
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-lg text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        +
      </button>
    </article>
  );
};

export default ProductCard;