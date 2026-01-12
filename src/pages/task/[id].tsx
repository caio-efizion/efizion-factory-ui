import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TaskDetail, TaskLog } from '../../components/TaskDetail';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { getApiKey } from '../../services/authService';

const TaskDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const apiKey = getApiKey();
        const response = await axios.get(`/api/tasks/${id}`, {
          headers: { 'x-api-key': apiKey },
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
        const apiKey = getApiKey();
        const response = await axios.get(`/api/tasks/${id}/logs`, {
          headers: { 'x-api-key': apiKey },
        });
        setLogs(response.data);
      } catch (err) {
        setError('Failed to fetch task logs.');
      }
    };

    fetchTaskDetails();
    fetchTaskLogs();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="task-detail-page">
      {task && (
        <>
          <h1>Task Details</h1>
          <div className="task-info">
            <p><strong>ID:</strong> {task.id}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Description:</strong> {task.description}</p>
          </div>
          <h2>Logs</h2>
          <div className="task-logs">
            {logs.map((log) => (
              <div key={log.timestamp} className="log-entry">
                <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                <p><strong>Message:</strong> {log.message}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskDetailPage;