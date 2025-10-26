'use client';

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

export default function VideoCall({ roomId, userId, onClose }) {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [stream, setStream] = useState();

  useEffect(() => {
    if (!roomId || !userId) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
      userVideo.current.srcObject = currentStream;

      socketRef.current.emit('join-room', { roomId, userId });

      socketRef.current.on('user-joined', ({ socketId }) => {
        const peer = createPeer(socketId, socketRef.current.id, currentStream);
        peersRef.current.push({ peerId: socketId, peer });
        setPeers([...peersRef.current.map((p) => p.peer)]);
      });

      socketRef.current.on('signal', ({ from, signal }) => {
        const item = peersRef.current.find((p) => p.peerId === from);
        if (item) item.peer.signal(signal);
      });

      socketRef.current.on('user-left', ({ socketId }) => {
        const item = peersRef.current.find((p) => p.peerId === socketId);
        if (item) {
          item.peer.destroy();
          peersRef.current = peersRef.current.filter((p) => p.peerId !== socketId);
          setPeers(peersRef.current.map((p) => p.peer));
        }
      });
    });

    return () => {
      peersRef.current.forEach((p) => p.peer.destroy());
      socketRef.current.disconnect();
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [roomId, userId]);

  function createPeer(userToSignal, callerId, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on('signal', (signal) => {
      socketRef.current.emit('signal', { targetId: userToSignal, signal });
    });
    return peer;
  }

  const toggleAudio = () => {
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
  };

  const toggleVideo = () => {
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
  };

  return (
    <div className="fixed bottom-4 right-4 w-[500px] bg-white shadow-lg rounded-lg p-4 z-50">
      <h2 className="text-lg font-bold mb-2">Workspace Call</h2>
      <div className="flex flex-wrap gap-2">
        <video ref={userVideo} autoPlay muted className="w-32 h-32 bg-black rounded" />
        {peers.map((peer, index) => (
          <PeerVideo key={index} peer={peer} />
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <button onClick={toggleAudio} className="px-2 py-1 bg-blue-500 text-white rounded">Mute/Unmute</button>
        <button onClick={toggleVideo} className="px-2 py-1 bg-blue-500 text-white rounded">Camera On/Off</button>
        <button onClick={onClose} className="px-2 py-1 bg-red-500 text-white rounded">Leave Call</button>
      </div>
    </div>
  );
}

function PeerVideo({ peer }) {
  const ref = useRef();
  useEffect(() => {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <video ref={ref} autoPlay className="w-32 h-32 bg-black rounded" />;
}
