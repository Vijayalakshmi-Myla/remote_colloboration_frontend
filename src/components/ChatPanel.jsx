"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import VideoCall from "./VideoCall.jsx";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Plus, X, Send } from "lucide-react";

// Initialize socket once, outside the component
const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
  transports: ["websocket"], 
  withCredentials: true,   
});

console.log("Connecting to Socket.IO at:", process.env.NEXT_PUBLIC_BACKEND_URL);

export default function ChatPanel() {
  const [workspaceId] = useState("workspace-123");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username] = useState("User" + Math.floor(Math.random() * 1000));
  const [isOpen, setIsOpen] = useState(false);
  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviteUser, setInviteUser] = useState("");
  const [inCall, setInCall] = useState(false);

  useEffect(() => {
    // Join workspace room
    socket.emit("joinWorkspace", workspaceId);

    // Load messages from backend
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error loading messages:", err));

    // Listen for new messages
    socket.on("newMessage", (message) =>
      setMessages((prev) => [...prev, message])
    );

    // Listen for call invites
    socket.on("callInvite", ({ from }) => {
      const accept = confirm(`${from} invited you to a video call. Join?`);
      if (accept) setInCall(true);
    });

    // Listen for chat invites
    socket.on("chatInvite", ({ from, workspaceId }) => {
      toast(`${from} invited you to join workspace ${workspaceId}`);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("newMessage");
      socket.off("callInvite");
      socket.off("chatInvite");
    };
  }, [workspaceId]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    socket.emit("sendMessage", { workspaceId, sender: username, message: input });
    setInput("");
  };

  const sendChatInvite = () => {
    if (!inviteUser.trim()) return toast.error("Enter a username or email");
    socket.emit("chatInvite", { workspaceId, to: inviteUser, from: username });
    toast.success(`Invitation sent to ${inviteUser}`);
    setInviteUser("");
    setShowInviteInput(false);
  };

  const startCall = () => {
    socket.emit("callInvite", { workspaceId, from: username });
    setInCall(true);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 font-medium"
        >
          💬 Chat
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="w-96 h-[520px] bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Workspace Chat</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInviteInput((p) => !p)}
                  className="p-1.5 hover:bg-blue-500 rounded-lg"
                  title="Invite to Chat"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={startCall}
                  className="p-1.5 hover:bg-blue-500 rounded-lg"
                  title="Start Video Call"
                >
                  <Video size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-blue-500 rounded-lg"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Invite Input */}
            <AnimatePresence>
              {showInviteInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex p-2 border-b border-gray-200 bg-gray-50"
                >
                  <input
                    type="text"
                    placeholder="Enter username or email..."
                    className="flex-1 px-3 py-2 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={inviteUser}
                    onChange={(e) => setInviteUser(e.target.value)}
                  />
                  <button
                    onClick={sendChatInvite}
                    className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Send
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg._id || Math.random()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                    msg.sender === username
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-xs opacity-80 font-medium mb-1">
                    {msg.sender}
                  </p>
                  <p className="text-sm">{msg.message}</p>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="flex border-t border-gray-200 p-2 bg-white">
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 text-sm"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:from-blue-700 transition"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Call Modal */}
      {inCall && (
        <VideoCall
          roomId={workspaceId}
          userId={username}
          onClose={() => setInCall(false)}
        />
      )}
    </div>
  );
}
