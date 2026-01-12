"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const taskService_1 = require("../services/taskService");
const LoadingSpinner_1 = __importDefault(require("./LoadingSpinner"));
const ErrorBanner_1 = __importDefault(require("./ErrorBanner"));
const TaskDetail = () => {
    const { taskId } = (0, react_router_dom_1.useParams)();
    const [task, setTask] = (0, react_1.useState)(null);
    const [logs, setLogs] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const loadTaskDetail = async () => {
            if (!taskId) {
                setError('No task ID provided.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const taskDetail = await (0, taskService_1.fetchTaskDetail)(taskId);
                setTask(taskDetail);
                const taskLogs = await (0, taskService_1.fetchTaskLogs)(taskId);
                setLogs(taskLogs);
            }
            catch (err) {
                setError('Failed to load task details. Please try again later.');
            }
            finally {
                setLoading(false);
            }
        };
        loadTaskDetail();
    }, [taskId]);
    if (loading) {
        return (0, jsx_runtime_1.jsx)(LoadingSpinner_1.default, {});
    }
    if (error) {
        return (0, jsx_runtime_1.jsx)(ErrorBanner_1.default, { message: error });
    }
    if (!task) {
        return (0, jsx_runtime_1.jsx)("div", { children: "No task found." });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "task-detail", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Task Detail" }), (0, jsx_runtime_1.jsxs)("div", { className: "task-info", children: [(0, jsx_runtime_1.jsx)("h2", { children: task.name }), (0, jsx_runtime_1.jsxs)("p", { children: ["Status: ", task.status] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "task-logs", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Logs" }), logs.length > 0 ? ((0, jsx_runtime_1.jsx)("ul", { children: logs.map((log) => ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("p", { children: log.message }), (0, jsx_runtime_1.jsx)("p", { children: new Date(log.timestamp).toLocaleString() })] }, log.id))) })) : ((0, jsx_runtime_1.jsx)("p", { children: "No logs available for this task." }))] })] }));
};
exports.default = TaskDetail;
//# sourceMappingURL=TaskDetail.js.map