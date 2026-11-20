import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { addToCart } from '../redux/cartSlice';
import {
  addToWishlist,
  removeFromWishlist
} from '../redux/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
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

  // Older saved wishlist entries might not contain inStock.
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
      await dispatch(addToCart(product)).unwrap();
      toast.success('Product added to cart successfully!');
    } catch (error) {
      toast.error(error || 'Unable to add product to cart.');
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
        toast.success('Added to Wishlist Successfully!');
      }
    } catch (error) {
      toast.error(error || 'Wishlist operation failed.');
    }
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openProduct}
      onKeyDown={handleCardKeyDown}
      aria-label={`View ${product.name}`}
      className="relative transform cursor-pointer rounded border bg-white p-4 shadow transition-transform duration-300 hover:scale-105"
    >
      <button
        type="button"
        onClick={handleWishlist}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md"
      >
        {isWishlisted ? (
          <FaHeart className="text-lg text-red-600" />
        ) : (
          <FaRegHeart className="text-lg text-gray-600" />
        )}
      </button>

      <img
        src={product.image}
        alt={product.name}
        className="mb-4 h-48 w-full object-contain"
      />

      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-500">₹{product.price}</p>

      <div
        className="mt-2 flex items-center"
        aria-label={`Rating: ${rating} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }
          />
        ))}
      </div>

      <p
        className={
          inStock
            ? 'mt-2 text-sm text-green-700'
            : 'mt-2 text-sm text-red-600'
        }
      >
        {inStock ? 'In stock' : 'Out of stock'}
      </p>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!inStock}
        className="group absolute bottom-4 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-900 text-sm text-white transition-all duration-300 hover:w-32 hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        <span className="group-hover:hidden">+</span>
        <span className="hidden group-hover:block">Add to cart</span>
      </button>
    </article>
  );
};

export default ProductCard;