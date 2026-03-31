import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getStudents = () => axios.get(`${API_URL}/students`);

export const uploadFile = (formData) =>
  axios.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getNotifications = () =>
  axios.get(`${API_URL}/notifications`);
