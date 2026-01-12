"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const taskService_1 = require("../services/taskService");
const TaskList_1 = __importDefault(require("../components/TaskList"));
const TaskForm_1 = __importDefault(require("../components/TaskForm"));
const LoadingSpinner_1 = __importDefault(require("../components/LoadingSpinner"));
const ErrorNotification_1 = __importDefault(require("../components/ErrorNotification"));
const Dashboard = () => {
    const [tasks, setTasks] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        const fetchTasks = async () => {
            try {
                const data = await fetchTasks();
                if (Array.isArray(data)) {
                    setTasks(data);
                }
                else {
                    setTasks([]);
                }
            }
            catch (err) {
                setError('Failed to fetch tasks');
            }
            finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);
    const handleCreateTask = async (taskData) => {
        try {
            setLoading(true);
            const newTask = await (0, taskService_1.createTask)(taskData);
            setTasks([...tasks, newTask]);
        }
        catch (err) {
            setError('Failed to create task');
        }
        finally {
            setLoading(false);
        }
    };
    const handleTaskClick = (id) => {
        navigate(`/tasks/${id}`);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Task Dashboard" }), loading && (0, jsx_runtime_1.jsx)(LoadingSpinner_1.default, {}), error && (0, jsx_runtime_1.jsx)(ErrorNotification_1.default, { message: error }), (0, jsx_runtime_1.jsx)(TaskForm_1.default, {}), (0, jsx_runtime_1.jsx)(TaskList_1.default, { tasks: tasks, onSelectTask: handleTaskClick })] }));
};
exports.default = Dashboard;
//# sourceMappingURL=dashboard.js.map