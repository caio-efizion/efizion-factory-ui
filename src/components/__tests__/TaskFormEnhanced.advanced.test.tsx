import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSnackbar } from 'notistack';
import TaskFormEnhanced from '../TaskFormEnhanced';
import * as taskService from '../../services/taskService';

jest.mock('notistack', () => ({
  useSnackbar: jest.fn(),
}));

jest.mock('../../services/taskService');

const mockEnqueueSnackbar = jest.fn();

describe('TaskFormEnhanced - Casos Adicionais', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSnackbar as jest.Mock).mockReturnValue({ enqueueSnackbar: mockEnqueueSnackbar });
  });

  describe('Validação de URL GitHub', () => {
    it('deve aceitar URL github.com válida', async () => {
      (taskService.createTask as jest.Mock).mockResolvedValue({ id: '1' });
      
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i);
      const descInput = screen.getByLabelText(/descrição/i);
      
      fireEvent.change(titleInput, {
        target: { value: 'Tarefa Válida' },
      });
      
      fireEvent.change(descInput, {
        target: { value: 'Descrição com https://github.com/user/repo válida' },
      });
      
      const submitButton = screen.getByRole('button', { name: /criar tarefa/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(taskService.createTask).toHaveBeenCalledWith({
          title: 'Tarefa Válida',
          description: 'Descrição com https://github.com/user/repo válida',
        });
      });
    });

    it('deve rejeitar URL sem github.com', async () => {
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i);
      const descInput = screen.getByLabelText(/descrição/i);
      
      fireEvent.change(titleInput, {
        target: { value: 'Tarefa' },
      });
      fireEvent.blur(titleInput);
      
      fireEvent.change(descInput, {
        target: { value: 'Descrição sem URL válida http://example.com' },
      });
      fireEvent.blur(descInput);
      
      await waitFor(() => {
        expect(screen.getByText(/url.*github/i)).toBeInTheDocument();
      });
      
      // Não deve chamar createTask com dados inválidos
      expect(taskService.createTask).not.toHaveBeenCalled();
    });

    it('deve aceitar URL GitHub com hífens e pontos', async () => {
      (taskService.createTask as jest.Mock).mockResolvedValue({ id: '1' });
      
      render(<TaskFormEnhanced />);
      
      fireEvent.change(screen.getByLabelText(/título/i), {
        target: { value: 'Tarefa' },
      });
      
      fireEvent.change(screen.getByLabelText(/descrição/i), {
        target: { value: 'Deploy para https://github.com/my-org/my-repo.git' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
      
      await waitFor(() => {
        expect(taskService.createTask).toHaveBeenCalled();
      });
    });
  });

  describe('Validação de Título', () => {
    it('deve exigir mínimo de 3 caracteres', async () => {
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i);
      
      fireEvent.change(titleInput, {
        target: { value: 'Ab' },
      });
      
      fireEvent.blur(titleInput);
      
      await waitFor(() => {
        expect(screen.getByText(/pelo menos 3 caracteres/i)).toBeInTheDocument();
      });
    });

    it('deve limitar a 100 caracteres', async () => {
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i);
      const longTitle = 'A'.repeat(101);
      
      fireEvent.change(titleInput, {
        target: { value: longTitle },
      });
      
      fireEvent.blur(titleInput);
      
      await waitFor(() => {
        expect(screen.getByText(/não pode exceder 100 caracteres/i)).toBeInTheDocument();
      });
    });

    it('deve aceitar título exatamente com 100 caracteres', async () => {
      (taskService.createTask as jest.Mock).mockResolvedValue({ id: '1' });
      
      render(<TaskFormEnhanced />);
      
      const exactTitle = 'A'.repeat(100);
      
      fireEvent.change(screen.getByLabelText(/título/i), {
        target: { value: exactTitle },
      });
      
      fireEvent.change(screen.getByLabelText(/descrição/i), {
        target: { value: 'Descrição https://github.com/test/repo' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
      
      await waitFor(() => {
        expect(taskService.createTask).toHaveBeenCalled();
      });
    });

    it('deve rejeitar título vazio', async () => {
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i);
      
      fireEvent.change(titleInput, {
        target: { value: '   ' },
      });
      
      fireEvent.blur(titleInput);
      
      await waitFor(() => {
        expect(screen.getByText(/título é obrigatório/i)).toBeInTheDocument();
      });
    });
  });

  describe('Estados de Erro de API', () => {
    it('deve tratar erro de rede', async () => {
      (taskService.createTask as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );
      
      render(<TaskFormEnhanced />);
      
      fireEvent.change(screen.getByLabelText(/título/i), {
        target: { value: 'Tarefa Teste' },
      });
      
      fireEvent.change(screen.getByLabelText(/descrição/i), {
        target: { value: 'Descrição https://github.com/test/repo' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
      
      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
          expect.stringMatching(/falha|erro/i),
          expect.objectContaining({ variant: 'error' })
        );
      });
    });

    it('deve tratar erro 400 com mensagem específica', async () => {
      (taskService.createTask as jest.Mock).mockRejectedValue({
        response: {
          data: { 
            error: { message: 'Título já existe' }
          },
        },
      });
      
      render(<TaskFormEnhanced />);
      
      fireEvent.change(screen.getByLabelText(/título/i), {
        target: { value: 'Tarefa Duplicada' },
      });
      
      fireEvent.change(screen.getByLabelText(/descrição/i), {
        target: { value: 'Descrição https://github.com/test/repo' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
      
      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
          'Título já existe',
          expect.objectContaining({ variant: 'error' })
        );
      });
    });

    it('deve usar mensagem padrão quando erro não tem mensagem específica', async () => {
      (taskService.createTask as jest.Mock).mockRejectedValue({
        response: { status: 500 },
      });
      
      render(<TaskFormEnhanced />);
      
      fireEvent.change(screen.getByLabelText(/título/i), {
        target: { value: 'Tarefa' },
      });
      
      fireEvent.change(screen.getByLabelText(/descrição/i), {
        target: { value: 'Descrição https://github.com/test/repo' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
      
      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
          'Falha ao criar tarefa',
          expect.objectContaining({ variant: 'error' })
        );
      });
    });
  });

  describe('Comportamento do Formulário', () => {
    it('deve desabilitar botão durante submissão', async () => {
      (taskService.createTask as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ id: '1' }), 100))
      );
      
      render(<TaskFormEnhanced />);
      
      fireEvent.change(screen.getByLabelText(/título/i), {
        target: { value: 'Tarefa' },
      });
      
      fireEvent.change(screen.getByLabelText(/descrição/i), {
        target: { value: 'Descrição https://github.com/test/repo' },
      });
      
      const submitButton = screen.getByRole('button', { name: /criar tarefa/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      }, { timeout: 3000 });
    });

    it('deve manter dados após erro', async () => {
      (taskService.createTask as jest.Mock).mockRejectedValue(new Error('Error'));
      
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i) as HTMLInputElement;
      const descInput = screen.getByLabelText(/descrição/i) as HTMLInputElement;
      
      fireEvent.change(titleInput, { target: { value: 'Tarefa' } });
      fireEvent.change(descInput, { target: { value: 'Descrição https://github.com/test/repo' } });
      
      fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
      
      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalled();
      });
      
      expect(titleInput.value).toBe('Tarefa');
      expect(descInput.value).toBe('Descrição https://github.com/test/repo');
    });

    it('deve limpar formulário após sucesso', async () => {
      (taskService.createTask as jest.Mock).mockResolvedValue({ id: '1' });
      
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i) as HTMLInputElement;
      const descInput = screen.getByLabelText(/descrição/i) as HTMLInputElement;
      
      fireEvent.change(titleInput, { target: { value: 'Tarefa' } });
      fireEvent.change(descInput, { target: { value: 'Descrição https://github.com/test/repo' } });
      
      fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
      
      await waitFor(() => {
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
          'Tarefa criada com sucesso!',
          expect.objectContaining({ variant: 'success' })
        );
      });
      
      // Formulário deve ser resetado
      await waitFor(() => {
        expect(titleInput.value).toBe('');
        expect(descInput.value).toBe('');
      });
    });

    it('deve usar botão Limpar para resetar formulário', () => {
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i) as HTMLInputElement;
      const descInput = screen.getByLabelText(/descrição/i) as HTMLInputElement;
      
      fireEvent.change(titleInput, { target: { value: 'Tarefa' } });
      fireEvent.change(descInput, { target: { value: 'Descrição' } });
      
      const clearButton = screen.getByRole('button', { name: /limpar/i });
      fireEvent.click(clearButton);
      
      expect(titleInput.value).toBe('');
      expect(descInput.value).toBe('');
    });
  });

  describe('Validação em Tempo Real', () => {
    it('deve validar ao perder foco (onBlur)', async () => {
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i);
      
      fireEvent.change(titleInput, { target: { value: 'Ab' } });
      fireEvent.blur(titleInput);
      
      await waitFor(() => {
        expect(screen.getByText(/pelo menos 3 caracteres/i)).toBeInTheDocument();
      });
    });

    it('deve remover erro ao corrigir campo', async () => {
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i);
      
      fireEvent.change(titleInput, { target: { value: 'Ab' } });
      fireEvent.blur(titleInput);
      
      await waitFor(() => {
        expect(screen.getByText(/pelo menos 3 caracteres/i)).toBeInTheDocument();
      });
      
      fireEvent.change(titleInput, { target: { value: 'Título Válido' } });
      
      await waitFor(() => {
        expect(screen.queryByText(/pelo menos 3 caracteres/i)).not.toBeInTheDocument();
      });
    });

    it('não deve validar antes do blur', () => {
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i);
      
      fireEvent.change(titleInput, { target: { value: 'Ab' } });
      
      // Não deve mostrar erro antes de perder foco
      expect(screen.queryByText(/pelo menos 3 caracteres/i)).not.toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter labels associados aos inputs', () => {
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i);
      const descInput = screen.getByLabelText(/descrição/i);
      
      expect(titleInput).toHaveAttribute('id');
      expect(descInput).toHaveAttribute('id');
    });

    it('deve exibir erro com aria-invalid', async () => {
      render(<TaskFormEnhanced />);
      
      const titleInput = screen.getByLabelText(/título/i);
      
      fireEvent.change(titleInput, { target: { value: 'Ab' } });
      fireEvent.blur(titleInput);
      
      await waitFor(() => {
        expect(titleInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('deve ter botão com aria-label', () => {
      render(<TaskFormEnhanced />);
      
      const submitButton = screen.getByRole('button', { name: /criar tarefa/i });
      expect(submitButton).toHaveAttribute('aria-label', 'Criar tarefa');
    });
  });
});
