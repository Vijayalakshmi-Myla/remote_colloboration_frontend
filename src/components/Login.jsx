'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../lib/api/auth';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(formData);

    if (data) {
      setMessage('Login successful!');
      router.push('/dashboard');
    } else {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-cyan-800 to-emerald-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-white/20 text-white space-y-6 animate-fade-in-up"
      >
        <h2 className="text-4xl font-bold text-center text-white drop-shadow-sm">
          Welcome Back
        </h2>
        <p className="text-center text-gray-200">Login to continue your journey 🌟</p>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="px-4 py-3 rounded-md bg-white/90 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="px-4 py-3 rounded-md bg-white/90 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition"
            placeholder="Enter your password"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg shadow-lg transition-all"
        >
          Login
        </button>

        {/* Message */}
        {message && (
          <div className="text-center text-sm text-yellow-100 bg-black/30 rounded-md p-2">
            {message}
          </div>
        )}

        {/* Navigation */}
        <p className="text-center text-sm text-gray-100">
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="underline hover:text-cyan-200 transition"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}
