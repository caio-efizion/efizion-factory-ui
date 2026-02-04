import ToastNotification from '../components/ToastNotification';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from '../components/TaskList';
import { fetchTaskDetail, fetchTaskLogs } from '../services/taskService';
import LogViewer from '../components/LogViewer';
import TaskForm from '../components/TaskForm';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import ProjectModal from '../components/ProjectModal';
import ProjectList from '../components/ProjectList';
import KPIDashboard from '../components/KPIDashboard';
import OnboardingTour from '../components/OnboardingTour';

const HomePage: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [projects, setProjects] = useState<any[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
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
        // logData pode retornar { logs: string[] } ou array direto
        const logsArray = Array.isArray(logData) ? logData : (logData?.logs || []);
        setLogs(logsArray);
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
    <div style={{ fontFamily: 'Roboto, Arial, sans-serif', background: '#f4f6fa', minHeight: '100vh' }}>
      <header style={{ background: '#212121', color: '#fff', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>Efizion Factory UI</h1>
        <a href="/documentation" target="_blank" rel="noopener noreferrer" style={{ color: '#90caf9', fontSize: 16 }}>
          Swagger API Docs
        </a>
      </header>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <KPIDashboard kpis={{ totalProjects: projects.length, activeProjects: projects.filter(p => p.status === 'ativo').length, totalJobs: tasks.length, successJobs: tasks.filter(t => t.status === 'done').length, failedJobs: tasks.filter(t => t.status === 'error').length, activeAgents: 3 }} />
        <div style={{ marginBottom: 12 }}>
          <b>Status da API:</b> {healthStatus}
        </div>
        {!apiKey ? (
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0001', maxWidth: 400, margin: '32px auto' }}>
            <h2 style={{ color: '#1976d2' }}>Autenticação</h2>
            <input
              type="text"
              placeholder="Digite sua API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #1976d2', marginBottom: 16 }}
            />
            <button onClick={() => handleApiKeySubmit(apiKey)} style={{ background: '#1976d2', color: '#fff', borderRadius: 4, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>Entrar</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 600, color: '#1976d2' }}>Projetos</h2>
              <button onClick={() => setShowProjectModal(true)} style={{ background: '#388e3c', color: '#fff', borderRadius: 4, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>+ Novo Projeto</button>
            </div>
            <ProjectList
              projects={projects}
              onView={id => {}}
              onEdit={id => {}}
              onDelete={id => setProjects(projects.filter(p => p.id !== id))}
              onApprove={id => {
                setProjects(projects.map(p => p.id === id ? { ...p, status: 'ativo' } : p));
              }}
            />
            <ProjectModal
              open={showProjectModal}
              onClose={() => setShowProjectModal(false)}
              onSubmit={data => {
                setProjects([...projects, { id: Date.now(), name: data.name, repo: data.repo, status: 'pendente' }]);
                setShowProjectModal(false);
              }}
            />
            <div style={{ marginTop: 32 }}>
              <h2 style={{ fontWeight: 600, color: '#1976d2' }}>Tarefas</h2>
              <TaskForm />
              {loading && <Loading />}
              {error && <Error message={error} />}
              {error && <ToastNotification message={error} variant="error" />}
              <TaskList tasks={tasks} onSelectTask={handleTaskSelect} />
              {selectedTask && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ color: '#1976d2' }}>Detalhes da Tarefa</h3>
                  {detailLoading && <Loading />}
                  {detailError && <Error message={detailError} />}
                  {detailError && <ToastNotification message={detailError} variant="error" />}
                  {taskDetail && (
                    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 24 }}>
                      <p><b>ID:</b> {taskDetail.id}</p>
                      <p><b>Título:</b> {taskDetail.title || taskDetail.name}</p>
                      <p><b>Status:</b> {taskDetail.status}</p>
                      <p><b>Descrição:</b> {taskDetail.description}</p>
                      <button onClick={() => handleRunTask(taskDetail.id)} disabled={runLoading} style={{ marginTop: 12, background: '#1976d2', color: '#fff', borderRadius: 4, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
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
            <OnboardingTour step={onboardingStep} onNext={() => setOnboardingStep(onboardingStep + 1)} onClose={() => setOnboardingStep(5)} />
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;