import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from '../components/Dashboard';
import { getTasks } from '../services/taskService';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../services/taskService');

describe('Dashboard Component', () => {
  const mockTasks = [
    { id: 1, name: 'Task 1', status: 'pending' },
    { id: 2, name: 'Task 2', status: 'completed' },
  ];

  beforeEach(() => {
    getTasks.mockResolvedValue(mockTasks);
  });

  test('renders the dashboard with tasks', async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  test('displays error message on API failure', async () => {
    getTasks.mockRejectedValueOnce(new Error('Failed to fetch tasks'));

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
    });
  });

  test('navigates to task detail on task click', async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    await waitFor(() => {
      const taskLink = screen.getByText('Task 1');
      fireEvent.click(taskLink);
    });

    expect(window.location.pathname).toBe('/tasks/1');
  });

  test('displays loading indicator while fetching tasks', async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading tasks.../i)).not.toBeInTheDocument();
    });
  });
});