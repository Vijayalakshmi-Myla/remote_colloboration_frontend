import axios from './axiosInstance';

// Fetch all lists for a specific board
export const fetchLists = async (boardId) => {
  try {
    const res = await axios.get(`/api/lists/boards/${boardId}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching lists:', err.response.data || err.message);
    throw err;
  }
};

// Create a new list in a board
export const createList = async (boardId, name) => {
  try {
    const res = await axios.post(`/api/lists/boards/${boardId}`, { name });
    return res.data;
  } catch (err) {
    console.error('Error creating list:', err.response.data || err.message);
    throw err;
  }
};

// Update a list by ID
export const updateList = async (listId, updatedData) => {
  try {
    const res = await axios.put(`/api/lists/${listId}`, updatedData);
    return res.data;
  } catch (err) {
    console.error('Error updating list:', err.response.data || err.message);
    throw err;
  }
};

// Delete a list by ID
export const deleteList = async (listId) => {
  try {
    const res = await axios.delete(`/api/lists/${listId}`);
    return res.data;
  } catch (err) {
    console.error('Error deleting list:', err.response.data || err.message);
    throw err;
  }
};
