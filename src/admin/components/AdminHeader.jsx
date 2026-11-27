import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout } from '../../redux/authSlice';

const AdminHeader = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="relative z-30 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 md:px-8">
      <div>
        <p className="text-sm text-gray-500">Admin dashboard</p>
        <p className="font-semibold text-[#173b32]">
          {user?.name || 'Store Admin'}
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
      >
        Log out
      </button>
    </header>
  );
};

export default AdminHeader;