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

const SearchForm = ({
  mobile = false,
  search,
  onSearchChange,
  onSubmit,
}) => (
  <form
    onSubmit={onSubmit}
    role="search"
    className={
      mobile
        ? 'relative w-full'
        : 'relative hidden w-48 shrink-0 transition-[width] duration-300 ease-out focus-within:w-72 lg:focus-within:w-[28rem] md:block'
    }
  >
    <input
      type="search"
      placeholder="Search products..."
      value={search}
      onChange={onSearchChange}
      className={`w-full rounded-lg border border-gray-200 bg-[#f5f8f6] text-sm text-[#173b32] outline-none placeholder:text-gray-500 transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 ${
        mobile ? 'py-2.5 pl-4 pr-12' : 'py-3 pl-4 pr-14'
      }`}
    />

    <button
      type="submit"
      aria-label="Search"
      className={`absolute right-0 top-0 flex h-full items-center justify-center rounded-r-lg bg-emerald-800 text-white transition hover:bg-emerald-700 ${
        mobile ? 'w-11' : 'w-12'
      }`}
    >
      <FaSearch />
    </button>
  </form>
);

const Navbar = () => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, authModalOpen, authModalMode } = useSelector(
    (state) => state.auth
  );

  const cartCount = useSelector(
    (state) => state.cart?.products?.length ?? 0
  );
  const wishlistCount = useSelector(
    (state) => state.wishlist?.items?.length ?? 0
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    dispatch(setSearchTerm(value));

    if (value.trim()) {
      navigate('/filter-data');
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    dispatch(setSearchTerm(search.trim()));
    navigate('/filter-data');
  };

  const openLogin = () => dispatch(openAuthModal('login'));
  const openSignUp = () => dispatch(openAuthModal('register'));

  const handleUserClick = () => {
    if (!user) {
      openLogin();
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
  };

  const handleLogout = () => {
    dispatch(clearCartState());
    dispatch(resetWishlist());
    dispatch(logout());
    dispatch(closeAuthModal());
    navigate('/');
    toast.success('Logged out successfully!');
  };

  const navLinkClass =
    'shrink-0 text-sm font-medium text-[#31574c] transition hover:text-emerald-800';

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white text-[#173b32] shadow-sm">
      {/* Main header row */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:gap-5 md:px-8">
        <Link
          to="/"
          className="shrink-0 text-lg font-extrabold tracking-tight text-[#173b32]"
        >
          BUY THINGS<span className="text-emerald-700">.</span>
        </Link>

        {/* Desktop search, aligned to the right before the icons */}
        <div className="hidden min-w-0 flex-1 justify-end md:flex">
          <SearchForm
            search={search}
            onSearchChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-5">
          <Link
            to="/cart"
            aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}
            className="relative text-[#31574c] transition hover:text-emerald-800"
          >
            <FaShoppingCart className="text-lg" />
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-800 px-1 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/wishlist"
            aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
            className="relative text-[#31574c] transition hover:text-emerald-800"
          >
            <FaHeart className="text-lg" />
            {wishlistCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-800 px-1 text-xs text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={handleUserClick}
            aria-label={
              user?.role === 'admin'
                ? 'Open admin dashboard'
                : user
                  ? 'Open profile'
                  : 'Login or register'
            }
            title={
              user?.role === 'admin'
                ? 'Admin dashboard'
                : user
                  ? 'Profile'
                  : 'Login or register'
            }
            className="text-[#31574c] transition hover:text-emerald-800"
          >
            <FaUser className="text-lg" />
          </button>

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-[#31574c] transition hover:text-emerald-800"
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={openLogin}
              className="hidden border-l border-gray-200 pl-4 text-sm font-medium text-[#31574c] transition hover:text-emerald-800 sm:block"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-t border-gray-100 px-4 py-3 md:hidden">
        <SearchForm
          mobile
          search={search}
          onSearchChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
        />
      </div>

      {/* Navigation links */}
      <div className="flex items-center justify-center gap-6 overflow-x-auto border-t border-gray-100 px-4 py-3 sm:gap-10">
        <Link to="/" className={navLinkClass}>Home</Link>
        <Link to="/shop" className={navLinkClass}>Shop</Link>
        <Link to="/contact" className={navLinkClass}>Contact</Link>
        <Link to="/about" className={navLinkClass}>About</Link>
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