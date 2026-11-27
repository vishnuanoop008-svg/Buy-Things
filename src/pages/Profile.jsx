import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  logout,
  closeAuthModal,
  updateUserProfile,
} from '../redux/authSlice';
import { clearCartState } from '../redux/cartSlice';
import { resetWishlist } from '../redux/wishlistSlice';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const userUrl = user?.id
    ? `http://localhost:5000/users/${encodeURIComponent(user.id)}`
    : null;

  const handleLogout = () => {
    dispatch(clearCartState());
    dispatch(resetWishlist());
    dispatch(logout());
    dispatch(closeAuthModal());
    navigate('/');
    toast.success('Logged out successfully!');
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();

    if (!userUrl) {
      toast.error('Please sign in again.');
      return;
    }

    setSavingAddress(true);

    try {
      const updatedAddress = address.trim();

      await axios.patch(userUrl, { address: updatedAddress });
      dispatch(updateUserProfile({ address: updatedAddress }));
      toast.success('Address updated successfully.');
    } catch {
      toast.error('Could not update your address.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!userUrl) {
      toast.error('Please sign in again.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Your new password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('The passwords do not match.');
      return;
    }

    setSavingPassword(true);

    try {
      await axios.patch(userUrl, { password: newPassword });
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully.');
    } catch {
      toast.error('Could not update your password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass =
    'mt-2 w-full rounded-lg border border-gray-300 bg-[#f5f8f6] px-3 py-2.5 text-[#173b32] outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15';

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

        <form
          onSubmit={handleAddressSubmit}
          className="mt-8 border-t border-gray-200 pt-6"
        >
          <h2 className="text-xl font-bold">Delivery address</h2>

          <label
            htmlFor="profile-address"
            className="mt-4 block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <textarea
            id="profile-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            rows={3}
            placeholder="Enter your delivery address"
            className={inputClass}
          />

          <button
            type="submit"
            disabled={savingAddress}
            className="mt-4 rounded-lg bg-emerald-800 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingAddress ? 'Saving…' : 'Save address'}
          </button>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-8 border-t border-gray-200 pt-6"
        >
          <h2 className="text-xl font-bold">Update password</h2>

          <label
            htmlFor="profile-new-password"
            className="mt-4 block text-sm font-medium text-gray-700"
          >
            New password
          </label>
          <input
            id="profile-new-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            placeholder="Enter new password"
            className={inputClass}
          />

          <label
            htmlFor="profile-confirm-password"
            className="mt-4 block text-sm font-medium text-gray-700"
          >
            Confirm new password
          </label>
          <input
            id="profile-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            placeholder="Confirm new password"
            className={inputClass}
          />

          <button
            type="submit"
            disabled={savingPassword}
            className="mt-4 rounded-lg bg-emerald-800 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingPassword ? 'Updating…' : 'Update password'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Log out
        </button>
      </section>
    </main>
  );
};

export default Profile;