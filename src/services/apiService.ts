import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiError } from '../types';

/**
 * URL base da API - configurável via environment variable
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:3001';

/**
 * API Key para autenticação - configurável via environment variable
 */
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || process.env.REACT_APP_API_KEY || 'dev-api-key';

/**
 * Instância configurada do Axios com interceptors
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  timeout: 30000, // 30 segundos
});

/**
 * Interceptor de request para logging (apenas em dev)
 */
apiClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de response para tratamento de erros
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Erro com resposta do servidor
      const apiError = error.response.data;
      console.error('[API Error]', apiError);
      
      // Adicionar informações úteis ao erro
      const enhancedError = new Error(apiError?.error?.message || 'Erro na requisição');
      (enhancedError as any).response = error.response;
      (enhancedError as any).status = error.response.status;
      (enhancedError as any).code = apiError?.error?.code;
      
      return Promise.reject(enhancedError);
    } else if (error.request) {
      // Erro de rede (sem resposta)
      const networkError = new Error('Erro de conexão. Verifique sua internet.');
      console.error('[Network Error]', error.message);
      return Promise.reject(networkError);
    } else {
      // Erro na configuração da requisição
      console.error('[Request Error]', error.message);
      return Promise.reject(error);
    }
  }
);

/**
 * Verifica autenticação com a API
 */
export const authenticate = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health', {
      headers: { 'x-api-key': apiKey },
    });
    return response.status === 200;
  } catch (error) {
    throw new Error('Falha na autenticação. Verifique sua API key.');
  }
};

export default apiClient;
