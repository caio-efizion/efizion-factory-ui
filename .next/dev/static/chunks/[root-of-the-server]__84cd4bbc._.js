(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/efizion-factory-ui/src/components/layout/Header.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$AppBar$2f$AppBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/AppBar/AppBar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Toolbar$2f$Toolbar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Toolbar/Toolbar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Typography/Typography.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/IconButton/IconButton.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Menu$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/icons-material/esm/Menu.js [client] (ecmascript)");
;
;
;
;
;
;
function Header() {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$AppBar$2f$AppBar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        position: "static",
        color: "primary",
        sx: {
            bgcolor: '#212121'
        }
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Toolbar$2f$Toolbar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        edge: "start",
        color: "inherit",
        "aria-label": "Abrir menu de navega\xE7\xE3o",
        sx: {
            mr: 2
        },
        tabIndex: 0
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Menu$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], null)), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        variant: "h6",
        component: "div",
        sx: {
            flexGrow: 1,
            color: '#fff'
        },
        tabIndex: 0,
        "aria-label": "T\xEDtulo do painel Efizion Factory UI"
    }, "Efizion Factory UI")));
}
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/efizion-factory-ui/src/components/layout/Sidebar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Drawer$2f$Drawer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Drawer/Drawer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$List$2f$List$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/List/List.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItem$2f$ListItem$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/ListItem/ListItem.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Button/Button.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Dashboard$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/icons-material/esm/Dashboard.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Assignment$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/icons-material/esm/Assignment.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Settings$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/icons-material/esm/Settings.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/next/link.js [client] (ecmascript)");
;
;
;
;
;
;
;
;
;
const menuItems = [
    {
        text: 'Home',
        icon: /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Dashboard$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], null),
        href: '/'
    },
    {
        text: 'Dashboard',
        icon: /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Dashboard$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], null),
        href: '/dashboard'
    },
    {
        text: 'Tarefas',
        icon: /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Assignment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], null),
        href: '/tasks'
    },
    {
        text: 'Configurações',
        icon: /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Settings$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], null),
        href: '/settings'
    }
];
function Sidebar() {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Drawer$2f$Drawer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        variant: "permanent",
        anchor: "left",
        sx: {
            bgcolor: '#212121'
        }
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$List$2f$List$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        "aria-label": "Menu de navega\xE7\xE3o lateral"
    }, menuItems.map((item)=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$ListItem$2f$ListItem$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            key: item.text,
            disablePadding: true
        }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: item.href,
            passHref: true,
            legacyBehavior: undefined
        }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            startIcon: item.icon,
            fullWidth: true,
            sx: {
                justifyContent: 'flex-start',
                textTransform: 'none',
                padding: '16px',
                color: '#fff',
                bgcolor: '#212121',
                '&:focus': {
                    outline: '2px solid #1976d2'
                }
            },
            "aria-label": `Ir para ${item.text}`,
            tabIndex: 0
        }, item.text))))));
}
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/efizion-factory-ui/src/components/layout/Main.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Main
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Box/Box.js [client] (ecmascript)");
;
;
function Main({ children }) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        component: "main",
        sx: {
            flexGrow: 1,
            p: 3,
            marginLeft: '240px'
        }
    }, children);
}
_c = Main;
var _c;
__turbopack_context__.k.register(_c, "Main");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/efizion-factory-ui/src/components/StatusBadge.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Chip/Chip.js [client] (ecmascript)");
;
;
function StatusBadge({ status }) {
    let color = 'default';
    switch(status){
        case 'done':
            color = 'success';
            break;
        case 'pending':
            color = 'warning';
            break;
        case 'error':
            color = 'error';
            break;
        default:
            color = 'default';
    }
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Chip$2f$Chip$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        label: status || 'Indefinido',
        color: color,
        size: "small",
        "aria-label": `Status da tarefa: ${status || 'Indefinido'}`,
        tabIndex: 0,
        sx: {
            bgcolor: color === 'success' ? '#388e3c' : color === 'error' ? '#d32f2f' : color === 'warning' ? '#fbc02d' : '#757575',
            color: '#fff'
        }
    });
}
_c = StatusBadge;
var _c;
__turbopack_context__.k.register(_c, "StatusBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/efizion-factory-ui/src/components/TaskCard.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TaskCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Card$2f$Card$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Card/Card.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CardContent$2f$CardContent$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/CardContent/CardContent.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Typography/Typography.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Button/Button.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$StatusBadge$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/src/components/StatusBadge.tsx [client] (ecmascript)");
;
;
;
;
;
;
function TaskCard({ id, name, status, onSelect }) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Card$2f$Card$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            mb: 2
        }
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CardContent$2f$CardContent$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        variant: "h6"
    }, name), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$StatusBadge$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        status: status
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        variant: "contained",
        sx: {
            mt: 1,
            bgcolor: '#1976d2',
            color: '#fff',
            '&:focus': {
                outline: '2px solid #1976d2'
            }
        },
        onClick: ()=>onSelect && onSelect(id),
        "aria-label": `Ver detalhes da tarefa ${name}`,
        tabIndex: 0
    }, "Ver detalhes")));
}
_c = TaskCard;
var _c;
__turbopack_context__.k.register(_c, "TaskCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/efizion-factory-ui/src/components/LoadingOverlay.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoadingOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/CircularProgress/CircularProgress.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Box/Box.js [client] (ecmascript)");
;
;
;
function LoadingOverlay() {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200
        }
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], null));
}
_c = LoadingOverlay;
var _c;
__turbopack_context__.k.register(_c, "LoadingOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/efizion-factory-ui/pages/index.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Box/Box.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/CssBaseline/CssBaseline.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Container$2f$Container$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Container/Container.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Typography/Typography.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Alert$2f$Alert$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/Alert/Alert.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/styles/ThemeProvider.js [client] (ecmascript) <export default as ThemeProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__ = __turbopack_context__.i("[project]/efizion-factory-ui/node_modules/@mui/material/esm/styles/createTheme.js [client] (ecmascript) <export default as createTheme>");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/src/components/layout/Header.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/src/components/layout/Sidebar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$layout$2f$Main$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/src/components/layout/Main.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$TaskCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/src/components/TaskCard.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$LoadingOverlay$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/src/components/LoadingOverlay.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$StatusBadge$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/efizion-factory-ui/src/components/StatusBadge.tsx [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
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
    },
    {
        id: 3,
        name: 'Tarefa 3',
        status: 'error'
    }
];
const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__["createTheme"])({
    palette: {
        primary: {
            main: '#1976d2'
        },
        secondary: {
            main: '#ef6c00'
        }
    }
});
function Home() {
    _s();
    const [selectedTask, setSelectedTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Mock loading and error for demo
    // setLoading(true); setTimeout(() => setLoading(false), 1000);
    // setError('Erro ao carregar tarefas');
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__["ThemeProvider"], {
        theme: theme
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], null), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], null), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], null), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$layout$2f$Main$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Container$2f$Container$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        maxWidth: "md"
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        variant: "h4",
        sx: {
            mb: 2
        }
    }, "Efizion Factory UI"), loading && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$LoadingOverlay$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], null), error && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Alert$2f$Alert$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        severity: "error"
    }, error), !loading && !error && mockTasks.length === 0 && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Alert$2f$Alert$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        severity: "info"
    }, "Nenhuma tarefa encontrada."), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }
    }, mockTasks.map((task)=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$TaskCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            key: task.id,
            id: task.id,
            name: task.name,
            status: task.status,
            onSelect: setSelectedTask
        }))), selectedTask && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        sx: {
            mt: 3
        }
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        variant: "subtitle1"
    }, "Tarefa selecionada: ", selectedTask), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$efizion$2d$factory$2d$ui$2f$src$2f$components$2f$StatusBadge$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        status: mockTasks.find((t)=>t.id === selectedTask)?.status
    })))));
}
_s(Home, "7XbhS46nB9ALkG77PaQV5IB4Oq0=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/efizion-factory-ui/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/efizion-factory-ui/pages/index.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/efizion-factory-ui/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/efizion-factory-ui/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__84cd4bbc._.js.map