import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskDetail from '../components/TaskDetail';
import { getTaskDetail } from '../services/taskService';
import { act } from 'react-dom/test-utils';

jest.mock('../services/taskService');

describe('TaskDetail Component', () => {
  const mockTaskDetail = {
    id: '1',
    name: 'Sample Task',
    status: 'In Progress',
    logs: ['Log entry 1', 'Log entry 2'],
    output: 'Sample output',
  };

  beforeEach(() => {
    getTaskDetail.mockResolvedValue(mockTaskDetail);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders task details correctly', async () => {
    await act(async () => {
      render(<TaskDetail taskId="1" />);
    });

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Sample Task/i)).toBeInTheDocument();
      expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
      expect(screen.getByText(/Sample output/i)).toBeInTheDocument();
    });

    mockTaskDetail.logs.forEach((log) => {
      expect(screen.getByText(log)).toBeInTheDocument();
    });
  });

  test('displays error message on API failure', async () => {
    getTaskDetail.mockRejectedValueOnce(new Error('Failed to fetch task details'));

    await act(async () => {
      render(<TaskDetail taskId="1" />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Error loading task details/i)).toBeInTheDocument();
    });
  });

  test('updates status in real-time', async () => {
    const updatedTaskDetail = { ...mockTaskDetail, status: 'Completed' };
    getTaskDetail.mockResolvedValueOnce(updatedTaskDetail);

    await act(async () => {
      render(<TaskDetail taskId="1" />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Completed/i)).toBeInTheDocument();
    });
  });
});