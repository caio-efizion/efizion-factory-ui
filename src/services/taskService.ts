import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.efizion-factory.com';

export const fetchTasks = async () => {
  const response = await axios.get(`${API_BASE_URL}/tasks`);
  return Array.isArray(response.data) ? response.data : [];
};

export const createTask = async (taskData: any) => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
  return response.data;
};

export const fetchTaskDetail = async (taskId: string) => {
  const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`);
  return response.data;
};

export const fetchTaskLogs = async (taskId: string) => {
  const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}/logs`);
  return response.data;
};