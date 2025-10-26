'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api/auth';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await register(formData);
      console.log('Registration success:', data);
      setMessage('Successfully Registered!');
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-teal-500 to-emerald-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 text-white space-y-6 animate-fade-in-up"
      >
        <h2 className="text-4xl font-bold text-center text-white drop-shadow-sm">Create an Account</h2>
        <p className="text-center text-gray-200">Start collaborating with your team today ✨</p>

        {/* Input fields */}
        {[
          { id: 'username', label: 'Username', type: 'text' },
          { id: 'email', label: 'Email Address', type: 'email' },
          { id: 'password', label: 'Password', type: 'password' },
          { id: 'confirmPassword', label: 'Confirm Password', type: 'password' },
        ].map(({ id, label, type }) => (
          <div key={id} className="flex flex-col">
            <label htmlFor={id} className="text-sm mb-1">
              {label}
            </label>
            <input
              id={id}
              name={id}
              type={type}
              value={formData[id]}
              onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
              required
              className="px-4 py-3 rounded-md bg-white/90 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-500 transition"
              placeholder={`Enter your ${label.toLowerCase()}`}
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg shadow-lg transition-all"
        >
          Register
        </button>

        {/* Feedback Message */}
        {message && (
          <div className="text-center text-sm text-yellow-100 bg-black/30 rounded-md p-3">
            {message}
          </div>
        )}

        {/* Already registered? */}
        <p className="text-center text-sm text-gray-100">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="underline hover:text-cyan-200 transition"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}
