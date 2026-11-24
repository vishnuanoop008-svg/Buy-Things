import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { logout, closeAuthModal } from '../redux/authSlice';
import { clearCartState } from '../redux/cartSlice';
import { resetWishlist } from '../redux/wishlistSlice';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
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
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7f5] px-4 text-[#173b32]">
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
          Sign in to view your profile.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#f5f7f5] px-4 py-8 text-[#173b32]">
      <section className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          Account
        </p>
        <h1 className="mb-8 text-3xl font-extrabold">My profile</h1>

        <dl className="space-y-5">
          <div className="border-b border-gray-200 pb-4">
            <dt className="text-sm text-gray-500">Name</dt>
            <dd className="mt-1 font-semibold">{user.name || '—'}</dd>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="mt-1 break-all font-semibold">
              {user.email || '—'}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">User ID</dt>
            <dd className="mt-1 break-all font-semibold">{user.id || '—'}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Log out
        </button>
      </section>
    </main>
  );
};

export default Profile;