"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useApi = (endpoint, options) => {
    const [data, setData] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const fetchData = (0, react_1.useCallback)(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(endpoint, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            setData(result);
        }
        catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError('Unknown error');
            }
        }
        finally {
            setLoading(false);
        }
    }, [endpoint, options]);
    (0, react_1.useEffect)(() => {
        fetchData();
    }, [fetchData]);
    return { data, error, loading };
};
exports.default = useApi;
//# sourceMappingURL=useApi.js.map