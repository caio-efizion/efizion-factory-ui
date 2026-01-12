"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const taskService_1 = require("../services/taskService");
// import { useHistory } from 'react-router-dom';
const TaskForm = () => {
    const [taskName, setTaskName] = (0, react_1.useState)('');
    const [taskDescription, setTaskDescription] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    // const history = useHistory();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const newTask = {
                name: taskName,
                description: taskDescription,
            };
            await (0, taskService_1.createTask)(newTask);
            setLoading(false);
            // Redirecionamento pode ser feito por navegação externa se necessário
        }
        catch (err) {
            setLoading(false);
            setError('Failed to create task. Please try again.');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "task-form-container", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Create New Task" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "task-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "taskName", children: "Task Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "taskName", value: taskName, onChange: (e) => setTaskName(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "taskDescription", children: "Task Description" }), (0, jsx_runtime_1.jsx)("textarea", { id: "taskDescription", value: taskDescription, onChange: (e) => setTaskDescription(e.target.value), required: true })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, children: loading ? 'Creating...' : 'Create Task' }), error && (0, jsx_runtime_1.jsx)("p", { className: "error-message", children: error })] })] }));
};
exports.default = TaskForm;
//# sourceMappingURL=TaskForm.js.map