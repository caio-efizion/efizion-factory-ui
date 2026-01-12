import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Authentication from '../components/Authentication';
import { act } from 'react-dom/test-utils';

// Mock the API service
jest.mock('../services/apiService', () => ({
  authenticate: jest.fn(),
}));

import { authenticate } from '../services/apiService';

describe('Authentication Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders authentication input and button', () => {
    render(<Authentication />);
    const inputElement = screen.getByPlaceholderText(/Enter API Key/i);
    const buttonElement = screen.getByRole('button', { name: /Authenticate/i });

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls authenticate function with correct API key', async () => {
    const apiKey = 'test-api-key';
    authenticate.mockResolvedValueOnce({ success: true });

    render(<Authentication />);
    const inputElement = screen.getByPlaceholderText(/Enter API Key/i);
    const buttonElement = screen.getByRole('button', { name: /Authenticate/i });

    await act(async () => {
      fireEvent.change(inputElement, { target: { value: apiKey } });
      fireEvent.click(buttonElement);
    });

    expect(authenticate).toHaveBeenCalledWith(apiKey);
  });

  test('displays loading state when authenticating', async () => {
    authenticate.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Authentication />);
    const buttonElement = screen.getByRole('button', { name: /Authenticate/i });

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(buttonElement).toHaveTextContent(/Loading/i);
  });

  test('displays error message on authentication failure', async () => {
    authenticate.mockRejectedValueOnce(new Error('Invalid API Key'));

    render(<Authentication />);
    const inputElement = screen.getByPlaceholderText(/Enter API Key/i);
    const buttonElement = screen.getByRole('button', { name: /Authenticate/i });

    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'wrong-key' } });
      fireEvent.click(buttonElement);
    });

    const errorMessage = await screen.findByText(/Invalid API Key/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('displays success message on successful authentication', async () => {
    authenticate.mockResolvedValueOnce({ success: true });

    render(<Authentication />);
    const inputElement = screen.getByPlaceholderText(/Enter API Key/i);
    const buttonElement = screen.getByRole('button', { name: /Authenticate/i });

    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'correct-key' } });
      fireEvent.click(buttonElement);
    });

    const successMessage = await screen.findByText(/Authentication Successful/i);
    expect(successMessage).toBeInTheDocument();
  });
});