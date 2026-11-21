import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { registerUser, closeAuthModal } from '../redux/authSlice';

const Register = ({ openLogin = () => {} }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setPasswordError('Please fill in all fields.');
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.com$/i.test(email.trim());

    if (!validEmail) {
      setEmailError('Enter a valid email address ending in .com.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      await dispatch(
        registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        })
      ).unwrap();

      dispatch(closeAuthModal());
    } catch (err) {
      // The Redux auth error is displayed below the form.
      console.error('Registration failed:', err);
    }
  };

  const inputClassName =
    'w-full rounded-lg border border-white/10 bg-[#09090b] px-3 py-2.5 text-white placeholder:text-gray-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20';

  return (
    <div className="rounded-xl border border-white/10 bg-[#111114] p-6 text-white shadow-2xl shadow-purple-950/30 sm:p-8">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
        Join us
      </p>
      <h2 className="mb-6 text-2xl font-bold">Create your account</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="register-name"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Name
          </label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            className={inputClassName}
            placeholder="Enter your name"
            autoComplete="name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-email"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={event => {
              setEmail(event.target.value);
              setEmailError('');
            }}
            className={inputClassName}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-400">{emailError}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-password"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            className={inputClassName}
            placeholder="Enter your password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-confirm-password"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Confirm Password
          </label>
          <input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={event => {
              setConfirmPassword(event.target.value);
              setPasswordError('');
            }}
            className={inputClassName}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-400">{passwordError}</p>
          )}
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-400">
            {typeof error === 'string' ? error : 'Registration failed.'}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mb-5 w-full rounded-lg bg-purple-700 py-2.5 font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-400">
        Already have an account?
        <button
          type="button"
          className="ml-2 font-semibold text-purple-400 transition hover:text-purple-300"
          onClick={openLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;