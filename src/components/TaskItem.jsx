'use client';

import React from 'react';

export default function TaskItem({ task, dragProps, onDelete, onUpdate, isMember = false }) {
  const { content, assignedTo, status } = task;

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    onUpdate({ status: newStatus });
  };

  return (
    <div
      {...dragProps.draggableProps}
      {...dragProps.dragHandleProps}  
      ref={dragProps.innerRef}
      className="bg-white p-3 rounded shadow border border-gray-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-800">{content}</p>

          <div className="mt-2 text-sm text-gray-600">
            <span className="font-semibold">Assigned to:</span>{' '}
            {assignedTo.trim() || 'Unassigned'}
          </div>

          <div className="mt-1 text-sm text-gray-600">
            <span className="font-semibold">Status:</span>{' '}
            {isMember ? (
              <select
                value={status}
                onChange={handleStatusChange}
                className="ml-2 border rounded px-2 py-1 text-sm"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            ) : (
              <span className="ml-2">{status.replace('_', ' ') || 'Unknown'}</span>
            )}
          </div>
        </div>

        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 ml-2 text-sm font-semibold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
