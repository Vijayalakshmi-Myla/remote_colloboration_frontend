'use client';

import React, { useState } from 'react';

export default function TaskForm({
  onSubmit,
  placeholder = 'Enter task content...',
  autoClose = true,
}) {
  const [content, setContent] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('todo');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    const trimmedAssignedTo = assignedTo.trim();

    if (!trimmedContent) return;

    const taskData = {
      content: trimmedContent,
      assignedTo: trimmedAssignedTo || null,
      status,
    };

    console.log('🚀 Submitting:', taskData);
    onSubmit(taskData);

    // Clear form
    setContent('');
    setAssignedTo('');
    setStatus('todo');

    if (autoClose) {
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setContent('');
    setAssignedTo('');
    setStatus('todo');
  };

  return (
    <div className="mt-2">
      {isOpen ? (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <input
            type="text"
            className="px-2 py-1 border text-black rounded focus:outline-none"
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />

          <input
            type="text"
            className="px-2 py-1 border text-black rounded focus:outline-none"
            placeholder="Assign to (e.g. Alice)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />

          <select
            className="px-2 py-1 border text-black rounded focus:outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">To-Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Add Task
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Add Task
        </button>
      )}
    </div>
  );
}
