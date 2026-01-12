"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTaskLogs = exports.fetchTaskDetails = exports.createTask = exports.fetchTasks = exports.authenticate = void 0;
const axios_1 = __importDefault(require("axios"));
// Define the base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.efizion-factory.com';
// Create an Axios instance with default configurations
const api = axios_1.default.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Interceptor to add the API key to each request
api.interceptors.request.use((config) => {
    const apiKey = localStorage.getItem('API_KEY');
    if (apiKey) {
        config.headers['x-api-key'] = apiKey;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Interceptor to handle responses and errors
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        // Handle known error responses
        console.error('API Error:', error.response.data);
    }
    else {
        // Handle network or other errors
        console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
});
// Function to authenticate and store API key
const authenticate = async (apiKey) => {
    try {
        // Test the API key by making a simple request
        const response = await api.get('/auth/validate', {
            headers: { 'x-api-key': apiKey },
        });
        if (response.status === 200) {
            localStorage.setItem('API_KEY', apiKey);
        }
    }
    catch (error) {
        throw new Error('Invalid API Key');
    }
};
exports.authenticate = authenticate;
// Function to fetch tasks
const fetchTasks = async () => {
    try {
        const response = await api.get('/tasks');
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to fetch tasks');
    }
};
exports.fetchTasks = fetchTasks;
// Function to create a new task
const createTask = async (taskData) => {
    try {
        const response = await api.post('/tasks', taskData);
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to create task');
    }
};
exports.createTask = createTask;
// Function to fetch task details
const fetchTaskDetails = async (taskId) => {
    try {
        const response = await api.get(`/tasks/${taskId}`);
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to fetch task details');
    }
};
exports.fetchTaskDetails = fetchTaskDetails;
// Function to fetch task logs
const fetchTaskLogs = async (taskId) => {
    try {
        const response = await api.get(`/tasks/${taskId}/logs`);
        return response.data;
    }
    catch (error) {
        throw new Error('Failed to fetch task logs');
    }
};
exports.fetchTaskLogs = fetchTaskLogs;
exports.default = api;
//# sourceMappingURL=api.js.map