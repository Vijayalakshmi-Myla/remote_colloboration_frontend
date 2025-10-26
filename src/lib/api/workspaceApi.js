import axios from './axiosInstance'; 

// Create a new workspace
export const createWorkspace = async (name) => {
  const res = await axios.post('/api/workspaces/create', { name });
  return res.data;
};

// Join a workspace by ID
export const joinWorkspace = async (workspaceId) => {
  const res = await axios.post(`/api/workspaces/join/${workspaceId}`);
  return res.data;
};

// Get all workspaces for current user
export const getUserWorkspaces = async () => {
  const res = await axios.get('/api/workspaces');
  return res.data;
};

// Fetch individual workspace
export const fetchWorkspace = async (workspaceId) => {
  try {
    const res = await axios.get(`/api/workspaces/${workspaceId}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching workspace:', err.response?.data || err.message);
    throw err;
  }
};

// Invite user to workspace by email
export const inviteUserToWorkspace = async (workspaceId, email) => {
  const res = await axios.post(`/api/workspaces/${workspaceId}/invite`, { email });
  return res.data;
};

// Accept invitation to a workspace
export const acceptWorkspaceInvite = async (workspaceId) => {
  const res = await axios.post(`/api/workspaces/${workspaceId}/accept`);
  return res.data;
};

// Fetch pending invites for a workspace
export const fetchPendingInvites = async (workspaceId) => {
  const res = await axios.get(`/api/workspaces/${workspaceId}/invites`);
  return res.data.pendingInvites;
};
