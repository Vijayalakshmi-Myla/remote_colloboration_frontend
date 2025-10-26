'use client';

import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '@/lib/api/auth';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { User, Mail, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      }
    };
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-100 to-blue-200 flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Your Profile
          </h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {!profile ? (
            <p className="text-gray-600">Loading your profile...</p>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-md">
                  <span className="text-5xl text-white font-semibold">
                    {profile.username[0].toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-5 text-left text-gray-700">
                <div className="flex items-center gap-3">
                  <User className="text-cyan-500" />
                  <span className="font-medium">
                    <span className="text-gray-900">Username:</span>{' '}
                    {profile.username}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-cyan-500" />
                  <span className="font-medium">
                    <span className="text-gray-900">Email:</span>{' '}
                    {profile.email}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-cyan-500" />
                  <span className="font-medium">
                    <span className="text-gray-900">Joined:</span>{' '}
                    {new Date(profile.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="my-8 border-t border-gray-200" />

              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow hover:from-cyan-600 hover:to-blue-600 transition-all"
              >
                Refresh Profile
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
