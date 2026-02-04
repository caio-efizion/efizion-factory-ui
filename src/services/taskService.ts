import apiClient from './apiService';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

/**
 * Serviço de gerenciamento de tarefas
 * Todas as funções retornam Promises e podem lançar erros
 */

/**
 * Busca todas as tarefas
 */
export const getTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get<Task[]>('/tasks');
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Busca os detalhes de uma tarefa específica
 */
export const getTaskById = async (taskId: number): Promise<Task> => {
  const response = await apiClient.get<Task>(`/tasks/${taskId}`);
  return response.data;
};

/**
 * Cria uma nova tarefa
 */
export const createTask = async (taskData: CreateTaskPayload): Promise<Task> => {
  const response = await apiClient.post<Task>('/tasks', taskData);
  return response.data;
};

/**
 * Atualiza uma tarefa existente
 */
export const updateTask = async (
  taskId: number,
  taskData: UpdateTaskPayload
): Promise<Task> => {
  const response = await apiClient.patch<Task>(`/tasks/${taskId}`, taskData);
  return response.data;
};

/**
 * Exclui uma tarefa
 */
export const deleteTask = async (taskId: number): Promise<void> => {
  await apiClient.delete(`/tasks/${taskId}`);
};

/**
 * Busca os logs de uma tarefa
 */
export const getTaskLogs = async (taskId: number): Promise<string[]> => {
  const response = await apiClient.get<string[]>(`/tasks/${taskId}/logs`);
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Executa uma tarefa
 */
export const runTask = async (taskId: number): Promise<Task> => {
  const response = await apiClient.post<Task>(`/tasks/${taskId}/run`);
  return response.data;
};

// Manter compatibilidade com código legado
export const fetchTasks = getTasks;
export const fetchTaskDetail = (taskId: string) => getTaskById(parseInt(taskId));
export const fetchTaskLogs = (taskId: string) => getTaskLogs(parseInt(taskId));