"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const TaskList = ({ tasks, onSelectTask }) => ((0, jsx_runtime_1.jsx)("ul", { children: tasks.map(task => ((0, jsx_runtime_1.jsxs)("li", { onClick: () => onSelectTask && onSelectTask(task.id), children: [task.name, " ", task.status && (0, jsx_runtime_1.jsxs)("span", { children: ["(", task.status, ")"] })] }, task.id))) }));
exports.default = TaskList;
//# sourceMappingURL=TaskList.js.map