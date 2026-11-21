import { useEffect, useState } from 'react';
import axios from 'axios';
import LuxuryBags from '../assets/images/luxury-bags.png';
import NeonStorefront from '../assets/images/neon-storefront.png';
import RetailStage from '../assets/images/retail-stage.png';
import CategorySection from '../components/CategorySection';
import InfoSection from '../components/InfoSection';
import { setProducts } from '../redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/productCard';
import Shop from './Shop';
import { productImages } from '../assets/mockData';

const slides = [
  {
    image: LuxuryBags,
    alt: 'Luxury shopping bags on purple pedestals',
    eyebrow: 'Shop smarter • Live better',
    title: 'WELCOME TO',
    highlight: 'BUY THINGS',
    description: 'Millions of products, just a click away.',
  },
  {
    image: NeonStorefront,
    alt: 'Neon purple online storefront',
    eyebrow: 'Everything you want • One place',
    title: 'YOUR NEXT',
    highlight: 'GREAT FIND',
    description: 'Discover something special at a price you will love.',
  },
  {
    image: RetailStage,
    alt: 'Futuristic purple retail stage',
    eyebrow: 'Fresh deals • Big possibilities',
    title: 'SHOP THE',
    highlight: 'EXTRAORDINARY',
    description: 'Find great offers across all your favorite categories.',
  },
];

function Home() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.product?.products ?? []);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
    if (isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] pt-28 text-white">
      <section
        className="relative isolate min-h-[560px] overflow-hidden border-b border-white/10 md:min-h-[650px]"
        aria-roledescription="carousel"
        aria-label="Featured shopping images"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false);
          }
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            aria-hidden={index !== activeSlide}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeSlide
                ? 'z-0 opacity-100'
                : 'z-[-1] opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10" />
          </div>
        ))}

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-20 md:min-h-[650px] md:px-12">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-purple-400 md:text-base">
              {slides[activeSlide].eyebrow}
            </p>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              {slides[activeSlide].title}
              <span className="mt-2 block italic text-purple-500">
                {slides[activeSlide].highlight}
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-relaxed text-gray-300 md:text-xl">
              {slides[activeSlide].description}
              <br />
              Shop the best, at the best price!
            </p>

            <a
              href="#shop"
              className="mt-9 inline-flex items-center gap-4 rounded-full bg-purple-600 px-8 py-4 font-bold text-white transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              Shop Now <span aria-hidden="true" className="text-xl">→</span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeSlide}
              className={`h-3 rounded-full transition-all ${
                index === activeSlide
                  ? 'w-7 bg-purple-500'
                  : 'w-3 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Render the benefits row from the separate InfoSection component. */}
      <InfoSection />

      <div className="bg-[#09090b] px-4 md:px-10">
        <CategorySection />

        <section className="mx-auto max-w-7xl py-14 md:py-20">
       <div className="mb-8">
       <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
         Hand-picked for you
       </p>
      <h2 className="text-3xl font-bold text-white">Top Products</h2>
       </div>

     <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
  {products.slice(0, 5).map(product => (
    <ProductCard
      key={product.productId ?? product.id}
      product={product}
    />
  ))}
</div>
    </section>
      </div>

      <div id="shop">
        <Shop />
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-purple-600 px-5 py-3 font-medium text-white shadow-lg transition hover:bg-purple-500"
        >
          Back to top ↑
        </button>
      )}
    </main>
  );
}

export default Home;