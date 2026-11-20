import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import { useState, useEffect } from 'react'
import Order from './pages/Order'
import FilterData from './pages/FilterData'
import Wishlist from './pages/wishlist'
import Contact from './pages/Contact'
import About from './pages/About'
import { useDispatch } from 'react-redux'
import { fetchWishlist } from './redux/wishlistSlice'
import ProductDetails from './pages/productDetails'


function App() {
  const [order, setOrder] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchWishlist())
  }, [dispatch])

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/cart' element={<Cart />} />
        <Route
          path='/checkout'
          element={<Checkout setOrder={setOrder} />}
        />
        <Route
          path='/order-confirmation'
          element={<Order order={order} />}
        />
        <Route path='/filter-data' element={<FilterData />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
       <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App
