import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { loginAdmin } from '../redux/adminSlice';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, loading, error } = useSelector(state => state.admin);

  if (admin?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await dispatch(loginAdmin({ email, password })).unwrap();
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch {
      // The rejected message is shown from Redux below.
    }
  };

  const inputClass =
    'mt-2 w-full rounded-lg border border-white/10 bg-[#09090b] px-3 py-2.5 text-white outline-none focus:border-purple-500';

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 py-12 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111114] p-7 shadow-2xl"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
          Buy Things Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold">Admin sign in</h1>

        {error && (
          <p className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <label className="mt-6 block text-sm text-gray-300">
          Email
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            autoComplete="username"
            required
            className={inputClass}
          />
        </label>

        <label className="mt-4 block text-sm text-gray-300">
          Password
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-purple-700 py-3 font-semibold hover:bg-purple-600 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <Link to="/" className="mt-5 block text-center text-sm text-gray-400 hover:text-white">
          Return to store
        </Link>
      </form>
    </main>
  );
};

export default AdminLogin;