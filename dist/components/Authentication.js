"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// import { useHistory } from 'react-router-dom';
const apiService_1 = require("../services/apiService");
const Authentication = () => {
    const [apiKey, setApiKey] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    // const history = useHistory();
    const handleInputChange = (event) => {
        setApiKey(event.target.value);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const isAuthenticated = await (0, apiService_1.authenticate)(apiKey);
            if (!isAuthenticated) {
                setError('Invalid API Key. Please try again.');
            }
        }
        catch (err) {
            setError('An error occurred during authentication. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "authentication-container", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Efizion Factory UI" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "authentication-form", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "apiKey", children: "API Key:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "apiKey", value: apiKey, onChange: handleInputChange, required: true }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, children: loading ? 'Authenticating...' : 'Login' })] }), error && (0, jsx_runtime_1.jsx)("div", { className: "error-message", children: error })] }));
};
exports.default = Authentication;
//# sourceMappingURL=Authentication.js.map