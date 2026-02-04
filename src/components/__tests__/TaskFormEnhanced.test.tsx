import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { TaskFormEnhanced } from '../TaskFormEnhanced';
import * as taskService from '../../services/taskService';

// Mock do taskService
jest.mock('../../services/taskService');

const mockCreateTask = taskService.createTask as jest.MockedFunction<typeof taskService.createTask>;

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <SnackbarProvider>
      {component}
    </SnackbarProvider>
  );
};

describe('TaskFormEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields', () => {
    renderWithProviders(<TaskFormEnhanced />);

    expect(screen.getByLabelText(/Título da Tarefa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar tarefa/i })).toBeInTheDocument();
  });

  it('should show validation error for empty title', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskFormEnhanced />);

    const titleInput = screen.getByLabelText(/Título da Tarefa/i);
    
    await user.click(titleInput);
    await user.tab(); // Blur the field

    await waitFor(() => {
      expect(screen.getByText(/Título é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for short title', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskFormEnhanced />);

    const titleInput = screen.getByLabelText(/Título da Tarefa/i);
    
    await user.type(titleInput, 'ab');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/pelo menos 3 caracteres/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for description without GitHub URL', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskFormEnhanced />);

    const descInput = screen.getByLabelText(/Descrição/i);
    
    await user.type(descInput, 'Invalid description without URL');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/URL válida do GitHub/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    mockCreateTask.mockResolvedValueOnce({
      id: 1,
      title: 'Test Task',
      description: 'Deploy https://github.com/test/repo',
      status: 'pending',
    });

    renderWithProviders(<TaskFormEnhanced />);

    await user.type(screen.getByLabelText(/Título da Tarefa/i), 'Test Task');
    await user.type(
      screen.getByLabelText(/Descrição/i),
      'Deploy https://github.com/test/repo'
    );

    await user.click(screen.getByRole('button', { name: /Criar tarefa/i }));

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Deploy https://github.com/test/repo',
      });
    });
  });

  it('should clear form after successful submission', async () => {
    const user = userEvent.setup();
    mockCreateTask.mockResolvedValueOnce({
      id: 1,
      title: 'Test',
      description: 'https://github.com/test/repo',
      status: 'pending',
    });

    renderWithProviders(<TaskFormEnhanced />);

    await user.type(screen.getByLabelText(/Título da Tarefa/i), 'Test');
    await user.type(screen.getByLabelText(/Descrição/i), 'https://github.com/test/repo');
    await user.click(screen.getByRole('button', { name: /Criar tarefa/i }));

    await waitFor(() => {
      expect((screen.getByLabelText(/Título da Tarefa/i) as HTMLInputElement).value).toBe('');
      expect((screen.getByLabelText(/Descrição/i) as HTMLInputElement).value).toBe('');
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    mockCreateTask.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<TaskFormEnhanced />);

    await user.type(screen.getByLabelText(/Título da Tarefa/i), 'Test');
    await user.type(screen.getByLabelText(/Descrição/i), 'https://github.com/test/repo');
    await user.click(screen.getByRole('button', { name: /Criar tarefa/i }));

    expect(screen.getByText(/Criando.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar tarefa/i })).toBeDisabled();
  });

  it('should clear form when clear button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskFormEnhanced />);

    await user.type(screen.getByLabelText(/Título da Tarefa/i), 'Test');
    await user.type(screen.getByLabelText(/Descrição/i), 'Description');
    
    await user.click(screen.getByRole('button', { name: /Limpar/i }));

    expect((screen.getByLabelText(/Título da Tarefa/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/Descrição/i) as HTMLInputElement).value).toBe('');
  });
});
