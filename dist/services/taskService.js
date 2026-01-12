"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTaskLogs = exports.fetchTaskDetail = exports.createTask = exports.fetchTasks = void 0;
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.efizion-factory.com';
const fetchTasks = async () => {
    const response = await axios_1.default.get(`${API_BASE_URL}/tasks`);
    return Array.isArray(response.data) ? response.data : [];
};
exports.fetchTasks = fetchTasks;
const createTask = async (taskData) => {
    const response = await axios_1.default.post(`${API_BASE_URL}/tasks`, taskData);
    return response.data;
};
exports.createTask = createTask;
const fetchTaskDetail = async (taskId) => {
    const response = await axios_1.default.get(`${API_BASE_URL}/tasks/${taskId}`);
    return response.data;
};
exports.fetchTaskDetail = fetchTaskDetail;
const fetchTaskLogs = async (taskId) => {
    const response = await axios_1.default.get(`${API_BASE_URL}/tasks/${taskId}/logs`);
    return response.data;
};
exports.fetchTaskLogs = fetchTaskLogs;
//# sourceMappingURL=taskService.js.map