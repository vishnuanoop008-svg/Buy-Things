import { NavLink, Outlet } from 'react-router-dom';

const tabClass = ({ isActive }) =>
  `rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-emerald-800 text-white'
      : 'border border-gray-200 bg-white text-gray-600 hover:border-emerald-700 hover:text-emerald-800'
  }`;

const ProfileLayout = () => {
  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 pb-12 pt-32 text-[#173b32] md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          Account
        </p>
        <h1 className="mb-6 text-3xl font-extrabold">My account</h1>

        <nav
          aria-label="Profile navigation"
          className="mb-8 flex flex-wrap gap-3 border-b border-gray-200 pb-5"
        >
          <NavLink to="/profile" end className={tabClass}>
            Profile
          </NavLink>
          <NavLink to="/profile/orders" className={tabClass}>
            My orders
          </NavLink>
        </nav>

        <Outlet />
      </div>
    </main>
  );
};

export default ProfileLayout;