'use client';

import { useParams } from 'next/navigation';
import TextEditor from '@/components/TextEditor';

export default function EditorPage() {
  const { docId } = useParams();

  return (
    <div className="p-6">
      <TextEditor docId={docId} />
    </div>
  );
}
