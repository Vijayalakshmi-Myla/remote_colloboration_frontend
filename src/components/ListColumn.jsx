'use client';

import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { createTask, updateTask, deleteTask } from '@/lib/api/tasksApi';
import toast from 'react-hot-toast';

export default function ListColumn({ list, dragHandleProps, onDelete }) {
  const [tasks, setTasks] = useState(list.tasks || []);

  useEffect(() => {
    setTasks(list.tasks || []);
  }, [list.tasks]);

  const handleAddTask = async ({ content, assignedTo, status }) => {
    try {
      const task = await createTask(list._id, { content, assignedTo, status });
      console.log("createTask returned:", task); 
      setTasks((prev) => [...prev, task]);
      toast.success('Task created!');
    } catch (err) {
      console.error('Error creating task:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted!');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  };

  const handleUpdateTask = async (taskId, update) => {
    try {
      await updateTask(taskId, update);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, ...update } : t)));
      toast.success('Task updated!');
    } catch (err) {
      console.error('Error updating task:', err.response?.data || err.message || err);
      toast.error('Failed to update task');
    }
  };
  console.log('Rendering tasks for list:', list.name, tasks);


  return (
    <div className="flex flex-col h-full">
      <div
        {...dragHandleProps}
        className="px-3 py-2 bg-blue-500 text-white font-semibold cursor-move rounded-t"
      >
        <div className="flex justify-between items-center">
          <span>{list.name}</span>
          <button
            className="ml-2 text-sm hover:text-gray-200"
            onClick={onDelete}
          >
            ×
          </button>
        </div>
      </div>

      <Droppable droppableId={list._id} type="TASK" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 p-2 space-y-2 overflow-y-auto bg-gray-50"
          >
            {tasks.map((task, idx) => (
              <Draggable key={task._id} draggableId={task._id} index={idx}>
                {(prov) => (
                  <TaskItem
                    task={task}
                    dragProps={prov}
                    onDelete={() => handleDeleteTask(task._id)}
                    onUpdate={(update) => handleUpdateTask(task._id, update)}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="p-2 border-t border-gray-200">
        <TaskForm onSubmit={handleAddTask} placeholder="New task..." />
      </div>
    </div>
  );
}
