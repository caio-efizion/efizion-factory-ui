import React, { useState } from 'react';
import TaskList from '../src/components/TaskList';

const mockTasks = [
  { id: 1, name: 'Tarefa 1', status: 'pending' },
  { id: 2, name: 'Tarefa 2', status: 'done' },
];

export default function Home() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Efizion Factory UI</h1>
      <TaskList tasks={mockTasks} onSelectTask={id => setSelectedTask(Number(id))} />
      {selectedTask && <p>Tarefa selecionada: {selectedTask}</p>}
    </main>
  );
}
