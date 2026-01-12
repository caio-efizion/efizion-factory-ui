import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { TaskList } from '../components/TaskList';
import { TaskDetail } from '../components/TaskDetail';
import { TaskForm } from '../components/TaskForm';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

const HomePage: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (apiKey) {
      fetchTasks();
    }
  }, [apiKey]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/tasks', {
        headers: { 'x-api-key': apiKey },
      });
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
  };

  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    setSelectedTask(task);
  };

  const handleTaskCreate = async (taskData: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/tasks', taskData, {
        headers: { 'x-api-key': apiKey },
      });
      setTasks([...tasks, response.data]);
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header>
        <h1>Efizion Factory UI</h1>
      </header>
      <main>
        {!apiKey ? (
          <div>
            <h2>Authenticate</h2>
            <input
              type="text"
              placeholder="Enter API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button onClick={() => handleApiKeySubmit(apiKey)}>Submit</button>
          </div>
        ) : (
          <div>
            <TaskForm onTaskCreate={handleTaskCreate} />
            {loading && <Loading />}
            {error && <Error message={error} />}
            <TaskList tasks={tasks} onTaskSelect={handleTaskSelect} />
            {selectedTask && <TaskDetail task={selectedTask} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;