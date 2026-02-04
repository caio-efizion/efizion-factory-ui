import { getTasks, createTask, getTaskById, deleteTask, updateTask, runTask } from '../taskService';
import { apiClient } from '../apiService';

// Mock do apiClient
jest.mock('../apiService', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('deve retornar lista de tarefas', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'pending' },
        { id: '2', title: 'Task 2', status: 'done' },
      ];
      mockApiClient.get.mockResolvedValue({ data: mockTasks });

      const result = await getTasks();

      expect(mockApiClient.get).toHaveBeenCalledWith('/tasks');
      expect(result).toEqual(mockTasks);
    });

    it('deve aplicar filtros quando fornecidos', async () => {
      mockApiClient.get.mockResolvedValue({ data: [] });

      await getTasks({ status: 'pending', search: 'test' });

      expect(mockApiClient.get).toHaveBeenCalledWith('/tasks', {
        params: { status: 'pending', search: 'test' },
      });
    });

    it('deve lançar erro em caso de falha', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(getTasks()).rejects.toThrow('Network error');
    });
  });

  describe('getTaskById', () => {
    it('deve retornar tarefa por ID', async () => {
      const mockTask = { id: '1', title: 'Task 1', status: 'pending' };
      mockApiClient.get.mockResolvedValue({ data: mockTask });

      const result = await getTaskById('1');

      expect(mockApiClient.get).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(mockTask);
    });

    it('deve lançar erro se tarefa não encontrada', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Not found'));

      await expect(getTaskById('999')).rejects.toThrow('Not found');
    });
  });

  describe('createTask', () => {
    it('deve criar nova tarefa', async () => {
      const newTask = { title: 'New Task', description: 'https://github.com/test' };
      const createdTask = { id: '3', ...newTask, status: 'pending' };
      mockApiClient.post.mockResolvedValue({ data: createdTask });

      const result = await createTask(newTask);

      expect(mockApiClient.post).toHaveBeenCalledWith('/tasks', newTask);
      expect(result).toEqual(createdTask);
    });

    it('deve lançar erro em caso de falha na criação', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Validation error'));

      await expect(createTask({ title: '', description: '' })).rejects.toThrow('Validation error');
    });
  });

  describe('updateTask', () => {
    it('deve atualizar tarefa existente', async () => {
      const updates = { title: 'Updated Title' };
      const updatedTask = { id: '1', ...updates, status: 'pending' };
      mockApiClient.put.mockResolvedValue({ data: updatedTask });

      const result = await updateTask('1', updates);

      expect(mockApiClient.put).toHaveBeenCalledWith('/tasks/1', updates);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('deve deletar tarefa', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      await deleteTask('1');

      expect(mockApiClient.delete).toHaveBeenCalledWith('/tasks/1');
    });

    it('deve lançar erro se tarefa não pode ser deletada', async () => {
      mockApiClient.delete.mockRejectedValue(new Error('Cannot delete running task'));

      await expect(deleteTask('1')).rejects.toThrow('Cannot delete running task');
    });
  });

  describe('runTask', () => {
    it('deve executar tarefa', async () => {
      const runResult = { status: 'running', message: 'Task started' };
      mockApiClient.post.mockResolvedValue({ data: runResult });

      const result = await runTask('1');

      expect(mockApiClient.post).toHaveBeenCalledWith('/tasks/1/run');
      expect(result).toEqual(runResult);
    });
  });

  describe('edge cases', () => {
    it('deve lidar com resposta vazia', async () => {
      mockApiClient.get.mockResolvedValue({ data: null });

      const result = await getTasks();

      expect(result).toBeNull();
    });

    it('deve lidar com erro de timeout', async () => {
      mockApiClient.get.mockRejectedValue({ code: 'ECONNABORTED', message: 'timeout' });

      await expect(getTasks()).rejects.toMatchObject({ code: 'ECONNABORTED' });
    });

    it('deve lidar com erro 401', async () => {
      mockApiClient.get.mockRejectedValue({
        response: { status: 401, data: { message: 'Unauthorized' } },
      });

      await expect(getTasks()).rejects.toHaveProperty('response.status', 401);
    });
  });
});
