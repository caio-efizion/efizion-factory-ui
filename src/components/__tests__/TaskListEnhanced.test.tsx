import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import TaskListEnhanced from '../TaskListEnhanced';
import * as taskService from '../../services/taskService';

// Mocks
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('notistack', () => ({
  useSnackbar: jest.fn(),
}));

jest.mock('../../services/taskService');

const mockRouter = {
  push: jest.fn(),
};

const mockEnqueueSnackbar = jest.fn();

const mockTasks = [
  {
    id: '1',
    title: 'Tarefa 1',
    description: 'Descrição 1 https://github.com/test/repo1',
    status: 'pending' as const,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Tarefa 2',
    description: 'Descrição 2 https://github.com/test/repo2',
    status: 'running' as const,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
  {
    id: '3',
    title: 'Tarefa Teste',
    description: 'Teste https://github.com/test/repo3',
    status: 'done' as const,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
  },
];

describe('TaskListEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSnackbar as jest.Mock).mockReturnValue({ enqueueSnackbar: mockEnqueueSnackbar });
    (taskService.getTasks as jest.Mock).mockResolvedValue(mockTasks);
    (taskService.deleteTask as jest.Mock).mockResolvedValue({});
  });

  describe('Renderização Inicial', () => {
    it('deve renderizar o título', () => {
      render(<TaskListEnhanced />);
      expect(screen.getByText('Minhas Tarefas')).toBeInTheDocument();
    });

    it('deve renderizar botão de criar tarefa', () => {
      render(<TaskListEnhanced />);
      expect(screen.getByLabelText(/criar nova tarefa/i)).toBeInTheDocument();
    });

    it('deve renderizar campo de busca', () => {
      render(<TaskListEnhanced />);
      expect(screen.getByPlaceholderText(/buscar tarefas/i)).toBeInTheDocument();
    });

    it('deve carregar e exibir tarefas', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument();
      expect(screen.getByText('Tarefa Teste')).toBeInTheDocument();
    });
  });

  describe('Estados de Loading e Erro', () => {
    it('deve exibir loading state durante carregamento', () => {
      (taskService.getTasks as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockTasks), 100))
      );
      
      render(<TaskListEnhanced />);
      expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    it('deve exibir erro quando falha ao carregar', async () => {
      (taskService.getTasks as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
          expect.stringContaining('Erro'),
          expect.objectContaining({ variant: 'error' })
        );
      });
    });

    it('deve exibir empty state quando não há tarefas', async () => {
      (taskService.getTasks as jest.Mock).mockResolvedValue([]);
      
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText(/nenhuma tarefa encontrada/i)).toBeInTheDocument();
      });
    });
  });

  describe('Funcionalidade de Busca', () => {
    it('deve filtrar tarefas por texto de busca', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText(/buscar tarefas/i);
      fireEvent.change(searchInput, { target: { value: 'Teste' } });
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste')).toBeInTheDocument();
        expect(screen.queryByText('Tarefa 1')).not.toBeInTheDocument();
      });
    });

    it('deve ser case-insensitive na busca', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText(/buscar tarefas/i);
      fireEvent.change(searchInput, { target: { value: 'teste' } });
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa Teste')).toBeInTheDocument();
      });
    });

    it('deve limpar busca com botão clear', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText(/buscar tarefas/i);
      fireEvent.change(searchInput, { target: { value: 'Teste' } });
      
      const clearButton = screen.getByLabelText(/limpar busca/i);
      fireEvent.click(clearButton);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
        expect(screen.getByText('Tarefa 2')).toBeInTheDocument();
      });
    });
  });

  describe('Filtro por Status', () => {
    it('deve filtrar tarefas por status pending', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      const statusFilter = screen.getByLabelText(/filtrar por status/i);
      fireEvent.mouseDown(statusFilter);
      
      const pendingOption = screen.getByText(/^Pendente/);
      fireEvent.click(pendingOption);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
        expect(screen.queryByText('Tarefa 2')).not.toBeInTheDocument();
      });
    });

    it('deve exibir contador de tarefas por status', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText(/Todas \(3\)/)).toBeInTheDocument();
      });
    });
  });

  describe('Ações nas Tarefas', () => {
    it('deve navegar para detalhes ao clicar em visualizar', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      const viewButtons = screen.getAllByLabelText(/ver detalhes/i);
      fireEvent.click(viewButtons[0]);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/tasks/1');
    });

    it('deve abrir dialog de confirmação ao excluir', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      const deleteButtons = screen.getAllByLabelText(/excluir tarefa/i);
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/tem certeza que deseja excluir/i)).toBeInTheDocument();
      });
    });

    it('deve excluir tarefa ao confirmar', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      const deleteButtons = screen.getAllByLabelText(/excluir tarefa/i);
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/tem certeza/i)).toBeInTheDocument();
      });
      
      const confirmButton = screen.getByRole('button', { name: /excluir/i });
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(taskService.deleteTask).toHaveBeenCalledWith('1');
      });
    });

    it('deve cancelar exclusão ao clicar em cancelar', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      const deleteButtons = screen.getAllByLabelText(/excluir tarefa/i);
      fireEvent.click(deleteButtons[0]);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      fireEvent.click(cancelButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/tem certeza/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Atualização de Dados', () => {
    it('deve recarregar tarefas ao clicar em atualizar', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      const refreshButton = screen.getByLabelText(/atualizar lista/i);
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(taskService.getTasks).toHaveBeenCalledTimes(2);
      });
    });

    it('deve exibir notificação de sucesso ao excluir', async () => {
      render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      const deleteButtons = screen.getAllByLabelText(/excluir tarefa/i);
      fireEvent.click(deleteButtons[0]);
      
      const confirmButton = screen.getByRole('button', { name: /excluir/i });
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
          expect.stringContaining('sucesso'),
          expect.objectContaining({ variant: 'success' })
        );
      });
    });
  });

  describe('Responsividade e Layout', () => {
    it('deve usar Grid responsivo', async () => {
      const { container } = render(<TaskListEnhanced />);
      
      await waitFor(() => {
        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
      });
      
      const grid = container.querySelector('.MuiGrid-root');
      expect(grid).toBeInTheDocument();
    });
  });
});
