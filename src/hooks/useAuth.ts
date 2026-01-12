import { useState } from 'react';

export function useAuth() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (key: string) => {
    setApiKey(key);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setApiKey(null);
    setIsAuthenticated(false);
  };

  return { apiKey, isAuthenticated, login, logout };
}
