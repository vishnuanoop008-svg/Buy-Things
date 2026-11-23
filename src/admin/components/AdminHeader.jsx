import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';

const AdminHeader = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#09090b] px-5 py-4">
      <div>
        <p className="text-sm text-gray-400">Admin dashboard</p>
        <p className="font-semibold text-white">
          {user?.name || 'Administrator'}
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-200 transition hover:border-purple-500 hover:text-white"
      >
        Log out
      </button>
    </header>
  );
};

export default AdminHeader;