import React from 'react';
interface Task {
    id: string | number;
    name: string;
    status?: string;
}
interface TaskListProps {
    tasks: Task[];
    onSelectTask?: (id: string | number) => void;
}
declare const TaskList: React.FC<TaskListProps>;
export default TaskList;
