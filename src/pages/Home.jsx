import { useEffect, useState } from 'react';
import axios from 'axios';
import HeroImage from '../assets/images/hero-page.png';
import InfoSection from '../components/InfoSection';
import CategorySection from '../components/CategorySection';
import { setProducts } from '../redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/productCard';
import Shop from './Shop';
import { productImages } from '../assets/mockData';

function Home() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.product?.products ?? []);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/products');

        const productsWithImages = data.map(product => ({
          ...product,
          image: productImages[product.image],
        }));

        dispatch(setProducts(productsWithImages));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pt-32">
      <div className="bg-white mt-2 px-4 md:px-16 lg:px-24">
        <div className="container mx-auto py-4 flex flex-col md:flex-row space-x-2">
          <div className="w-full md:w-3/12" />

          <div className="w-full md:w-9/12 lg:w-full mr-40 mt-9 md:mt-0 h-96 relative">
            <img src={HeroImage} alt="" className="h-full w-full" />

            <div className="absolute top-16 left-8">
              <p className="text-gray-600 mb-4">Vishnu</p>
              <h2 className="text-3xl font-bold">WELCOME TO BUY THINGS</h2>
              <p className="text-xl mt-2.5 font-bold text-gray-800">
                MILLIONS+ PRODUCTS
              </p>

              <button className="bg-violet-900 px-8 py-1.5 text-white mt-4 hover:bg-red-700 transform transition-transform duration-300 hover:scale-105">
                SHOP NOW
              </button>
            </div>
          </div>
        </div>

        <InfoSection />
        <CategorySection />

        <div className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Top Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer">
            {products.slice(0, 5).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <Shop />

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 rounded bg-white px-4 py-2 text-black shadow"
        >
          Back to top ↑
        </button>
      )}
    </div>
  );
}

export default Home;