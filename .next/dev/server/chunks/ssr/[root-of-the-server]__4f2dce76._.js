module.exports = [
"[project]/efizion-factory-ui/src/components/TaskList.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
const TaskList = ({ tasks, onSelectTask })=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].createElement("ul", null, tasks.map((task)=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].createElement("li", {
            key: task.id,
            onClick: ()=>onSelectTask && onSelectTask(task.id)
        }, task.name, " ", task.status && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].createElement("span", null, "(", task.status, ")"))));
const __TURBOPACK__default__export__ = TaskList;
}),
"[project]/efizion-factory-ui/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$TaskList$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/src/components/TaskList.tsx [ssr] (ecmascript)");
;
;
const mockTasks = [
    {
        id: 1,
        name: 'Tarefa 1',
        status: 'pending'
    },
    {
        id: 2,
        name: 'Tarefa 2',
        status: 'done'
    }
];
function Home() {
    const [selectedTask, setSelectedTask] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].createElement("main", {
        style: {
            padding: 32,
            fontFamily: 'sans-serif'
        }
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].createElement("h1", null, "Efizion Factory UI"), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$TaskList$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        tasks: mockTasks,
        onSelectTask: (id)=>setSelectedTask(Number(id))
    }), selectedTask && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].createElement("p", null, "Tarefa selecionada: ", selectedTask));
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4f2dce76._.js.map