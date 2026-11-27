import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const user = useSelector((state) => state.auth.user);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      toast.error('Could not find the admin account. Please sign in again.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('The new password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('The passwords do not match.');
      return;
    }

    setSaving(true);

    try {
      await axios.patch(
        `http://localhost:5000/users/${encodeURIComponent(user.id)}`,
        { password: newPassword }
      );

      setNewPassword('');
      setConfirmPassword('');
      toast.success('Admin password updated.');
    } catch {
      toast.error('Could not update the password.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'mt-2 w-full rounded-lg border border-gray-300 bg-[#f5f8f6] px-3 py-2.5 text-[#173b32] outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15';

  if (!user) {
    return (
      <section className="text-[#173b32]">
        <h1 className="text-2xl font-extrabold">Admin Profile</h1>
        <p className="mt-2 text-gray-600">Please sign in to view this page.</p>
      </section>
    );
  }

  return (
    <section className="text-[#173b32]">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
        Account
      </p>
      <h1 className="text-2xl font-extrabold">Admin Profile</h1>
      <p className="mt-1 text-sm text-gray-600">
        View your admin account details and update your password.
      </p>

      <div className="mt-6 max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <dl className="space-y-5">
          <div className="border-b border-gray-100 pb-4">
            <dt className="text-sm text-gray-500">Name</dt>
            <dd className="mt-1 font-semibold">{user.name || 'Store Admin'}</dd>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="mt-1 break-all font-semibold">{user.email || '—'}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="mt-1 font-semibold capitalize">
              {user.role || 'admin'}
            </dd>
          </div>
        </dl>

        <form onSubmit={handleSubmit} className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="text-xl font-bold">Update password</h2>

          <label
            htmlFor="admin-new-password"
            className="mt-4 block text-sm font-medium text-gray-700"
          >
            New password
          </label>
          <input
            id="admin-new-password"
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
            htmlFor="admin-confirm-password"
            className="mt-4 block text-sm font-medium text-gray-700"
          >
            Confirm new password
          </label>
          <input
            id="admin-confirm-password"
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
            disabled={saving}
            className="mt-5 rounded-lg bg-emerald-800 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminProfile;