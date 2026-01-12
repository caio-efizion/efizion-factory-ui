import ToastNotification from '../components/ToastNotification';
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import TaskList from '../components/TaskList';
import { fetchTaskDetail, fetchTaskLogs } from '../services/taskService';
import LogViewer from '../components/LogViewer';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

const HomePage: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [taskDetail, setTaskDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [runLoading, setRunLoading] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<any | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);
  const [logsError, setLogsError] = useState<string | null>(null);
    const handleRunTask = async (id: string | number) => {
      setRunLoading(true);
      setRunError(null);
      setRunResult(null);
      try {
        const apiKey = localStorage.getItem('efizion_api_key') || '';
        const response = await axios.post(`/api/tasks/${id}/run`, {}, {
          headers: { 'x-api-key': apiKey },
        });
        setRunResult(response.data);
      } catch (err: any) {
        setRunError(err?.response?.data?.message || 'Erro ao executar tarefa.');
      } finally {
        setRunLoading(false);
      }
    };
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await axios.get('/api/health');
        setHealthStatus(response.data?.status || 'OK');
      } catch {
        setHealthStatus('Erro');
      }
    };
    fetchHealth();
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

  const handleTaskSelect = async (id: string | number) => {
    setSelectedTask(tasks.find((t) => t.id === id));
    setDetailLoading(true);
    setDetailError(null);
    setLogs([]);
    setLogsError(null);
    try {
      const detail = await fetchTaskDetail(String(id));
      setTaskDetail(detail);
    } catch (err) {
      setDetailError('Erro ao carregar detalhes da tarefa.');
    } finally {
      setDetailLoading(false);
    }
    // Inicia polling dos logs
    let polling = true;
    const pollLogs = async () => {
      if (!polling || !id) return;
      setLogsLoading(true);
      try {
        const logData = await fetchTaskLogs(String(id));
        setLogs(logData.logs || []);
      } catch (err) {
        setLogsError('Erro ao carregar logs.');
      } finally {
        setLogsLoading(false);
      }
      setTimeout(pollLogs, 2000);
    };
    pollLogs();
    // Limpa polling ao deselecionar
    return () => { polling = false; };
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
        <a href="/documentation" target="_blank" rel="noopener noreferrer" style={{ float: 'right', fontSize: 16 }}>
          Swagger API Docs
        </a>
      </header>
      <main>
        <div style={{ marginBottom: 12 }}>
          <b>Status da API:</b> {healthStatus}
        </div>
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
            {/* TaskForm não aceita onTaskCreate, removido prop */}
            <TaskForm />
            {loading && <Loading />}
            {error && <Error message={error} />}
            {error && <ToastNotification message={error} variant="error" />}
            <TaskList tasks={tasks} onSelectTask={handleTaskSelect} />
            {selectedTask && (
              <div style={{ marginTop: 24 }}>
                <h3>Detalhes da Tarefa</h3>
                {detailLoading && <Loading />}
                {detailError && <Error message={detailError} />}
                {detailError && <ToastNotification message={detailError} variant="error" />}
                {taskDetail && (
                  <div>
                    <p><b>ID:</b> {taskDetail.id}</p>
                    <p><b>Título:</b> {taskDetail.title || taskDetail.name}</p>
                    <p><b>Status:</b> {taskDetail.status}</p>
                    <p><b>Descrição:</b> {taskDetail.description}</p>
                    <button onClick={() => handleRunTask(taskDetail.id)} disabled={runLoading} style={{ marginTop: 12 }}>
                      {runLoading ? 'Executando...' : 'Executar Tarefa'}
                    </button>
                    {runResult && (
                      <div style={{ marginTop: 8 }}>
                        <b>Execução iniciada!</b>
                        <p>runnerPid: {runResult.runnerPid}</p>
                        <p>{runResult.message}</p>
                        <ToastNotification message={runResult.message} variant="success" />
                      </div>
                    )}
                    {runError && <p style={{ color: 'red' }}>{runError}</p>}
                    {runError && <ToastNotification message={runError} variant="error" />}
                    <LogViewer logs={logs} loading={logsLoading} error={logsError} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;