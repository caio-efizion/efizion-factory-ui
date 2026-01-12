import React, { useState } from 'react';
import { createTask } from '../services/taskService';
import { Task } from '../types';
import { useHistory } from 'react-router-dom';

const TaskForm: React.FC = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newTask: Task = {
        name: taskName,
        description: taskDescription,
      };

      await createTask(newTask);
      setLoading(false);
      history.push('/dashboard');
    } catch (err) {
      setLoading(false);
      setError('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="task-form-container">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="taskDescription">Task Description</label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default TaskForm;