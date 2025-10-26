'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-800 to-blue-900 text-white">
      <Navbar />
      <main className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-10 md:p-16 max-w-xl w-full border border-white/20 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Welcome to the <span className="text-cyan-300">Workspace</span>
          </h1>
          <p className="text-md md:text-lg text-gray-200 mb-8">
            A place for seamless <span className="text-cyan-200 font-medium">collaboration</span> and
            productivity.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={handleLogin}
              className="px-6 py-3 rounded-lg bg-cyan-300 text-cyan-900 font-semibold shadow hover:bg-cyan-200 transition duration-200"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="px-6 py-3 rounded-lg bg-white text-cyan-800 font-semibold shadow hover:bg-gray-100 transition duration-200"
            >
              Register
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
