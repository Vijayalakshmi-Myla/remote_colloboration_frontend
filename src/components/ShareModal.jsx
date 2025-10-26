'use client';

import React, { useState, useEffect } from 'react';
import { shareDocument, getSharedUsers } from '@/lib/api/documentsApi';
import toast from 'react-hot-toast';

export default function ShareModal({ document, onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('view');
  const [sharedUsers, setSharedUsers] = useState([]);

  // Fetch shared users on component mount
  useEffect(() => {
    async function fetchSharedUsers() {
      try {
        const users = await getSharedUsers(document.documentId);
        setSharedUsers(users);
      } catch (err) {
        toast.error('Failed to load shared users');
        console.error(err);
      }
    }

    fetchSharedUsers();
  }, [document.documentId]);

  const handleShare = async () => {
    if (!email) return toast.error('Enter an email');
    try {
      await shareDocument(document.documentId, { email, permission: role });
      toast.success('Document shared successfully');
      setEmail('');
      setRole('view');

      // Refresh shared users list after sharing
      const users = await getSharedUsers(document.documentId);
      setSharedUsers(users);
    } catch (err) {
      toast.error('Failed to share document');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="font-bold mb-2">Share Document</h2>

        {/* Input for new share */}
        <input
          type="email"
          placeholder="User email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        >
          <option value="view">View</option>
          <option value="edit">Edit</option>
        </select>

        <div className="flex justify-end space-x-2 mb-4">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Share
          </button>
        </div>

        {/* Shared Users List */}
        <h3 className="font-semibold mb-2">Shared With:</h3>
        {sharedUsers.length === 0 && (
          <p className="text-gray-500 text-sm">No users have access yet.</p>
        )}
        <ul>
          {sharedUsers.map((user) => (
            <li key={user.userId} className="flex justify-between mb-1 text-sm">
              <span>{user.email}</span>
              <span className="capitalize text-gray-600">{user.permission}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
