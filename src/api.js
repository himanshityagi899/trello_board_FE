import axiosInstance from './axiosConfig'; // Import the axios instance

// API endpoints
const API_BASE = '/api';

export const fetchTasks = () => axiosInstance.get(`${API_BASE}/tasks`);
export const createTask = (task) => axiosInstance.post(`${API_BASE}/tasks`, task);
export const updateTask = (id, task) => axiosInstance.put(`${API_BASE}/tasks/${id}`, task);
export const deleteTask = (id) => axiosInstance.delete(`${API_BASE}/tasks/${id}`);
