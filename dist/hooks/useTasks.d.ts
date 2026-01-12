interface Task {
    id: string;
    name: string;
    status: string;
    logs: string[];
    output: string;
}
interface UseTasksReturn {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    fetchTasks: () => void;
    createTask: (taskData: Partial<Task>) => Promise<void>;
    fetchTaskDetails: (taskId: string) => Promise<Task | null>;
}
declare const useTasks: (apiKey: string) => UseTasksReturn;
export default useTasks;
