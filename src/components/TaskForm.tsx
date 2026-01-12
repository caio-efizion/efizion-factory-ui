import React, { useState } from 'react';
import { createTask } from '../services/taskService';
import { Task } from '../types';
// import { useHistory } from 'react-router-dom';

const TaskForm: React.FC = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validação: description deve conter URL do GitHub
    const repoRegex = /(https:\/\/github\.com\/[\w\-]+\/[\w\-\.]+)/i;
    if (!repoRegex.test(taskDescription)) {
      setError('A descrição deve conter uma URL válida do repositório GitHub.');
      setLoading(false);
      return;
    }

    try {
      const newTask = {
        title: taskTitle,
        description: taskDescription,
      };
      await createTask(newTask);
      setSuccess('Tarefa criada com sucesso!');
      setTaskTitle('');
      setTaskDescription('');
    } catch (err) {
      setError('Falha ao criar tarefa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Criar Nova Tarefa</h2>
      <form onSubmit={handleSubmit} className="task-form" aria-label="Formulário de criação de tarefa">
        <div className="form-group">
          <label htmlFor="taskTitle">Título da Tarefa</label>
          <input
            type="text"
            id="taskTitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
            aria-label="Título da Tarefa"
            tabIndex={0}
            style={{ border: '1px solid #1976d2', borderRadius: 4, padding: 8, outline: 'none' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="taskDescription">Descrição (inclua a URL do repositório GitHub)</label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
            aria-label="Descrição da Tarefa"
            tabIndex={0}
            placeholder="Ex: Deploy microservice https://github.com/org/repo"
            style={{ border: '1px solid #1976d2', borderRadius: 4, padding: 8, outline: 'none', minHeight: 60 }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          aria-label="Criar Tarefa"
          tabIndex={0}
          style={{ background: '#1976d2', color: '#fff', borderRadius: 4, padding: '8px 16px', marginTop: 8, cursor: 'pointer', outline: 'none' }}
        >
          {loading ? 'Criando...' : 'Criar Tarefa'}
        </button>
        {error && <p className="error-message" style={{ color: '#d32f2f', fontWeight: 'bold' }}>{error}</p>}
        {success && <p className="success-message" style={{ color: '#388e3c', fontWeight: 'bold' }}>{success}</p>}
      </form>
    </div>
  );
};

export default TaskForm;