"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoCall from "./../../components/VideoCall";

export default function Workspace() {
  const [callOpen, setCallOpen] = useState(false);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Start Call UI */}
      <AnimatePresence>
        {!callOpen && (
          <motion.div
            key="start-call"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm w-full"
          >
            <h1 className="text-3xl font-semibold mb-4 text-gray-800">
              Workspace
            </h1>
            <p className="text-gray-500 mb-6">
              Ready to start your video call?
            </p>
            <button
              onClick={() => setCallOpen(true)}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Start Call
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Call Overlay */}
      <AnimatePresence>
        {callOpen && (
          <motion.div
            key="video-call"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-5xl">
              <VideoCall
                roomId="workspace-123"
                userId="user-456"
                onClose={() => setCallOpen(false)}
              />

              
              <button
                onClick={() => setCallOpen(false)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
