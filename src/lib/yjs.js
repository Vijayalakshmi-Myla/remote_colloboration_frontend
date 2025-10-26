import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export function initYDoc(docId) {
  const ydoc = new Y.Doc();

  const wsUrl =
    (process.env.NEXT_PUBLIC_BACKEND_URL) + '/' + docId;

  const provider = new WebsocketProvider(wsUrl, docId, ydoc);

  const awareness = provider.awareness;

  return { ydoc, provider, awareness };
}
