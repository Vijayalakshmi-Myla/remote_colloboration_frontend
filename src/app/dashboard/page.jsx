'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserWorkspaces, createWorkspace } from '@/lib/api/workspaceApi'; 
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [newName, setNewName] = useState('');
  const [inviteEmails, setInviteEmails] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchWorkspacesData();
  }, []);

  const fetchWorkspacesData = async () => {
    const data = await getUserWorkspaces();
    if (data) {
      setWorkspaces(data);
    } else {
      console.error('Failed to fetch workspaces');
    }
  };

  const createWorkspaceData = async () => {
    if (!newName.trim()) {
      console.error('Workspace name is required');
      return;
    }

    const workspaceData = await createWorkspace(newName);
    if (workspaceData) {
      setWorkspaces([...workspaces, workspaceData]);
      setNewName('');
    } else {
      console.error('Failed to create workspace');
    }
  };

  
  return (
    <div className="bg-cyan-900 min-h-screen p-8">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 text-white">Your Workspaces</h1>

      <div className="mb-6">
        <input
          className="border px-4 py-2 mr-2 text-white border-white rounded bg-transparent"
          placeholder="Workspace name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={createWorkspaceData}
        >
          Create
        </button>
      </div>

      <ul className="space-y-6">
        {workspaces.map((ws) => (
          <li
            key={ws._id}
            className="border border-white p-4 rounded flex flex-col gap-4 bg-cyan-800"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">{ws.name}</h2>
                <p className="text-sm text-gray-300">Created At: {new Date(ws.createdAt).toLocaleString()}</p>
              </div>
              <button
                className="bg-purple-400 border border-white text-white px-4 py-2 rounded"
                onClick={() => router.push(`/workspace/${ws._id}`)}
              >
                Open
              </button>
            </div>
           
          </li>
        ))}
      </ul>

      
    </div>
  );
}
