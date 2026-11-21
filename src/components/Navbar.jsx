import { useState } from 'react';
import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaUser,
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
  closeAuthModal,
} from '../redux/authSlice';
import { clearCartState } from '../redux/cartSlice';
import { resetWishlist } from '../redux/wishlistSlice';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, authModalOpen, authModalMode } = useSelector(
    state => state.auth
  );

  const cartCount = useSelector(state => state.cart.products.length);
  const wishlistCount = useSelector(state => state.wishlist.items.length);

  const handleSearchSubmit = event => {
    event.preventDefault();
    dispatch(setSearchTerm(search.trim()));
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
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#09090b] text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-8">
        <Link to="/" className="shrink-0 text-lg font-extrabold tracking-wide">
          BUY <span className="text-purple-500">THINGS</span>
        </Link>

        <form
          onSubmit={handleSearchSubmit}
          role="search"
          className="relative mx-auto hidden w-full max-w-2xl sm:block"
        >
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={event => setSearch(event.target.value)}
            className="w-full rounded-full border border-white/10 bg-white/10 py-3 pl-5 pr-14 text-sm text-white placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 top-0 flex h-full w-12 items-center justify-center rounded-r-full bg-purple-600 transition hover:bg-purple-500"
          >
            <FaSearch />
          </button>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-5 sm:ml-0">
          <Link
            to="/cart"
            aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
            className="relative transition hover:text-purple-400"
          >
            <FaShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/wishlist"
            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
            className="relative transition hover:text-purple-400"
          >
            <FaHeart className="text-xl" />
            {wishlistCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-xs text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User icon directly after wishlist */}
          <button
            type="button"
            onClick={openLogin}
            aria-label="Login or register"
            title="Login or register"
            className="transition hover:text-purple-400"
          >
            <FaUser className="text-xl" />
          </button>

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-sm font-semibold">Hi, {user.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-gray-300 transition hover:text-purple-400"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openLogin}
              className="hidden border-l border-white/20 pl-5 text-sm transition hover:text-purple-400 md:block"
            >
              Login <span className="text-gray-500">|</span> Register
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-white/5 px-4 py-3 sm:hidden">
        <form onSubmit={handleSearchSubmit} role="search" className="relative">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={event => setSearch(event.target.value)}
            className="w-full rounded-full border border-white/10 bg-white/10 py-2.5 pl-4 pr-12 text-sm text-white placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 top-0 flex h-full w-11 items-center justify-center rounded-r-full bg-purple-600"
          >
            <FaSearch />
          </button>
        </form>
      </div>

      <div className="flex items-center justify-center gap-6 overflow-x-auto border-t border-white/5 px-4 py-3 text-sm font-medium sm:gap-10">
        <Link to="/" className="shrink-0 text-purple-400 hover:text-purple-300">
          Home
        </Link>
        <Link to="/shop" className="shrink-0 text-gray-200 hover:text-purple-400">
          Shop
        </Link>
        <Link to="/contact" className="shrink-0 text-gray-200 hover:text-purple-400">
          Contact
        </Link>
        <Link to="/about" className="shrink-0 text-gray-200 hover:text-purple-400">
          About
        </Link>
        <Link to="/orders" className="shrink-0 text-gray-200 hover:text-purple-400">
          Order
        </Link>
      </div>

      <Modal
        isModalOpen={authModalOpen}
        setIsModalOpen={isOpen => {
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