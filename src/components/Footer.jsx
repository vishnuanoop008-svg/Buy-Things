import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#123f35] px-4 py-10 text-white md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            BUY <span className="text-emerald-300">THINGS</span>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-6 text-emerald-50/75">
            Your one-stop shop for everyday finds, great prices, and a better
            online shopping experience.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm text-emerald-50/75">
            <li>
              <Link to="/" className="transition hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="transition hover:text-white">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-white">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">Follow us</h2>
          <div className="mt-4 flex gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="text-emerald-50/75 transition hover:text-emerald-300"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-emerald-50/75 transition hover:text-emerald-300"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="text-emerald-50/75 transition hover:text-emerald-300"
            >
              <FaGithub />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-emerald-50/75 transition hover:text-emerald-300"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Get updates</h2>
          <p className="mt-2 text-sm text-emerald-50/75">
            Subscribe for news and special offers.
          </p>

          <form
            className="mt-4 flex"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="min-w-0 flex-1 rounded-l-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-emerald-50/50 focus:border-emerald-300"
            />
            <button
              type="submit"
              className="rounded-r-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-[#123f35] transition hover:bg-emerald-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-white/15 pt-5">
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-emerald-50/65 sm:flex-row">
          <p>© {new Date().getFullYear()} Buy Things. All rights reserved.</p>

          <div className="flex gap-4">
            <a href="#" className="transition hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-white">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;