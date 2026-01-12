import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../services/taskService';
import TaskList from './TaskList';
import LoadingSpinner from './LoadingSpinner';
import ErrorNotification from './ErrorNotification';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorNotification message={error} />;
  }

  return (
    <div className="dashboard">
      <h1>Task Dashboard</h1>
      <TaskList tasks={tasks} />
    </div>
  );
};

export default Dashboard;