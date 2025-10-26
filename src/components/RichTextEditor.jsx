'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebsocketProvider } from 'y-websocket';
import {
  updateDocument,
  getDocument,
  createDocument,
  deleteDocument,
} from '@/lib/api/documentsApi';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RichTextEditor({ docId }) {
  const editorRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(docId);
  const [title, setTitle] = useState('Untitled');
  const saveIntervalRef = useRef(null);
  const router = useRouter();

  // Initialize Yjs + Quill
  useEffect(() => {
    if (!currentDocId || !editorRef.current) return;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_BACKEND_URL,
      currentDocId,
      ydoc
    );
    const ytext = ydoc.getText('quill');

    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      },
    });

    const binding = new QuillBinding(ytext, quill, provider.awareness);

    // Load content
    (async () => {
      try {
        const doc = await getDocument(currentDocId);
        if (doc) {
          setTitle(doc.title || 'Untitled');
          if (doc.content) {
            const delta =
              typeof doc.content === 'string' ? JSON.parse(doc.content) : doc.content;
            quill.setContents(delta);
          }
        }
      } catch (err) {
        console.error('Failed to load document:', err);
      }
    })();

    provider.on('status', (event) => setConnected(event.status === 'connected'));

    // Auto-save every 5 sec
    saveIntervalRef.current = setInterval(async () => {
      if (!currentDocId) return;
      try {
        const content = quill.getContents();
        await updateDocument(currentDocId, { title, content });
      } catch (err) {
        console.error('Error saving document:', err);
      }
    }, 5000);

    return () => {
      clearInterval(saveIntervalRef.current);
      binding.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, [currentDocId]);

  // Manual Save
  const handleSave = async () => {
    if (!currentDocId) return;
    try {
      const quill = editorRef.current.__quill;
      const content = quill.getContents();
      await updateDocument(currentDocId, { title, content });
      toast.success('Document saved');
    } catch (err) {
      toast.error('Failed to save document');
    }
  };

  // Create new document
  const handleCreate = async () => {
    try {
      const newDocId = uuidv4();
      await createDocument('Untitled', newDocId);
      setCurrentDocId(newDocId);
      router.push(`/document/${newDocId}`);
      toast.success('New document created');
    } catch {
      toast.error('Failed to create document');
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-2 space-x-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 rounded flex-1"
          placeholder="Document title..."
        />
        <button
          onClick={handleCreate}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save
        </button>
      </div>
      <div
        ref={editorRef}
        style={{ height: '80vh', backgroundColor: 'white', marginTop: '8px' }}
      />
      <div className="mt-2 text-sm text-gray-500">
        Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
    </div>
  );
}
