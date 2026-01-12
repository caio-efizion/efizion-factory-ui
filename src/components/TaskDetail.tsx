import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTaskDetail, fetchTaskLogs } from '../services/taskService';
import { Task, TaskLog } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorBanner from './ErrorBanner';

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTaskDetail = async () => {
      if (!taskId) {
        setError('No task ID provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const taskDetail = await fetchTaskDetail(taskId);
        setTask(taskDetail);
        const taskLogs = await fetchTaskLogs(taskId);
        setLogs(taskLogs);
      } catch (err) {
        setError('Failed to load task details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTaskDetail();
  }, [taskId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorBanner message={error} />;
  }

  if (!task) {
    return <div>No task found.</div>;
  }

  return (
    <div className="task-detail">
      <h1>Task Detail</h1>
      <div className="task-info">
        <h2>{task.name}</h2>
        <p>Status: {task.status}</p>
        {/* Campos de data removidos pois não existem no tipo Task */}
      </div>
      <div className="task-logs">
        <h3>Logs</h3>
        {logs.length > 0 ? (
          <ul>
            {logs.map((log) => (
              <li key={log.id}>
                <p>{log.message}</p>
                <p>{new Date(log.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No logs available for this task.</p>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;