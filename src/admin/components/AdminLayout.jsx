import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';


const AdminLayout = () => (
  <div className="min-h-screen bg-[#f5f7f5] text-[#173b32] lg:h-screen lg:overflow-hidden">
    <AdminSidebar />

    <div className="min-h-screen lg:ml-60 lg:flex lg:h-screen lg:flex-col">
      <AdminHeader />

      <main className="px-4 py-6 md:px-8 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;