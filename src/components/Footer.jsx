import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#09090b] px-4 py-10 text-white md:px-16 lg:px-24">
      <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold">
            BUY <span className="text-purple-500">THINGS</span>
          </h3>
          <p className="mt-4 max-w-sm leading-7 text-gray-400">
            Your one-stop shop for all your needs. Shop with us and enjoy a
            better online shopping experience.
          </p>
        </div>

        <div className="flex flex-col md:items-center">
          <h4 className="text-lg font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-gray-400">
            <li><Link to="/" className="transition hover:text-purple-400">Home</Link></li>
            <li><Link to="/shop" className="transition hover:text-purple-400">Shop</Link></li>
            <li><Link to="/contact" className="transition hover:text-purple-400">Contact</Link></li>
            <li><Link to="/about" className="transition hover:text-purple-400">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold">Follow Us</h4>

          <div className="mt-4 flex gap-4">
            <a href="#" aria-label="Facebook" className="text-gray-400 transition hover:text-purple-400"><FaFacebook /></a>
            <a href="#" aria-label="Twitter" className="text-gray-400 transition hover:text-purple-400"><FaTwitter /></a>
            <a href="#" aria-label="GitHub" className="text-gray-400 transition hover:text-purple-400"><FaGithub /></a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 transition hover:text-purple-400"><FaLinkedin /></a>
          </div>

          <form
            className="mt-6 flex"
            onSubmit={event => event.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter email"
              aria-label="Email address"
              className="min-w-0 flex-1 rounded-l-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-r-lg bg-purple-700 px-4 py-2 font-medium transition hover:bg-purple-600"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto mt-8 border-t border-white/10 pt-5">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} Buy Things. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="transition hover:text-purple-400">Privacy Policy</a>
            <a href="#" className="transition hover:text-purple-400">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;