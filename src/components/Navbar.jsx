import { useState } from 'react';
import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaUser
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Login from './Login';
import Register from './Register';
import Modal from './Modal';

import { setSearchTerm } from '../redux/productSlice';
import {
  logout,
  openAuthModal,
  closeAuthModal
} from '../redux/authSlice';
import { clearCartState } from '../redux/cartSlice';
import { resetWishlist } from '../redux/wishlistSlice';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, authModalOpen, authModalMode } = useSelector(
    (state) => state.auth
  );

  const cartCount = useSelector(
    (state) => state.cart.products.length
  );

  const wishlistCount = useSelector(
    (state) => state.wishlist.items.length
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    dispatch(setSearchTerm(value));
    navigate('/filter-data');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    dispatch(setSearchTerm(search));
    navigate('/filter-data');
  };

  const openLogin = () => {
    dispatch(openAuthModal('login'));
  };

  const openSignUp = () => {
    dispatch(openAuthModal('register'));
  };

  const handleLogout = () => {
    dispatch(clearCartState());
    dispatch(resetWishlist());
    dispatch(logout());
    dispatch(closeAuthModal());
    navigate('/');
    toast.success('Logged out successfully!');
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-16 lg:px-24">
        <div className="text-lg font-bold">
          <Link to="/">BUY THINGS</Link>
        </div>

        <div className="relative mx-4 flex-1">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              className="w-full border px-4 py-2"
            />
            <button type="submit" aria-label="Search">
              <FaSearch className="absolute right-3 top-3 text-violet-900" />
            </button>
          </form>
        </div>

        <div className="flex items-center space-x-5">
          <Link to="/cart" aria-label="Cart" className="relative">
            <FaShoppingCart className="text-xl hover:text-violet-900" />
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/wishlist" aria-label="Wishlist" className="relative">
            <FaHeart className="text-xl transition hover:text-red-600" />
            {wishlistCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">
                Hi, {user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="hidden hover:underline md:block"
                onClick={openLogin}
              >
                Login | Register
              </button>
              <button
                type="button"
                className="block md:hidden"
                onClick={openLogin}
                aria-label="Login or register"
              >
                <FaUser />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center space-x-10 py-4 text-sm font-bold">
        <Link to="/" className="text-purple-800 hover:underline">Home</Link>
        <Link to="/shop" className="text-purple-800 hover:underline">Shop</Link>
        <Link to="/contact" className="text-purple-800 hover:underline">Contact</Link>
        <Link to="/about" className="text-purple-800 hover:underline">About</Link>
        <Link to="/orders" className="text-purple-800 hover:underline">Order</Link>
      </div>

      <Modal
        isModalOpen={authModalOpen}
        setIsModalOpen={(isOpen) => {
          if (!isOpen) dispatch(closeAuthModal());
        }}
      >
        {authModalMode === 'register' ? (
          <Register openLogin={openLogin} />
        ) : (
          <Login openSignUp={openSignUp} />
        )}
      </Modal>
    </nav>
  );
};

export default Navbar;