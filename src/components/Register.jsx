import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, closeAuthModal } from '../redux/authSlice';

const Register = ({ openLogin }) => {
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

    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill all fields!');
      return;
    }

    const validEmail =
      email.includes('@') && email.toLowerCase().endsWith('.com');

    if (!validEmail) {
      setEmailError('Invalid email address. Include "@" and end with ".com".');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
      alert('Registration successful!');
      dispatch(closeAuthModal());
    } catch (err) {
      alert(err || 'Registration failed!');
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            className="w-full border px-3 py-2"
            placeholder="Enter Name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="text"
            value={email}
            onChange={event => {
              setEmail(event.target.value);
              setEmailError('');
            }}
            className="w-full border px-3 py-2"
            placeholder="Enter Email"
            required
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            className="w-full border px-3 py-2"
            placeholder="Enter Password"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={event => {
              setConfirmPassword(event.target.value);
              setPasswordError('');
            }}
            className="w-full border px-3 py-2"
            placeholder="Confirm Password"
            required
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
          )}
        </div>

        {error && <p className="mb-3 text-red-600">{error}</p>}

        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-900 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
      </form>

      <div className="text-center">
        <span className="text-gray-700">Already have an Account?</span>
        <button
          type="button"
          className="ml-2 text-black"
          onClick={openLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;