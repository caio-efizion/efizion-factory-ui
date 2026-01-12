"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const useTasks = (apiKey) => {
    const [tasks, setTasks] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios_1.default.get('/api/tasks', {
                headers: {
                    'x-api-key': apiKey,
                },
            });
            setTasks(response.data);
        }
        catch (err) {
            setError('Failed to fetch tasks');
        }
        finally {
            setLoading(false);
        }
    };
    const createTask = async (taskData) => {
        setLoading(true);
        setError(null);
        try {
            await axios_1.default.post('/api/tasks', taskData, {
                headers: {
                    'x-api-key': apiKey,
                },
            });
            fetchTasks(); // Refresh task list after creation
        }
        catch (err) {
            setError('Failed to create task');
        }
        finally {
            setLoading(false);
        }
    };
    const fetchTaskDetails = async (taskId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios_1.default.get(`/api/tasks/${taskId}`, {
                headers: {
                    'x-api-key': apiKey,
                },
            });
            return response.data;
        }
        catch (err) {
            setError('Failed to fetch task details');
            return null;
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchTasks();
    }, [apiKey]);
    return {
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        fetchTaskDetails,
    };
};
exports.default = useTasks;
//# sourceMappingURL=useTasks.js.map