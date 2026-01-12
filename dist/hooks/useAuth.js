"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = useAuth;
const react_1 = require("react");
function useAuth() {
    const [apiKey, setApiKey] = (0, react_1.useState)(null);
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(false);
    const login = (key) => {
        setApiKey(key);
        setIsAuthenticated(true);
    };
    const logout = () => {
        setApiKey(null);
        setIsAuthenticated(false);
    };
    return { apiKey, isAuthenticated, login, logout };
}
//# sourceMappingURL=useAuth.js.map