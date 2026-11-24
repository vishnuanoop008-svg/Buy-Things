import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

import { logout } from '../../redux/authSlice';

const AdminHeader = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="relative z-30 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 md:px-8">
      <div>
        <p className="text-sm text-gray-500">Admin dashboard</p>
        <p className="font-semibold text-[#173b32]">
          {user?.name || 'Administrator'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-label="Toggle admin profile"
            aria-expanded={profileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-emerald-800 transition hover:bg-emerald-50"
          >
            <FaUserCircle className="text-2xl" />
          </button>

          {profileOpen && (
            <section className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-gray-200 bg-white p-5 text-[#173b32] shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                Admin profile
              </p>

              <h2 className="mt-3 text-lg font-bold">
                {user?.name || 'Administrator'}
              </h2>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="mt-1 break-all font-medium">
                    {user?.email || 'No email available'}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">User ID</dt>
                  <dd className="mt-1 break-all font-medium">
                    {user?.id || 'No user ID available'}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500">Role</dt>
                  <dd className="mt-1 font-medium capitalize">
                    {user?.role || 'admin'}
                  </dd>
                </div>
              </dl>
            </section>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
        >
          Log out
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;