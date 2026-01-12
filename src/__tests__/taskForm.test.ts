import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TaskForm from '../components/TaskForm';
import { createTask } from '../services/taskService';

jest.mock('../services/taskService');

describe('TaskForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task form with input fields and submit button', () => {
    render(<TaskForm />);
    
    expect(screen.getByLabelText(/Task Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
  });

  test('allows user to input task name and description', () => {
    render(<TaskForm />);
    
    const taskNameInput = screen.getByLabelText(/Task Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    fireEvent.change(taskNameInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task Description' } });

    expect(taskNameInput.value).toBe('New Task');
    expect(descriptionInput.value).toBe('Task Description');
  });

  test('submits form and calls createTask service with correct data', async () => {
    createTask.mockResolvedValueOnce({ success: true });

    render(<TaskForm />);
    
    const taskNameInput = screen.getByLabelText(/Task Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    fireEvent.change(taskNameInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        name: 'New Task',
        description: 'Task Description',
      });
    });
  });

  test('displays loading indicator when submitting', async () => {
    createTask.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));

    render(<TaskForm />);
    
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    fireEvent.click(submitButton);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });

  test('displays success message after successful task creation', async () => {
    createTask.mockResolvedValueOnce({ success: true });

    render(<TaskForm />);
    
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Task created successfully!/i)).toBeInTheDocument();
    });
  });

  test('displays error message if task creation fails', async () => {
    createTask.mockRejectedValueOnce(new Error('Failed to create task'));

    render(<TaskForm />);
    
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to create task/i)).toBeInTheDocument();
    });
  });
});