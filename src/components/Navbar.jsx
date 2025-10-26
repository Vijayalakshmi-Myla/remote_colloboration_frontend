'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // Function to validate JWT
  
  const isTokenValid = (token) => {
    if (!token) return false;

    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const currentTime = Date.now() / 1000;

      // Check expiration
      if (payload.exp && payload.exp > currentTime) {
        return true;
      }
    } catch (err) {
      // If token is malformed
      console.error('Invalid token:', err);
    }

    // Remove invalid/expired token
    localStorage.removeItem('token');
    return false;
  };

  // Check login status on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const valid = isTokenValid(token);
    setIsLoggedIn(valid);
    setIsCheckingAuth(false);
  }, []);

  // Watch for token changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const valid = isTokenValid(token);
      setIsLoggedIn(valid);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const handleNewDocument = () => {
    const newDocId = uuidv4();
    router.push(`/document/${newDocId}`);
  };

  const handleDocumentList = () => {
    router.push('/document');
  };

  // Optional loading UI while checking token
  if (isCheckingAuth) {
    return (
      <nav className="flex items-center bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-red-950 m-2">Workspace</h1>
      </nav>
    );
  }

  return (
    <nav className="flex items-center bg-white shadow-md p-4">
      <h1 className="text-2xl font-bold text-red-950 m-2">Workspace</h1>

      <ul className="flex flex-row space-x-6 ml-auto">
        {!isLoggedIn ? (
          <>
            <li>
              <Link href="/about" className="text-gray-600 hover:text-red-950 font-medium">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-600 hover:text-red-950 font-medium">
                Contact
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/dashboard" className="text-gray-600 hover:text-red-950 font-medium">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-gray-600 hover:text-red-950 font-medium">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-950 font-medium"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
