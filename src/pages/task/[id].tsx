import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const TaskDetailPage = () => {
  const { apiKey } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !apiKey) return;
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/tasks/${id}`, {
          headers: {
            'x-api-key': apiKey,
          },
        });
        setTask(response.data);
      } catch (err) {
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [id, apiKey]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!task) return <div>No task found.</div>;

  return (
    <div className="task-detail-page">
      <h1>Task Details</h1>
      <pre>{JSON.stringify(task, null, 2)}</pre>
    </div>
  );
};

export default TaskDetailPage;