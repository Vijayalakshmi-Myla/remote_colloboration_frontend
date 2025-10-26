import axios from './axiosInstance';


export const listDocuments = async () => 
    (await axios.get('/api/documents')).data;


export const createDocument = async (title, documentId) => 
    (await axios.post('/api/documents', { title, documentId })).data;


export const getDocument = async (documentId) => 
    (await axios.get(`/api/documents/${documentId}`)).data;


export const updateDocument = async (documentId, payload) => 
    (await axios.put(`/api/documents/${documentId}`, payload)).data;


export const deleteDocument = async (documentId) => 
    (await axios.delete(`/api/documents/${documentId}`)).data;

export const shareDocument = async (documentId, data) =>
  (await axios.post(`/api/documents/${documentId}/share`, data)).data;

export const getSharedUsers = async (documentId) =>
  (await axios.get(`/api/documents/${documentId}/shared-users`)).data;

export const checkPermission = async (documentId, userId) =>
  (await axios.get(`/api/documents/${documentId}/permission/${userId}`)).data;


