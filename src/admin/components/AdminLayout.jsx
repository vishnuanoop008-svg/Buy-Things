import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => (
  <div className="min-h-screen bg-[#09090b] text-white">
  <AdminSidebar />

  <div className="min-h-screen md:ml-60">
    <AdminHeader />

    <main className="h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6 md:px-8">
      <Outlet />
    </main>
  </div>
</div>
);

export default AdminLayout;