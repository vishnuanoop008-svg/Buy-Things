import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
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

function App() {
  const [order, setOrder] = useState(null);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<LoginModalRoute />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/filter-data" element={<FilterData />} />

        {/* Login-required pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<Profile />} />
            <Route path="orders" element={<Orders />} />
          </Route>

          {/* Redirect the old orders URL to the profile orders tab */}
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
      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={2500} />
    </BrowserRouter>
  );
}

export default App;