import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authenticate } from '../services/apiService';

const Authentication: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const isAuthenticated = await authenticate(apiKey);
      if (isAuthenticated) {
        history.push('/dashboard');
      } else {
        setError('Invalid API Key. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authentication-container">
      <h1>Efizion Factory UI</h1>
      <form onSubmit={handleSubmit} className="authentication-form">
        <label htmlFor="apiKey">API Key:</label>
        <input
          type="text"
          id="apiKey"
          value={apiKey}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Authentication;