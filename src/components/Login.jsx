import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { loginUser, closeAuthModal } from '../redux/authSlice';

const Login = ({ openSignUp = () => {} }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Please enter your email and password.');
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();

      dispatch(closeAuthModal());
      toast.success('Login successful!');

      // Return to the protected page when login was opened by ProtectedRoute.
      if (location.pathname === '/login') {
        const destination = location.state?.from?.pathname || '/';
        navigate(destination, { replace: true });
      }
    } catch (error) {
      toast.error(error || 'Login failed.');
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="login-email" className="block text-gray-700">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border px-3 py-2"
            placeholder="Enter Email"
            autoComplete="email"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="login-password" className="block text-gray-700">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border px-3 py-2"
            placeholder="Enter Password"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2 text-gray-700">Remember Me</span>
          </label>

          <button
            type="button"
            onClick={() => toast.info('Password recovery is not set up yet.')}
            className="text-black"
          >
            Forgot Password?
          </button>
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

      <div className="text-center">
        <span className="text-gray-700">Don&apos;t have an account?</span>
        <button
          type="button"
          className="ml-2 text-black"
          onClick={openSignUp}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;