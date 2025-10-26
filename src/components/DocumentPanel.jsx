'use client';

import React, { useState } from 'react';
import ShareModal from './ShareModal';

export default function DocumentPanel({ document, onEdit, onDelete }) {
  const [showShare, setShowShare] = useState(false);

  if (!document) return null;

  return (
    <div className="flex justify-between items-center p-3 border rounded bg-gray-50 hover:shadow-sm transition">
      <div>
        <h3 className="font-semibold">{document?.title || 'Untitled Document'}</h3>
        <p className="text-gray-500 text-sm">
          Owner: {document?.owner?.name || 'You'}
        </p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Edit
        </button>

        <button
          onClick={() => setShowShare(true)}
          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Share
        </button>

        <button
          onClick={onDelete}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>

      {showShare && (
        <ShareModal document={document} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
