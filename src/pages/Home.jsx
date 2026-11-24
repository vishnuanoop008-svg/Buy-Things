import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Frame1 from '../assets/images/frame1.jpg';
import Frame2 from '../assets/images/frame2.jpg';
import Frame3 from '../assets/images/frame3.jpg';

import CategorySection from '../components/CategorySection';
import InfoSection from '../components/InfoSection';
import ProductCard from '../components/productCard';

import { setProducts } from '../redux/productSlice';
import { productImages } from '../assets/mockData';

const slides = [
  {
    image: Frame1,
    alt: 'Shopping bags on display',
    eyebrow: 'Thoughtful finds for every day',
    title: 'Big finds.',
    highlight: 'Small prices.',
    description: 'Discover something special at a price you will love.',
  },
  {
    image: Frame2,
    alt: 'Online shopping storefront',
    eyebrow: 'Everything you want, in one place',
    title: 'Shop more.',
    highlight: 'Spend less.',
    description: 'Find great offers across your favorite categories.',
  },
  {
    image: Frame3,
    alt: 'Retail display with special offers',
    eyebrow: 'Fresh deals are waiting',
    title: 'Find your',
    highlight: 'next favorite.',
    description: 'Shop the best products at prices made for you.',
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product?.products ?? []);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/products');

        const productsWithImages = data.map((product) => ({
          ...product,
          image: productImages[product.image] || product.image,
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
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSlide = slides[activeSlide];
  const availableProducts = products.filter(
    (product) => product.active !== false && product.inStock !== false
  );

  return (
    <main className="min-h-screen bg-[#f5f7f5] pt-28 text-[#173b32]">
      {/* Featured banner */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-5 sm:px-6 lg:px-8">
        <div
          className="relative grid min-h-[310px] overflow-hidden rounded-2xl bg-[#e5f0e9] md:grid-cols-2"
          aria-roledescription="carousel"
          aria-label="Featured offers"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsPaused(false);
            }
          }}
        >
          <div className="relative z-10 flex flex-col items-start justify-center px-6 py-9 sm:px-10 md:px-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              {currentSlide.eyebrow}
            </p>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              {currentSlide.title}
              <span className="block text-emerald-700">
                {currentSlide.highlight}
              </span>
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-600 sm:text-base">
              {currentSlide.description}
            </p>

            <Link
              to="/shop"
              className="mt-5 inline-flex items-center rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Shop now <span className="ml-3 text-lg">→</span>
            </Link>

            <div className="mt-5 flex gap-2" aria-label="Choose banner">
              {slides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show banner ${index + 1}`}
                  aria-current={index === activeSlide}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeSlide
                      ? 'w-7 bg-emerald-800'
                      : 'w-2.5 bg-emerald-800/25 hover:bg-emerald-800/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative min-h-56 md:min-h-full">
            {slides.map((slide, index) => (
              <img
                key={slide.image}
                src={slide.image}
                alt={slide.alt}
                aria-hidden={index !== activeSlide}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  index === activeSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-[#e5f0e9] via-transparent to-transparent md:w-1/3" />
          </div>
        </div>
      </section>

      <InfoSection />

      {/* Categories */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategorySection />

        {/* Today's best deals */}
        <section className="py-8 sm:py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                Hand-picked for you
              </p>
              <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                Today&apos;s best deals
              </h2>
            </div>
            <Link
              to="/shop"
              className="shrink-0 text-sm font-semibold text-emerald-800 hover:text-emerald-600"
            >
              View all →
            </Link>
          </div>

          {availableProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {availableProducts.slice(0, 5).map((product) => (
                <ProductCard
                  key={product.productId ?? product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
              Products will appear here when they have loaded.
            </p>
          )}
        </section>
      </div>

      {/* Promotional banner */}
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#145344] px-6 py-8 text-white sm:flex-row sm:items-center sm:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
              A little extra for you
            </p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Your first cart deserves a little extra.
            </h2>
            <p className="mt-2 text-sm text-emerald-50/80">
              Explore the collection and find something you love.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-flex rounded-lg bg-emerald-200 px-5 py-2.5 text-sm font-bold text-[#145344] transition hover:bg-white"
            >
              Discover deals
            </Link>
          </div>
          <p className="text-5xl font-black text-amber-300 sm:text-6xl">
            10%
          </p>
        </div>
      </section>

      {/* More products */}
      {availableProducts.length > 5 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                More to love
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                Picked for you
              </h2>
            </div>
            <Link
              to="/shop"
              className="shrink-0 text-sm font-semibold text-emerald-800 hover:text-emerald-600"
            >
              Explore more →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {availableProducts.slice(5, 10).map((product) => (
              <ProductCard
                key={product.productId ?? product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      )}

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-800 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700"
        >
          Back to top ↑
        </button>
      )}
    </main>
  );
};

export default Home;