"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const useAuth_1 = require("../../hooks/useAuth");
const LoadingSpinner_1 = __importDefault(require("../../components/LoadingSpinner"));
const ErrorMessage_1 = __importDefault(require("../../components/ErrorMessage"));
const TaskDetailPage = () => {
    const { apiKey } = (0, useAuth_1.useAuth)();
    const { id } = (0, react_router_dom_1.useParams)();
    const [task, setTask] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (!id || !apiKey)
            return;
        const fetchTaskDetails = async () => {
            try {
                setLoading(true);
                const response = await axios_1.default.get(`${config_1.API_BASE_URL}/tasks/${id}`, {
                    headers: {
                        'x-api-key': apiKey,
                    },
                });
                setTask(response.data);
            }
            catch (err) {
                setError('Failed to load task details.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchTaskDetails();
    }, [id, apiKey]);
    if (loading)
        return (0, jsx_runtime_1.jsx)(LoadingSpinner_1.default, {});
    if (error)
        return (0, jsx_runtime_1.jsx)(ErrorMessage_1.default, { message: error });
    if (!task)
        return (0, jsx_runtime_1.jsx)("div", { children: "No task found." });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "task-detail-page", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Task Details" }), (0, jsx_runtime_1.jsx)("pre", { children: JSON.stringify(task, null, 2) })] }));
};
exports.default = TaskDetailPage;
//# sourceMappingURL=%5Bid%5D.js.map