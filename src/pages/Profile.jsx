import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { logout, closeAuthModal } from '../redux/authSlice';
import { clearCartState } from '../redux/cartSlice';
import { resetWishlist } from '../redux/wishlistSlice';

const Profile = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearCartState());
    dispatch(resetWishlist());
    dispatch(logout());
    dispatch(closeAuthModal());
    navigate('/');
    toast.success('Logged out successfully!');
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 pt-28 text-white">
        <p>Sign in to view your profile.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 pb-12 pt-10 text-white">
      <section className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#111114] p-8 shadow-xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
          Account
        </p>
        <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

        <dl className="space-y-5">
          <div className="border-b border-white/10 pb-4">
            <dt className="text-sm text-gray-400">Name</dt>
            <dd className="mt-1 font-medium">{user.name || '—'}</dd>
          </div>
          <div className="border-b border-white/10 pb-4">
            <dt className="text-sm text-gray-400">Email</dt>
            <dd className="mt-1 font-medium">{user.email || '—'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">User ID</dt>
            <dd className="mt-1 font-medium">{user.id || '—'}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 rounded-lg bg-purple-700 px-6 py-3 font-semibold transition hover:bg-purple-600"
        >
          Logout
        </button>
      </section>
    </main>
  );
};

export default Profile;