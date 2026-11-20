import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginUser, closeAuthModal } from '../redux/authSlice';

const Login = ({ openSignUp }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useSelector(state => state.auth.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();

    if (!email || !password) {
      alert('Please enter email and password!');
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();

      dispatch(closeAuthModal());

      // Return to the protected page, or go home after a direct /login visit.
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    } catch (error) {
      alert(error || 'Login failed!');
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            className="w-full border px-3 py-2"
            placeholder="Enter Email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            className="w-full border px-3 py-2"
            placeholder="Enter Password"
            required
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2 text-gray-700">Remember Me</span>
          </label>

          <a href="#" className="text-black">
            Forgot Password?
          </a>
        </div>

        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-900 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      {openSignUp && (
        <div className="text-center">
          <span className="text-gray-700">Don&apos;t have an Account?</span>
          <button
            type="button"
            className="ml-2 text-black"
            onClick={openSignUp}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;