import React, { useState } from 'react';
import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaUser
} from 'react-icons/fa';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

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
import { clearWishlist } from '../redux/wishlistSlice';

const Navbar = () => {

  const [search, setSearch] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, authModalOpen, authModalMode } = useSelector(
    state => state.auth
  );

  const cartCount = useSelector(
    state => state.cart.products.length
  );

  const wishlistCount = useSelector(
    state => state.wishlist.items.length
  );

  // Search
  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);
    dispatch(setSearchTerm(value));
    navigate('/filter-data');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    dispatch(setSearchTerm(search));
    navigate('/filter-data');
  };

  // Open Login
  const openLogin = () => {
    dispatch(openAuthModal('login'));
  };

  // Open Register
  const openSignUp = () => {
    dispatch(openAuthModal('register'));
  };

  // Logout
  const handleLogout = async () => {
    try {

      // 1. Clear wishlist from JSON Server
      await dispatch(clearWishlist()).unwrap();

      // 2. Clear cart from Redux
      dispatch(clearCartState());

      // 3. Logout user
      dispatch(logout());

      // 4. Close authentication modal
      dispatch(closeAuthModal());

      // 5. Redirect to home
      navigate('/');

      alert('Logged out successfully!');

    } catch (error) {

      alert('Unable to clear wishlist. Please try again.');

    }
  };

  return (

    <nav className="fixed top-0 left-0 right-0 z-50 bg-white  ">

      <div className="container mx-auto px-4 md:px-16 lg:px-24 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="text-lg font-bold">
          <Link to="/">BUY THINGS</Link>
        </div>

        {/* Search */}
        <div className="relative flex-1 mx-4">

          <form onSubmit={handleSearchSubmit}>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              className="w-full border py-2 px-4"
            />

            <button type="submit">
              <FaSearch className="absolute top-3 right-3 text-violet-900" />
            </button>

          </form>

        </div>

        {/* Cart, Wishlist and Login */}
        <div className="flex items-center space-x-5">

          {/* Cart */}
          <Link to="/cart" className="relative">

            <FaShoppingCart className="text-xl hover:text-violet-900" />

            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}

          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative">

            <FaHeart className="text-xl hover:text-red-600 transition" />

            {wishlistCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}

          </Link>

          {/* Login / User */}
          {user ? (

            <div className="flex items-center gap-3">

              <span className="text-sm font-semibold">
                Hi, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>

            </div>

          ) : (

            <button
              className="hidden md:block hover:underline"
              onClick={openLogin}
            >
              Login | Register
            </button>

          )}

          {!user && (
            <button
              className="block md:hidden"
              onClick={openLogin}
            >
              <FaUser />
            </button>
          )}

        </div>

      </div>

      {/* Navigation Links */}
      <div className="flex items-center justify-center space-x-10 py-4 text-sm font-bold">

        <Link to="/" className="hover:underline">
          Home
        </Link>

        <Link to="/shop" className="hover:underline">
          Shop
        </Link>

        <Link to="/contact" className="hover:underline">
          Contact
        </Link>

        <Link to="/about" className="hover:underline">
          About
        </Link>

         <Link to="/about" className="hover:underline">
          Order
        </Link>

      </div>

      {/* Login / Register Modal */}
      <Modal
        isModalOpen={authModalOpen}
        setIsModalOpen={(value) => {
          if (!value) dispatch(closeAuthModal());
        }}
      >

        {authModalMode === 'login' ? (

          <Login openSignUp={openSignUp} />

        ) : (

          <Register openLogin={openLogin} />

        )}

      </Modal>

    </nav>

  );
};

export default Navbar;
