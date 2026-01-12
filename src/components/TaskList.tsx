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
  <ul aria-label="Lista de tarefas">
    {tasks.map(task => (
      <li
        key={task.id}
        onClick={() => onSelectTask && onSelectTask(task.id)}
        tabIndex={0}
        aria-label={`Selecionar tarefa ${task.name}`}
        style={{ cursor: 'pointer', padding: '8px 0', color: '#1976d2', outline: 'none' }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelectTask && onSelectTask(task.id);
          }
        }}
      >
        {task.name} {task.status && <span style={{ color: '#388e3c' }}>({task.status})</span>}
      </li>
    ))}
  </ul>
);

export default TaskList;
