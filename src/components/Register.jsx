import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { registerUser, closeAuthModal } from '../redux/authSlice';

const Register = ({ openLogin = () => {} }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (event) => {
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
      console.error('Registration failed:', err);
    }
  };

  const inputClassName =
    'w-full rounded-lg border border-gray-300 bg-[#f5f8f6] px-3 py-2.5 text-[#173b32] outline-none transition placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-[#173b32] shadow-xl sm:p-8">
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
        Join us
      </p>
      <h2 className="mb-6 text-2xl font-extrabold">Create your account</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="register-name"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Name
          </label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClassName}
            placeholder="Enter your name"
            autoComplete="name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-email"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Email
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError('');
            }}
            className={inputClassName}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-password"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
            placeholder="Enter your password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-confirm-password"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Confirm password
          </label>
          <input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setPasswordError('');
            }}
            className={inputClassName}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
          )}
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600">
            {typeof error === 'string' ? error : 'Registration failed.'}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mb-5 w-full rounded-lg bg-emerald-800 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Already have an account?
        <button
          type="button"
          className="ml-2 font-semibold text-emerald-800 transition hover:text-emerald-600"
          onClick={openLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;