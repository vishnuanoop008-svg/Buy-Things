
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  loginUser,
  closeAuthModal
} from '../redux/authSlice';

const Login = ({ openSignUp }) => {

  const dispatch = useDispatch();

  const loading = useSelector(state => state.auth.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter email and password!');
      return;
    }

    try {
      await dispatch(loginUser({
        email,
        password
      })).unwrap();

      alert('Login Successful!');

      // Close login modal
      dispatch(closeAuthModal());

    } catch (error) {
      alert(error || 'Login failed!');
    }
  };

  return (
    <div>

      <h2 className="text-2xl font-bold mb-4">
        Login
      </h2>

      <form onSubmit={handleSubmit}>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border"
            placeholder="Enter Email"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border"
            placeholder="Enter Password"
          />
        </div>

        {/* Remember Me */}
        <div className="mb-4 flex items-center justify-between">

          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
            />

            <span className="ml-2 text-gray-700">
              Remember Me
            </span>
          </label>

          <a
            href="#"
            className="text-black"
          >
            Forgot Password?
          </a>

        </div>

        {/* Login Button */}
        <div className="mb-4">

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-900 text-white py-2 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </div>

      </form>

      {/* Sign Up */}
      <div className="text-center">

        <span className="text-gray-700">
          Don't have an Account?
        </span>

        <button
          type="button"
          className="text-black ml-2"
          onClick={openSignUp}
        >
          Sign Up
        </button>

      </div>

    </div>
  );
};

export default Login;
