import axios from './axiosInstance';

// Create a new task
export const createTask = async (listId, taskData) => {
  try {
    const res = await axios.post(`/api/tasks/${listId}`, {
      ...taskData,
      content: taskData.content,
      status: taskData.status || 'todo', 
      assignedTo: taskData.assignedTo || null
    });
    return res.data;
  } catch (err) {
    console.error('Error creating task:', err.response?.data || err.message);
    throw err;
  }
};

// Update an existing task
export const updateTask = async (taskId, updatedData) => {
  try {
    const res = await axios.put(`/api/tasks/${taskId}`, updatedData);
    return res.data;
  } catch (err) {
    console.error('Error updating task:', err.response.data || err.message);
    throw err;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const res = await axios.delete(`/api/tasks/${taskId}`);
    return res.data;
  } catch (err) {
    console.error('Error deleting task:', err.response.data || err.message);
    throw err;
  }
};
