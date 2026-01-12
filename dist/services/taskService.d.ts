export declare const authenticate: (apiKey: string) => Promise<any>;
export declare const fetchTasks: () => Promise<any>;
export declare const createTask: (taskData: any) => Promise<any>;
export declare const fetchTaskById: (taskId: string) => Promise<any>;
export declare const fetchTaskLogs: (taskId: string) => Promise<any>;
export declare const updateTaskStatus: (taskId: string, status: string) => Promise<any>;
declare const _default: {
    authenticate: (apiKey: string) => Promise<any>;
    fetchTasks: () => Promise<any>;
    createTask: (taskData: any) => Promise<any>;
    fetchTaskById: (taskId: string) => Promise<any>;
    fetchTaskLogs: (taskId: string) => Promise<any>;
    updateTaskStatus: (taskId: string, status: string) => Promise<any>;
};
export default _default;
