import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate API key by making a test request
      const response = await axios.get('/api/validate-key', {
        headers: {
          'x-api-key': apiKey,
        },
      });

      if (response.status === 200) {
        // Store API key in local storage for future requests
        localStorage.setItem('apiKey', apiKey);
        router.push('/dashboard');
      } else {
        setError('Invalid API Key');
      }
    } catch (err) {
      setError('Failed to validate API Key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Efizion Factory Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="apiKey">API Key</label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={handleApiKeyChange}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Validating...' : 'Login'}
        </button>
      </form>
      <style jsx>{`
        .auth-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        .input-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          box-sizing: border-box;
        }
        .error {
          color: red;
          margin-top: 0.5rem;
        }
        button {
          padding: 0.5rem 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:disabled {
          background-color: #ccc;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;