import { AxiosInstance } from 'axios';
declare const api: AxiosInstance;
export declare const authenticate: (apiKey: string) => Promise<void>;
export declare const fetchTasks: () => Promise<any>;
export declare const createTask: (taskData: any) => Promise<any>;
export declare const fetchTaskDetails: (taskId: string) => Promise<any>;
export declare const fetchTaskLogs: (taskId: string) => Promise<any>;
export default api;
