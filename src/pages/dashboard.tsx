import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, createTask } from '../services/taskService';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorNotification from '../components/ErrorNotification';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await fetchTasks();
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
      } catch (err) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData: any) => {
    try {
      setLoading(true);
      const newTask = await createTask(taskData);
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (id: string | number) => {
    navigate(`/tasks/${id}`);
  };

  return (
    <div className="dashboard">
      <h1>Task Dashboard</h1>
      {loading && <LoadingSpinner />}
      {error && <ErrorNotification message={error} />}
      {/* TaskForm não aceita onSubmit, então removido. TaskList usa onSelectTask */}
      <TaskForm />
      <TaskList tasks={tasks} onSelectTask={handleTaskClick} />
    </div>
  );
};

export default Dashboard;