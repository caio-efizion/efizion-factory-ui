import { useState, useEffect } from 'react';

export function useAuth() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('efizion_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (key: string) => {
    setApiKey(key);
    setIsAuthenticated(true);
    localStorage.setItem('efizion_api_key', key);
  };

  const logout = () => {
    setApiKey(null);
    setIsAuthenticated(false);
    localStorage.removeItem('efizion_api_key');
  };

  return { apiKey, isAuthenticated, login, logout };
}
