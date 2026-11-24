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
      const loggedInUser = await dispatch(
        loginUser({ email: email.trim(), password })
      ).unwrap();

      dispatch(closeAuthModal());
      toast.success('Login successful!');

      if (loggedInUser?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (location.pathname === '/login') {
        const destination = location.state?.from?.pathname || '/';
        navigate(destination, { replace: true });
      }
    } catch (error) {
      toast.error(error || 'Login failed.');
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-[#173b32] shadow-xl sm:p-8">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
        Welcome back
      </p>
      <h2 className="mb-6 text-2xl font-extrabold">
        Login to BUY THINGS
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-[#f5f8f6] px-3 py-2.5 text-[#173b32] outline-none transition placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-[#f5f8f6] px-3 py-2.5 text-[#173b32] outline-none transition placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="mb-5 flex items-center justify-between gap-3 text-sm">
          <label className="inline-flex items-center text-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 accent-emerald-700"
            />
            <span className="ml-2">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() =>
              toast.info('Password recovery is not set up yet.')
            }
            className="font-medium text-emerald-800 transition hover:text-emerald-600"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mb-5 w-full rounded-lg bg-emerald-800 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Don&apos;t have an account?
        <button
          type="button"
          className="ml-2 font-semibold text-emerald-800 transition hover:text-emerald-600"
          onClick={openSignUp}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;