import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define the base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.efizion-factory.com';

// Create an Axios instance with default configurations
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the API key to each request
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const apiKey = localStorage.getItem('API_KEY');
  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle responses and errors
api.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, (error) => {
  if (error.response) {
    // Handle known error responses
    console.error('API Error:', error.response.data);
  } else {
    // Handle network or other errors
    console.error('Network Error:', error.message);
  }
  return Promise.reject(error);
});

// Function to authenticate and store API key
export const authenticate = async (apiKey: string): Promise<void> => {
  try {
    // Test the API key by making a simple request
    const response = await api.get('/auth/validate', {
      headers: { 'x-api-key': apiKey },
    });
    if (response.status === 200) {
      localStorage.setItem('API_KEY', apiKey);
    }
  } catch (error) {
    throw new Error('Invalid API Key');
  }
};

// Function to fetch tasks
export const fetchTasks = async (): Promise<any> => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch tasks');
  }
};

// Function to create a new task
export const createTask = async (taskData: any): Promise<any> => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create task');
  }
};

// Function to fetch task details
export const fetchTaskDetails = async (taskId: string): Promise<any> => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch task details');
  }
};

// Function to fetch task logs
export const fetchTaskLogs = async (taskId: string): Promise<any> => {
  try {
    const response = await api.get(`/tasks/${taskId}/logs`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch task logs');
  }
};

export default api;