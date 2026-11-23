import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/categories', label: 'Categories' },
];

const AdminSidebar = () => (
  <aside className="border-b border-white/10 bg-[#111114] p-4 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-60 lg:overflow-y-auto lg:border-b-0 lg:border-r">
    <h2 className="mb-5 px-3 text-lg font-extrabold">
      BUY <span className="text-purple-400">THINGS</span>
      <span className="mt-1 block text-xs font-medium uppercase tracking-widest text-gray-500">
        Admin
      </span>
    </h2>

    <nav className="flex gap-2 overflow-x-auto lg:flex-col">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-purple-700 text-white'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
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