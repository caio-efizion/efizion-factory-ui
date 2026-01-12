import { useState, useEffect, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface RequestOptions {
  method: string;
  headers: HeadersInit;
  body?: string;
}

const useApi = <T,>(endpoint: string, options: RequestOptions): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading };
};

export default useApi;