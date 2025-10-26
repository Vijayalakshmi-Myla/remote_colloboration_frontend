import axios from './axiosInstance';

const API_URL = '/api/members'; 

export const getMembers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addMember = async (email) => {
  const res = await axios.post(API_URL, { email });
  return res.data;
};

export const removeMember = async (memberId) => {
  await axios.delete(`${API_URL}/${memberId}`);
};
