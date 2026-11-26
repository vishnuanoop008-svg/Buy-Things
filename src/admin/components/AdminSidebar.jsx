import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/trash', label: 'Trash Bin' },
];

const AdminSidebar = () => (
  <aside className="border-b border-gray-200 bg-white p-4 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-60 lg:overflow-y-auto lg:border-b-0 lg:border-r">
    <h2 className="mb-5 px-3 text-lg font-extrabold tracking-tight text-[#173b32]">
      BUY <span className="text-emerald-700">THINGS</span>
      <span className="mt-1 block text-xs font-semibold uppercase tracking-widest text-gray-500">
        Admin
      </span>
    </h2>

    <nav
      aria-label="Admin navigation"
      className="flex gap-2 overflow-x-auto lg:flex-col"
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-emerald-800 text-white'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar;