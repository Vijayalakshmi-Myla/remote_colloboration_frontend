'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchWorkspace } from '@/lib/api/workspaceApi';
import Navbar from '@/components/Navbar';
import Board from '@/components/Board';
import Sidebar from '@/components/Sidebar';
import Whiteboard from '@/components/Whiteboard';
import VideoCall from '@/components/VideoCall';
import ChatPanel from '@/components/ChatPanel';
import DocumentPanel from '@/components/DocumentPanel';

export default function WorkspacePage() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [activeSection, setActiveSection] = useState('board'); 

  useEffect(() => {
    const load = async () => {
      try {
        const found = await fetchWorkspace(id);
        setWorkspace(found);
      } catch (error) {
        console.error('Failed to load workspace:', error);
      }
    };
    load();
  }, [id]);

  if (!workspace) {
    return (
      <div className="p-8 text-white bg-gray-800 min-h-screen">
        <Navbar />
        <p>Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar stays at top */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar onSelect={setActiveSection} />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-2">{workspace.name}</h1>
          <p className="text-gray-400 mb-4">
            Created at: {new Date(workspace.createdAt).toLocaleString()}
          </p>

          {/* Switchable sections */}
          {activeSection === 'board' && <Board boardId={workspace._id} />}
          {activeSection === 'chat' && <ChatPanel workspaceId={workspace._id} />}
          {activeSection === 'documents' && <DocumentPanel workspaceId={workspace._id} />}
          {activeSection === 'whiteboard' && <Whiteboard boardId={`workspace-${workspace._id}`} />}
          {activeSection === 'video' && <VideoCall workspaceId={workspace._id} />}
        </main>
      </div>
    </div>
  );
}
