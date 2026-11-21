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
    <main className="min-h-screen bg-[#09090b] pt-32 text-white">
      {/* Hero */}
      <section className="border-y border-purple-500/20 bg-gradient-to-r from-[#11091c] via-[#1b0b2b] to-[#09090b] px-5 py-20 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-purple-400">
          Shop smarter • Live better
        </p>
        <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
          ABOUT BUY THINGS
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-300">
          Your one-stop destination for quality products, great prices, and a
          better shopping experience.
        </p>
      </section>

      {/* Who We Are */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 font-bold tracking-wider text-purple-400">
              WHO WE ARE
            </p>
            <h2 className="mb-5 text-3xl font-bold">
              Welcome to <span className="text-purple-400">BUY THINGS</span>
            </h2>
            <p className="mb-5 leading-8 text-gray-300">
              BUY THINGS is an online shopping platform designed to make
              shopping simple, convenient, and enjoyable.
            </p>
            <p className="mb-6 leading-8 text-gray-400">
              We bring together a variety of products across different
              categories, helping customers discover what they need in one
              place. Our goal is to provide a smooth shopping experience with
              quality products and customer satisfaction.
            </p>
            <Link
              to="/shop"
              className="inline-block rounded-full bg-purple-600 px-7 py-3 font-semibold text-white transition hover:bg-purple-500"
            >
              Explore Products
            </Link>
          </div>

          <div className="flex min-h-72 items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#191022] to-[#0d0d10] p-10 shadow-lg shadow-purple-950/20">
            <div className="text-center">
              <FaShoppingBag className="mx-auto mb-5 text-8xl text-purple-500" />
              <h3 className="text-3xl font-bold">BUY THINGS</h3>
              <p className="mt-2 text-gray-400">Shop Smart. Shop Better.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="border-y border-white/10 bg-[#0d0d10] px-6 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 border-t-4 border-t-purple-600 bg-white/[0.03] p-8 transition hover:border-purple-500/40">
            <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
            <p className="leading-8 text-gray-400">
              Our mission is to make online shopping accessible, convenient, and
              enjoyable by offering a wide range of products at competitive
              prices.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 border-t-4 border-t-purple-600 bg-white/[0.03] p-8 transition hover:border-purple-500/40">
            <h2 className="mb-4 text-2xl font-bold">Our Vision</h2>
            <p className="leading-8 text-gray-400">
              Our vision is to become a trusted online shopping destination
              where customers can discover quality products and enjoy a
              reliable shopping experience.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 text-center">
          <p className="mb-2 font-bold tracking-wider text-purple-400">
            OUR ADVANTAGES
          </p>
          <h2 className="text-3xl font-bold">Why Choose BUY THINGS?</h2>
          <p className="mt-3 text-gray-400">
            We focus on making every shopping experience better.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={<FaShippingFast />}
            title="Fast Delivery"
            text="Convenient delivery to help you receive your orders without hassle."
          />
          <Feature
            icon={<FaShieldAlt />}
            title="Secure Shopping"
            text="A shopping experience designed with customer safety in mind."
          />
          <Feature
            icon={<FaTags />}
            title="Great Prices"
            text="Discover different products at competitive prices."
          />
          <Feature
            icon={<FaHeadset />}
            title="Customer Support"
            text="We're here to help with your shopping questions and enquiries."
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="border-t border-purple-500/20 bg-gradient-to-r from-[#160923] to-[#09090b] px-5 py-16 text-center">
        <h2 className="mb-5 text-3xl font-bold md:text-4xl">
          Start Your Shopping Journey!
        </h2>
        <p className="mb-8 text-gray-300">
          Discover products you'll love at BUY THINGS.
        </p>
        <Link
          to="/shop"
          className="inline-block rounded-full bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-500"
        >
          Shop Now
        </Link>
      </section>
    </main>
  );
};

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-7 text-center transition duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-purple-500/5">
      <div className="mx-auto mb-5 flex justify-center text-4xl text-purple-500">
        {icon}
      </div>
      <h3 className="mb-3 text-lg font-bold text-white">{title}</h3>
      <p className="text-sm leading-6 text-gray-400">{text}</p>
    </div>
  );
}

export default About;