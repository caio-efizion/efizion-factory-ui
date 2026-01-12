"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const TaskList_1 = __importDefault(require("../components/TaskList"));
const TaskDetail_1 = __importDefault(require("../components/TaskDetail"));
const TaskForm_1 = __importDefault(require("../components/TaskForm"));
const Loading_1 = require("../components/Loading");
const Error_1 = require("../components/Error");
const HomePage = () => {
    const [apiKey, setApiKey] = (0, react_1.useState)('');
    const [tasks, setTasks] = (0, react_1.useState)([]);
    const [selectedTask, setSelectedTask] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (apiKey) {
            fetchTasks();
        }
    }, [apiKey]);
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await axios_1.default.get('/api/tasks', {
                headers: { 'x-api-key': apiKey },
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
    const handleApiKeySubmit = (key) => {
        setApiKey(key);
    };
    const handleTaskSelect = (id) => {
        const task = tasks.find((t) => t.id === id);
        setSelectedTask(task);
    };
    const handleTaskCreate = async (taskData) => {
        setLoading(true);
        try {
            const response = await axios_1.default.post('/api/tasks', taskData, {
                headers: { 'x-api-key': apiKey },
            });
            setTasks([...tasks, response.data]);
        }
        catch (err) {
            setError('Failed to create task');
        }
        finally {
            setLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("header", { children: (0, jsx_runtime_1.jsx)("h1", { children: "Efizion Factory UI" }) }), (0, jsx_runtime_1.jsx)("main", { children: !apiKey ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Authenticate" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Enter API Key", value: apiKey, onChange: (e) => setApiKey(e.target.value) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleApiKeySubmit(apiKey), children: "Submit" })] })) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(TaskForm_1.default, {}), loading && (0, jsx_runtime_1.jsx)(Loading_1.Loading, {}), error && (0, jsx_runtime_1.jsx)(Error_1.Error, { message: error }), (0, jsx_runtime_1.jsx)(TaskList_1.default, { tasks: tasks, onSelectTask: handleTaskSelect }), selectedTask && (0, jsx_runtime_1.jsx)(TaskDetail_1.default, {})] })) })] }));
};
exports.default = HomePage;
//# sourceMappingURL=index.js.map