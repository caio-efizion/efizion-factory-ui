import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTasks, createTask } from '../services/taskService';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorNotification from '../components/ErrorNotification';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData: any) => {
    setLoading(true);
    try {
      await createTask(taskData);
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
    } catch (err) {
      setError('Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorNotification message={error} />;
  }

  return (
    <div className="dashboard">
      <h1>Task Dashboard</h1>
      <TaskForm onCreateTask={handleCreateTask} />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default Dashboard;