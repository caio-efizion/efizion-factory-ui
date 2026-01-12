import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { TaskDetail, TaskLog } from '../../components/TaskComponents';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../hooks/useAuth';

const TaskDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { apiKey } = useAuth();
  const [task, setTask] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch task details.');
        setLoading(false);
      }
    };

    const fetchTaskLogs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tasks/${id}/logs`, {
          headers: {
            'x-api-key': apiKey,
          },
        });
        setLogs(response.data);
      } catch (err) {
        setError('Failed to fetch task logs.');
      }
    };

    fetchTaskDetails();
    fetchTaskLogs();
  }, [id, apiKey]);

  if (loading) return <div>Loading task details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="task-detail-page">
      {task && (
        <TaskDetail
          id={task.id}
          name={task.name}
          status={task.status}
          description={task.description}
          createdAt={task.createdAt}
          updatedAt={task.updatedAt}
        />
      )}
      <h2>Task Logs</h2>
      {logs.length > 0 ? (
        logs.map((log, index) => <TaskLog key={index} log={log} />)
      ) : (
        <div>No logs available for this task.</div>
      )}
    </div>
  );
};

export default TaskDetailPage;