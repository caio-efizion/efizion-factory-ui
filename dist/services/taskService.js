"use strict";
// src/services/taskService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.fetchTaskLogs = exports.fetchTaskById = exports.createTask = exports.fetchTasks = exports.authenticate = void 0;
const axios_1 = __importDefault(require("axios"));
// Define the base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.efizion-factory.com';
const API_KEY = process.env.REACT_APP_API_KEY;
// Create an axios instance with default headers
const apiClient = axios_1.default.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
    },
});
// Function to authenticate using the API key
const authenticate = async (apiKey) => {
    try {
        const response = await apiClient.get('/auth', {
            headers: {
                'x-api-key': apiKey,
            },
        });
        return response.data;
    }
    catch (error) {
        throw new Error('Authentication failed. Please check your API key.');
    }
};
exports.authenticate = authenticate;
// Function to fetch all tasks
const fetchTasks = async () => {
    try {
        const response = await apiClient.get('/tasks');
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to fetch tasks.');
    }
};
exports.fetchTasks = fetchTasks;
// Function to create a new task
const createTask = async (taskData) => {
    try {
        const response = await apiClient.post('/tasks', taskData);
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to create task.');
    }
};
exports.createTask = createTask;
// Function to fetch a single task by ID
const fetchTaskById = async (taskId) => {
    try {
        const response = await apiClient.get(`/tasks/${taskId}`);
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to fetch task details.');
    }
};
exports.fetchTaskById = fetchTaskById;
// Function to fetch logs/output for a specific task
const fetchTaskLogs = async (taskId) => {
    try {
        const response = await apiClient.get(`/tasks/${taskId}/logs`);
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to fetch task logs.');
    }
};
exports.fetchTaskLogs = fetchTaskLogs;
// Function to update task status in real-time
const updateTaskStatus = async (taskId, status) => {
    try {
        const response = await apiClient.patch(`/tasks/${taskId}/status`, { status });
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to update task status.');
    }
};
exports.updateTaskStatus = updateTaskStatus;
// Error handling utility
const handleError = (error) => {
    if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Error response:', error.response.data);
    }
    else if (error.request) {
        // Request was made but no response received
        console.error('Error request:', error.request);
    }
    else {
        // Something happened in setting up the request
        console.error('Error message:', error.message);
    }
    throw error;
};
// Export all functions for use in other parts of the application
exports.default = {
    authenticate: exports.authenticate,
    fetchTasks: exports.fetchTasks,
    createTask: exports.createTask,
    fetchTaskById: exports.fetchTaskById,
    fetchTaskLogs: exports.fetchTaskLogs,
    updateTaskStatus: exports.updateTaskStatus,
};
//# sourceMappingURL=taskService.js.map