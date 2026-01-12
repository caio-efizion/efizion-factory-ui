// src/services/taskService.ts

import axios from 'axios';

// Define the base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.efizion-factory.com';
const API_KEY = process.env.REACT_APP_API_KEY;

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

// Function to authenticate using the API key
export const authenticate = async (apiKey: string) => {
  try {
    const response = await apiClient.get('/auth', {
      headers: {
        'x-api-key': apiKey,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Authentication failed. Please check your API key.');
  }
};

// Function to fetch all tasks
export const fetchTasks = async () => {
  try {
    const response = await apiClient.get('/tasks');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch tasks.');
  }
};

// Function to create a new task
export const createTask = async (taskData: any) => {
  try {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create task.');
  }
};

// Function to fetch a single task by ID
export const fetchTaskById = async (taskId: string) => {
  try {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch task details.');
  }
};

// Function to fetch logs/output for a specific task
export const fetchTaskLogs = async (taskId: string) => {
  try {
    const response = await apiClient.get(`/tasks/${taskId}/logs`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch task logs.');
  }
};

// Function to update task status in real-time
export const updateTaskStatus = async (taskId: string, status: string) => {
  try {
    const response = await apiClient.patch(`/tasks/${taskId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update task status.');
  }
};

// Error handling utility
const handleError = (error: any) => {
  if (error.response) {
    // Server responded with a status other than 200 range
    console.error('Error response:', error.response.data);
  } else if (error.request) {
    // Request was made but no response received
    console.error('Error request:', error.request);
  } else {
    // Something happened in setting up the request
    console.error('Error message:', error.message);
  }
  throw error;
};

// Export all functions for use in other parts of the application
export default {
  authenticate,
  fetchTasks,
  createTask,
  fetchTaskById,
  fetchTaskLogs,
  updateTaskStatus,
};