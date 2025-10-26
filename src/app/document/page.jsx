'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import {
  listDocuments,
  createDocument,
  deleteDocument,
} from '@/lib/api/documentsApi';
import DocumentPanel from '@/components/DocumentPanel';
import toast from 'react-hot-toast';

export default function DocumentsBoard() {
  const [documents, setDocuments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await listDocuments();
      setDocuments(data || []);
    } catch (err) {
      toast.error('Failed to load documents');
    }
  };

  const handleNewDocument = async () => {
    const newDocId = uuidv4();
    try {
      const doc = await createDocument('Untitled', newDocId);
      if (doc) {
        setDocuments(prev => [...prev, doc]);
        router.push(`/document/${doc.documentId}`);
      }
      toast.success('New document created');
    } catch {
      toast.error('Failed to create document');
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(documentId);
      setDocuments(prev => prev.filter(d => d.documentId !== documentId));
      toast.success('Document deleted');
    } catch {
      toast.error('Failed to delete document');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold">My Documents</h1>
        <button
          onClick={handleNewDocument}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + New Document
        </button>
      </div>

      {documents.length === 0 && (
        <p className="text-gray-500">No documents yet. Create one to get started!</p>
      )}

      <div className="space-y-2">
        {documents.map(doc => (
          <DocumentPanel
            key={doc.documentId}
            document={doc}
            onEdit={() => router.push(`/document/${doc.documentId}`)}
            onDelete={() => handleDelete(doc.documentId)}
          />
        ))}
      </div>
    </div>
  );
}
