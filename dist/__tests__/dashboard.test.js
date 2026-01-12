"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom/extend-expect");
const taskService_1 = require("../services/taskService");
jest.mock('../services/taskService');
describe('Dashboard Component', () => {
    const mockTasks = [
        { id: 1, name: 'Task 1', status: 'pending' },
        { id: 2, name: 'Task 2', status: 'completed' },
    ];
    beforeEach(() => {
        taskService_1.getTasks.mockResolvedValue(mockTasks);
    });
    test('renders the dashboard with tasks', async () => {
        (0, react_1.render)(/>
            < /Router>);
        expect(react_1.screen.getByText(/Loading tasks.../i)).toBeInTheDocument();
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText('Task 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Task 2')).toBeInTheDocument();
        });
    });
    test('displays error message on API failure', async () => {
        taskService_1.getTasks.mockRejectedValueOnce(new Error('Failed to fetch tasks'));
        (0, react_1.render)(/>
            < /Router>);
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
        });
    });
    test('navigates to task detail on task click', async () => {
        (0, react_1.render)(/>
            < /Router>);
        await (0, react_1.waitFor)(() => {
            const taskLink = react_1.screen.getByText('Task 1');
            react_1.fireEvent.click(taskLink);
        });
        expect(window.location.pathname).toBe('/tasks/1');
    });
    test('displays loading indicator while fetching tasks', async () => {
        (0, react_1.render)(/>
            < /Router>);
        expect(react_1.screen.getByText(/Loading tasks.../i)).toBeInTheDocument();
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.queryByText(/Loading tasks.../i)).not.toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=dashboard.test.js.map