"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom/extend-expect");
const taskService_1 = require("../services/taskService");
jest.mock('../services/taskService');
describe('TaskForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('renders task form with input fields and submit button', () => {
        (0, react_1.render)(/>);
        expect(react_1.screen.getByLabelText(/Task Name/i)).toBeInTheDocument();
        expect(react_1.screen.getByLabelText(/Description/i)).toBeInTheDocument();
        expect(react_1.screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
    });
    test('allows user to input task name and description', () => {
        (0, react_1.render)(/>);
        const taskNameInput = react_1.screen.getByLabelText(/Task Name/i);
        const descriptionInput = react_1.screen.getByLabelText(/Description/i);
        react_1.fireEvent.change(taskNameInput, { target: { value: 'New Task' } });
        react_1.fireEvent.change(descriptionInput, { target: { value: 'Task Description' } });
        expect(taskNameInput.value).toBe('New Task');
        expect(descriptionInput.value).toBe('Task Description');
    });
    test('submits form and calls createTask service with correct data', async () => {
        taskService_1.createTask.mockResolvedValueOnce({ success: true });
        (0, react_1.render)(/>);
        const taskNameInput = react_1.screen.getByLabelText(/Task Name/i);
        const descriptionInput = react_1.screen.getByLabelText(/Description/i);
        const submitButton = react_1.screen.getByRole('button', { name: /Create Task/i });
        react_1.fireEvent.change(taskNameInput, { target: { value: 'New Task' } });
        react_1.fireEvent.change(descriptionInput, { target: { value: 'Task Description' } });
        react_1.fireEvent.click(submitButton);
        await (0, react_1.waitFor)(() => {
            expect(taskService_1.createTask).toHaveBeenCalledWith({
                name: 'New Task',
                description: 'Task Description',
            });
        });
    });
    test('displays loading indicator when submitting', async () => {
        taskService_1.createTask.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));
        (0, react_1.render)(/>);
        const submitButton = react_1.screen.getByRole('button', { name: /Create Task/i });
        react_1.fireEvent.click(submitButton);
        expect(react_1.screen.getByText(/Loading.../i)).toBeInTheDocument();
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });
    });
    test('displays success message after successful task creation', async () => {
        taskService_1.createTask.mockResolvedValueOnce({ success: true });
        (0, react_1.render)(/>);
        const submitButton = react_1.screen.getByRole('button', { name: /Create Task/i });
        react_1.fireEvent.click(submitButton);
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText(/Task created successfully!/i)).toBeInTheDocument();
        });
    });
    test('displays error message if task creation fails', async () => {
        taskService_1.createTask.mockRejectedValueOnce(new Error('Failed to create task'));
        (0, react_1.render)(/>);
        const submitButton = react_1.screen.getByRole('button', { name: /Create Task/i });
        react_1.fireEvent.click(submitButton);
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText(/Failed to create task/i)).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=taskForm.test.js.map