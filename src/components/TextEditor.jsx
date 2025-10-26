'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import ShareModal from './ShareModal';

export default function TextEditor({ docId }) {
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold">Document Editor</h2>
        <button
          onClick={() => setShowShare(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Share
        </button>
      </div>

      <RichTextEditor docId={docId} />

      {showShare && <ShareModal docId={docId} onClose={() => setShowShare(false)} />}
    </div>
  );
}
