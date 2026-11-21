import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { loginUser, closeAuthModal } from '../redux/authSlice';

const Login = ({ openSignUp = () => {} }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const loading = useSelector(state => state.auth.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Please enter your email and password.');
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();

      dispatch(closeAuthModal());
      toast.success('Login successful!');

      // Return to the protected page if login was opened by ProtectedRoute.
      if (location.pathname === '/login') {
        const destination = location.state?.from?.pathname || '/';
        navigate(destination, { replace: true });
      }
    } catch (error) {
      toast.error(error || 'Login failed.');
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#111114] p-6 text-white shadow-2xl shadow-purple-950/30 sm:p-8">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
        Welcome back
      </p>
      <h2 className="mb-6 text-2xl font-bold">Login to BUY THINGS</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#09090b] px-3 py-2.5 text-white placeholder:text-gray-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#09090b] px-3 py-2.5 text-white placeholder:text-gray-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="mb-5 flex items-center justify-between gap-3 text-sm">
          <label className="inline-flex items-center text-gray-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-[#09090b] accent-purple-600"
            />
            <span className="ml-2">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => toast.info('Password recovery is not set up yet.')}
            className="text-purple-400 transition hover:text-purple-300"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mb-5 w-full rounded-lg bg-purple-700 py-2.5 font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-400">
        Don&apos;t have an account?
        <button
          type="button"
          className="ml-2 font-semibold text-purple-400 transition hover:text-purple-300"
          onClick={openSignUp}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;