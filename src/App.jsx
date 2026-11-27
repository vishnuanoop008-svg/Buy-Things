import { useEffect, useState } from 'react';
import {BrowserRouter, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { openAuthModal } from './redux/authSlice';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Order from './pages/Order';
import Orders from './pages/Orders';
import Wishlist from './pages/wishlist';
import Contact from './pages/Contact';
import About from './pages/About';
import ProductDetails from './pages/productDetails';
import FilterData from './pages/FilterData';
import Profile from './pages/Profile';
import ProfileLayout from './pages/ProfileLayout';
import AdminRoute from './admin/components/AdminRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import AdminProducts from './admin/pages/Products';
import AddProduct from './admin/pages/AddProduct';
import EditProduct from './admin/pages/EditProduct';
import AdminOrders from './admin/pages/Orders';
import Customers from './admin/pages/Customers';
import Categories from './admin/pages/Categories';
import TrashBin from './admin/pages/TrashBin';
import Messages from './admin/pages/Messages';

function LoginModalRoute() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const location = useLocation();

  useEffect(() => {
    if (!user?.id) {
      dispatch(openAuthModal('login'));
    }
  }, [dispatch, user?.id]);

  if (user?.id) {
    return (
      <Navigate
        to={location.state?.from?.pathname || '/'}
        replace
      />
    );
  }

  return null;
}

function AppContent({ order, setOrder }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <Navbar />}

      <Routes>
        {/* Customer-facing public pages */}
        <Route path="/login" element={<LoginModalRoute />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/filter-data" element={<FilterData />} />
           <Route path="/contact" element={<Contact />} />

        {/* Customer-facing protected pages */}
        <Route element={<ProtectedRoute />}>
       
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<Profile />} />
            <Route path="orders" element={<Orders />} />
          </Route>

          <Route
            path="/orders"
            element={<Navigate to="/profile/orders" replace />}
          />

          <Route
            path="/checkout"
            element={<Checkout setOrder={setOrder} />}
          />
          <Route
            path="/order-confirmation"
            element={<Order order={order} />}
          />
        </Route>

        {/* Admin sign-in */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin pages */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="categories" element={<Categories />} />
            <Route path="trash" element={<TrashBin />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Route>
      </Routes>

      {!isAdminPath && <Footer />}
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}

function App() {
  const [order, setOrder] = useState(null);

  return (
    <BrowserRouter>
      <AppContent order={order} setOrder={setOrder} />
    </BrowserRouter>
  );
}

export default App;