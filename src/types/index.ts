/**
 * Tipos principais do Efizion Factory UI
 */

/**
 * Status possíveis de uma tarefa
 */
export type TaskStatus = 'pending' | 'running' | 'done' | 'error';

/**
 * Interface principal de uma Tarefa
 */
export interface Task {
  /** ID único da tarefa */
  id: number;
  /** Título da tarefa */
  title: string;
  /** Nome legado (compatibilidade) */
  name?: string;
  /** Descrição detalhada (deve conter URL do GitHub) */
  description?: string;
  /** Status atual da execução */
  status: TaskStatus;
  /** Data de criação (ISO string) */
  createdAt?: string;
  /** Data da última atualização (ISO string) */
  updatedAt?: string;
  /** URL do repositório GitHub */
  repoUrl?: string;
  /** Logs de execução */
  logs?: string[];
  /** Resultado/output da execução */
  output?: string;
  result?: string;
}

export interface TaskLog {
  id: string | number;
  message: string;
  timestamp: string;
}

/**
 * Payload para criação de tarefa
 */
export interface CreateTaskPayload {
  title: string;
  description: string;
}

/**
 * Payload para atualização de tarefa
 */
export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

/**
 * Resposta de erro da API
 */
export interface ApiError {
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
  path: string;
}

/**
 * Opções de filtro para listagem de tarefas
 */
export interface TaskFilterOptions {
  status?: TaskStatus | 'all';
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}
