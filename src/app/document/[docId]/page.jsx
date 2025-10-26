'use client';

import { useParams } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditorPage() {
  const { docId } = useParams();

  if (!docId) return <p className="p-4 text-red-500">Document ID not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <RichTextEditor docId={docId} />
    </div>
  );
}
