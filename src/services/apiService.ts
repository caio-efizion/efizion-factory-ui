import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.efizion-factory.com';

export const authenticate = async (apiKey: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth`, {
      headers: { 'x-api-key': apiKey },
    });
    return response.data;
  } catch (error) {
    throw new Error('Authentication failed. Please check your API key.');
  }
};
