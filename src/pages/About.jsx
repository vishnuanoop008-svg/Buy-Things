import { Link } from 'react-router-dom';
import {
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaTags,
  FaShoppingBag,
} from 'react-icons/fa';

const About = () => {
  return (
    <main className="min-h-screen bg-[#f5f7f5] pt-28 text-[#173b32]">
      {/* Hero */}
      <section className="bg-[#e5f0e9] px-5 py-16 text-center md:py-20">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          Shop smarter · Live better
        </p>
        <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
          About BUY THINGS
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
          Your one-stop destination for quality products, great prices, and a
          better shopping experience.
        </p>
      </section>

      {/* Who we are */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-16">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-700">
              Who we are
            </p>
            <h2 className="mb-5 text-3xl font-extrabold">
              Welcome to <span className="text-emerald-700">BUY THINGS</span>
            </h2>
            <p className="mb-5 leading-7 text-gray-600">
              BUY THINGS is an online shopping platform designed to make
              shopping simple, convenient, and enjoyable.
            </p>
            <p className="mb-6 leading-7 text-gray-600">
              We bring together products from different categories, helping
              customers discover what they need in one place. Our goal is to
              provide a smooth shopping experience with quality products and
              helpful customer service.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Explore products <span className="ml-3">→</span>
            </Link>
          </div>

          <div className="flex min-h-72 items-center justify-center rounded-2xl bg-[#e5f0e9] p-10">
            <div className="text-center">
              <FaShoppingBag className="mx-auto mb-5 text-7xl text-emerald-800" />
              <h3 className="text-3xl font-extrabold">BUY THINGS</h3>
              <p className="mt-2 text-gray-600">Shop smart. Shop better.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="border-y border-gray-200 bg-white px-5 py-14 md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 border-t-4 border-t-emerald-700 bg-[#f8faf8] p-7 transition hover:shadow-md md:p-8">
            <h2 className="mb-4 text-2xl font-bold">Our mission</h2>
            <p className="leading-7 text-gray-600">
              Our mission is to make online shopping accessible, convenient,
              and enjoyable by offering a variety of products at competitive
              prices.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 border-t-4 border-t-emerald-700 bg-[#f8faf8] p-7 transition hover:shadow-md md:p-8">
            <h2 className="mb-4 text-2xl font-bold">Our vision</h2>
            <p className="leading-7 text-gray-600">
              Our vision is to become a trusted shopping destination where
              customers can discover quality products and enjoy a reliable
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-700">
            Our advantages
          </p>
          <h2 className="text-3xl font-extrabold">Why choose BUY THINGS?</h2>
          <p className="mt-3 text-gray-600">
            We focus on making every shopping experience better.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={<FaShippingFast />}
            title="Fast delivery"
            text="Convenient delivery to help your orders arrive without hassle."
          />
          <Feature
            icon={<FaShieldAlt />}
            title="Secure shopping"
            text="A shopping experience designed with customer safety in mind."
          />
          <Feature
            icon={<FaTags />}
            title="Great prices"
            text="Discover products across categories at competitive prices."
          />
          <Feature
            icon={<FaHeadset />}
            title="Customer support"
            text="We're here to help with your shopping questions and enquiries."
          />
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-[#e5f0e9] px-5 py-14 text-center md:py-16">
        <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
          Start your shopping journey
        </h2>
        <p className="mb-7 text-gray-600">
          Discover products you&apos;ll love at BUY THINGS.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center rounded-lg bg-emerald-800 px-7 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Shop now <span className="ml-3">→</span>
        </Link>
      </section>
    </main>
  );
};

const Feature = ({ icon, title, text }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex justify-center text-3xl text-emerald-800">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-[#173b32]">{title}</h3>
      <p className="text-sm leading-6 text-gray-600">{text}</p>
    </div>
  );
};

export default About;