import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { loginAdmin } from '../redux/adminSlice';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, loading, error } = useSelector((state) => state.admin);

  if (admin?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(loginAdmin({ email, password })).unwrap();
      navigate(location.state?.from?.pathname || '/admin', {
        replace: true,
      });
    } catch {
      // The Redux error is displayed below.
    }
  };

  const inputClass =
    'mt-2 w-full rounded-lg border border-gray-300 bg-[#f5f8f6] px-3 py-2.5 text-[#173b32] outline-none transition placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15';

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f5] px-4 py-12 text-[#173b32]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          Buy Things Admin
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">Admin sign in</h1>

        {error && (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <label className="mt-6 block text-sm font-semibold text-gray-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
            className={inputClass}
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-gray-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-emerald-800 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <Link
          to="/"
          className="mt-5 block text-center text-sm font-medium text-emerald-800 transition hover:text-emerald-600"
        >
          Return to store
        </Link>
      </form>
    </main>
  );
};

export default AdminLogin;