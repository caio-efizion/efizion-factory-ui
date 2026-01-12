import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.efizion-factory.com';

export const fetchTasks = async () => {
  const apiKey = localStorage.getItem('efizion_api_key') || '';
  const response = await axios.get(`${API_BASE_URL}/tasks`, {
    headers: { 'x-api-key': apiKey },
  });
  return Array.isArray(response.data) ? response.data : [];
};

export const createTask = async (taskData: any) => {
  const apiKey = localStorage.getItem('efizion_api_key') || '';
  const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
    headers: { 'x-api-key': apiKey },
  });
  return response.data;
};

export const fetchTaskDetail = async (taskId: string) => {
  const apiKey = localStorage.getItem('efizion_api_key') || '';
  const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`, {
    headers: { 'x-api-key': apiKey },
  });
  return response.data;
};

export const fetchTaskLogs = async (taskId: string) => {
  const apiKey = localStorage.getItem('efizion_api_key') || '';
  const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}/logs`, {
    headers: { 'x-api-key': apiKey },
  });
  return response.data;
};