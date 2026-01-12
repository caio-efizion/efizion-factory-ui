"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const test_utils_1 = require("react-dom/test-utils");
// Mock the API service
jest.mock('../services/apiService', () => ({
    authenticate: jest.fn(),
}));
const apiService_1 = require("../services/apiService");
describe('Authentication Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('renders authentication input and button', () => {
        (0, react_1.render)(/>);
        const inputElement = react_1.screen.getByPlaceholderText(/Enter API Key/i);
        const buttonElement = react_1.screen.getByRole('button', { name: /Authenticate/i });
        expect(inputElement).toBeInTheDocument();
        expect(buttonElement).toBeInTheDocument();
    });
    test('calls authenticate function with correct API key', async () => {
        const apiKey = 'test-api-key';
        apiService_1.authenticate.mockResolvedValueOnce({ success: true });
        (0, react_1.render)(/>);
        const inputElement = react_1.screen.getByPlaceholderText(/Enter API Key/i);
        const buttonElement = react_1.screen.getByRole('button', { name: /Authenticate/i });
        await (0, test_utils_1.act)(async () => {
            react_1.fireEvent.change(inputElement, { target: { value: apiKey } });
            react_1.fireEvent.click(buttonElement);
        });
        expect(apiService_1.authenticate).toHaveBeenCalledWith(apiKey);
    });
    test('displays loading state when authenticating', async () => {
        apiService_1.authenticate.mockImplementation(() => new Promise(() => { })); // Never resolves
        (0, react_1.render)(/>);
        const buttonElement = react_1.screen.getByRole('button', { name: /Authenticate/i });
        await (0, test_utils_1.act)(async () => {
            react_1.fireEvent.click(buttonElement);
        });
        expect(buttonElement).toHaveTextContent(/Loading/i);
    });
    test('displays error message on authentication failure', async () => {
        apiService_1.authenticate.mockRejectedValueOnce(new Error('Invalid API Key'));
        (0, react_1.render)(/>);
        const inputElement = react_1.screen.getByPlaceholderText(/Enter API Key/i);
        const buttonElement = react_1.screen.getByRole('button', { name: /Authenticate/i });
        await (0, test_utils_1.act)(async () => {
            react_1.fireEvent.change(inputElement, { target: { value: 'wrong-key' } });
            react_1.fireEvent.click(buttonElement);
        });
        const errorMessage = await react_1.screen.findByText(/Invalid API Key/i);
        expect(errorMessage).toBeInTheDocument();
    });
    test('displays success message on successful authentication', async () => {
        apiService_1.authenticate.mockResolvedValueOnce({ success: true });
        (0, react_1.render)(/>);
        const inputElement = react_1.screen.getByPlaceholderText(/Enter API Key/i);
        const buttonElement = react_1.screen.getByRole('button', { name: /Authenticate/i });
        await (0, test_utils_1.act)(async () => {
            react_1.fireEvent.change(inputElement, { target: { value: 'correct-key' } });
            react_1.fireEvent.click(buttonElement);
        });
        const successMessage = await react_1.screen.findByText(/Authentication Successful/i);
        expect(successMessage).toBeInTheDocument();
    });
});
//# sourceMappingURL=authentication.test.js.map