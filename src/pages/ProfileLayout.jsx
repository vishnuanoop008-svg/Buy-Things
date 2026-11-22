import { NavLink, Outlet } from 'react-router-dom';

const tabClass = ({ isActive }) =>
  `rounded-full px-5 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-purple-600 text-white'
      : 'border border-white/10 bg-white/5 text-gray-300 hover:border-purple-500/50 hover:text-white'
  }`;

const ProfileLayout = () => {
  return (
    <main className="min-h-screen bg-[#09090b] px-4 pb-12 pt-32 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
          Account
        </p>
        <h1 className="mb-6 text-3xl font-bold">My Account</h1>

        <nav
          aria-label="Profile navigation"
          className="mb-8 flex flex-wrap gap-3 border-b border-white/10 pb-5"
        >
          <NavLink to="/profile" end className={tabClass}>
            Profile
          </NavLink>
          <NavLink to="/profile/orders" className={tabClass}>
            My Orders
          </NavLink>
        </nav>

        <Outlet />
      </div>
    </main>
  );
};

export default ProfileLayout;