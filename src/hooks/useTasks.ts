import { useState, useEffect } from 'react';
import axios from 'axios';

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

const useTasks = (apiKey: string): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/tasks', {
        headers: {
          'x-api-key': apiKey,
        },
      });
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/tasks', taskData, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      fetchTasks(); // Refresh task list after creation
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskDetails = async (taskId: string): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/tasks/${taskId}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      return response.data;
    } catch (err) {
      setError('Failed to fetch task details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [apiKey]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    fetchTaskDetails,
  };
};

export default useTasks;