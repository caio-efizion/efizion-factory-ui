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

const TaskList: React.FC<TaskListProps> = ({ tasks, onSelectTask }) => (
  <ul>
    {tasks.map(task => (
      <li key={task.id} onClick={() => onSelectTask && onSelectTask(task.id)}>
        {task.name} {task.status && <span>({task.status})</span>}
      </li>
    ))}
  </ul>
);

export default TaskList;
