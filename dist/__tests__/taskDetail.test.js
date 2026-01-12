"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const taskService_1 = require("../services/taskService");
const test_utils_1 = require("react-dom/test-utils");
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
        taskService_1.getTaskDetail.mockResolvedValue(mockTaskDetail);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('renders task details correctly', async () => {
        await (0, test_utils_1.act)(async () => {
            (0, react_1.render)(taskId, "1" /  > );
        });
        expect(react_1.screen.getByText(/Loading.../i)).toBeInTheDocument();
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText(/Sample Task/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/In Progress/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/Sample output/i)).toBeInTheDocument();
        });
        mockTaskDetail.logs.forEach((log) => {
            expect(react_1.screen.getByText(log)).toBeInTheDocument();
        });
    });
    test('displays error message on API failure', async () => {
        taskService_1.getTaskDetail.mockRejectedValueOnce(new Error('Failed to fetch task details'));
        await (0, test_utils_1.act)(async () => {
            (0, react_1.render)(taskId, "1" /  > );
        });
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText(/Error loading task details/i)).toBeInTheDocument();
        });
    });
    test('updates status in real-time', async () => {
        const updatedTaskDetail = { ...mockTaskDetail, status: 'Completed' };
        taskService_1.getTaskDetail.mockResolvedValueOnce(updatedTaskDetail);
        await (0, test_utils_1.act)(async () => {
            (0, react_1.render)(taskId, "1" /  > );
        });
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText(/Completed/i)).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=taskDetail.test.js.map