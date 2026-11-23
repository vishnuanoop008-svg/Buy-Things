import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => (
  <div className="min-h-screen bg-[#09090b] text-white lg:flex">
    <AdminSidebar />
    <div className="min-w-0 flex-1">
      <AdminHeader />
      <main className="p-5 sm:p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;