"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const taskService_1 = require("../services/taskService");
const TaskList_1 = __importDefault(require("./TaskList"));
const LoadingSpinner_1 = __importDefault(require("./LoadingSpinner"));
const ErrorNotification_1 = __importDefault(require("./ErrorNotification"));
const Dashboard = () => {
    const [tasks, setTasks] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const loadTasks = async () => {
            try {
                const fetchedTasks = await (0, taskService_1.fetchTasks)();
                setTasks(fetchedTasks);
            }
            catch (err) {
                setError('Failed to load tasks. Please try again later.');
            }
            finally {
                setLoading(false);
            }
        };
        loadTasks();
    }, []);
    if (loading) {
        return (0, jsx_runtime_1.jsx)(LoadingSpinner_1.default, {});
    }
    if (error) {
        return (0, jsx_runtime_1.jsx)(ErrorNotification_1.default, { message: error });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Task Dashboard" }), (0, jsx_runtime_1.jsx)(TaskList_1.default, { tasks: tasks })] }));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map