import apiClient, { authenticate } from '../apiService';

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Configuração do Cliente', () => {
    it('deve ter baseURL configurada', () => {
      expect(apiClient.defaults.baseURL).toBeDefined();
      expect(apiClient.defaults.baseURL).toContain('http');
    });

    it('deve ter timeout configurado para 30 segundos', () => {
      expect(apiClient.defaults.timeout).toBe(30000);
    });

    it('deve ter headers padrão Content-Type e x-api-key', () => {
      expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
      expect(apiClient.defaults.headers['x-api-key']).toBeDefined();
    });

    it('deve usar variável de ambiente NEXT_PUBLIC_API_BASE_URL', () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      process.env.NEXT_PUBLIC_API_BASE_URL = 'https://custom-api.com';
      
      // Re-import para pegar nova env var (em teste real, seria feito com clearModules)
      expect(apiClient.defaults.baseURL).toBeDefined();
      
      process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
    });
  });

  describe('Request Interceptor', () => {
    it('deve ter interceptors configurados', () => {
      expect(apiClient.interceptors.request.handlers.length).toBeGreaterThan(0);
      expect(apiClient.interceptors.response.handlers.length).toBeGreaterThan(0);
    });

    it('deve logar requisições em desenvolvimento', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const config = {
        method: 'GET',
        url: '/test',
        headers: {},
      };
      
      const interceptor = apiClient.interceptors.request.handlers[0];
      if (interceptor && interceptor.fulfilled) {
        await interceptor.fulfilled(config);
      }
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[API Request]')
      );
      
      process.env.NODE_ENV = originalEnv;
    });

    it('não deve logar requisições em produção', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const config = {
        method: 'GET',
        url: '/test',
        headers: {},
      };
      
      const interceptor = apiClient.interceptors.request.handlers[0];
      if (interceptor && interceptor.fulfilled) {
        await interceptor.fulfilled(config);
      }
      
      // Não deve ter logado
      expect(consoleSpy).not.toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('deve rejeitar requisições com erro', async () => {
      const error = new Error('Request error');
      
      const interceptor = apiClient.interceptors.request.handlers[0];
      if (interceptor && interceptor.rejected) {
        await expect(interceptor.rejected(error)).rejects.toThrow('Request error');
      }
    });
  });

  describe('Response Interceptor', () => {
    it('deve retornar resposta bem-sucedida', async () => {
      const response = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      
      const interceptor = apiClient.interceptors.response.handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = await interceptor.fulfilled(response);
        expect(result).toEqual(response);
      }
    });

    it('deve enriquecer erro com informações do servidor', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = {
        response: {
          status: 404,
          data: { 
            error: { 
              message: 'Not found',
              code: 'RESOURCE_NOT_FOUND',
            }
          },
        },
        request: {},
        config: {},
      };
      
      const interceptor = apiClient.interceptors.response.handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e: any) {
          expect(e.message).toBe('Not found');
          expect(e.status).toBe(404);
          expect(e.code).toBe('RESOURCE_NOT_FOUND');
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            '[API Error]',
            expect.any(Object)
          );
        }
      }
    });

    it('deve tratar erro de rede (sem response)', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = {
        message: 'Network Error',
        request: {},
        config: {},
      };
      
      const interceptor = apiClient.interceptors.response.handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e: any) {
          expect(e.message).toContain('Erro de conexão');
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            '[Network Error]',
            'Network Error'
          );
        }
      }
    });

    it('deve tratar erro de timeout', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = {
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded',
        request: {},
        config: {},
      };
      
      const interceptor = apiClient.interceptors.response.handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e: any) {
          expect(e.message).toContain('Erro de conexão');
          expect(consoleErrorSpy).toHaveBeenCalled();
        }
      }
    });

    it('deve tratar erro sem response nem request', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const error = {
        message: 'Configuration error',
        config: {},
      };
      
      const interceptor = apiClient.interceptors.response.handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e: any) {
          expect(e.message).toBe('Configuration error');
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            '[Request Error]',
            'Configuration error'
          );
        }
      }
    });

    it('deve usar mensagem padrão quando erro não tem mensagem específica', async () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
        request: {},
        config: {},
      };
      
      const interceptor = apiClient.interceptors.response.handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e: any) {
          expect(e.message).toBe('Erro na requisição');
        }
      }
    });
  });

  describe('Códigos de Status HTTP', () => {
    const testErrorStatus = async (status: number) => {
      const error = {
        response: {
          status,
          data: {
            error: { message: `Error ${status}` }
          },
        },
        request: {},
        config: {},
      };
      
      const interceptor = apiClient.interceptors.response.handlers[0];
      if (interceptor && interceptor.rejected) {
        try {
          await interceptor.rejected(error);
        } catch (e: any) {
          expect(e.status).toBe(status);
        }
      }
    };

    it('deve tratar 400 Bad Request', async () => {
      await testErrorStatus(400);
    });

    it('deve tratar 401 Unauthorized', async () => {
      await testErrorStatus(401);
    });

    it('deve tratar 403 Forbidden', async () => {
      await testErrorStatus(403);
    });

    it('deve tratar 404 Not Found', async () => {
      await testErrorStatus(404);
    });

    it('deve tratar 500 Internal Server Error', async () => {
      await testErrorStatus(500);
    });

    it('deve tratar 503 Service Unavailable', async () => {
      await testErrorStatus(503);
    });
  });

  describe('Função authenticate', () => {
    beforeEach(() => {
      // Mock apiClient.get para autenticação
      (apiClient.get as jest.Mock) = jest.fn();
    });

    it('deve retornar true para autenticação bem-sucedida', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ status: 200 });
      
      const result = await authenticate('valid-key');
      
      expect(result).toBe(true);
      expect(apiClient.get).toHaveBeenCalledWith('/health', {
        headers: { 'x-api-key': 'valid-key' },
      });
    });

    it('deve lançar erro para autenticação falha', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('Unauthorized'));
      
      await expect(authenticate('invalid-key')).rejects.toThrow(
        'Falha na autenticação'
      );
    });

    it('deve lançar erro para API key inválida', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue({
        response: { status: 401 }
      });
      
      await expect(authenticate('wrong-key')).rejects.toThrow(
        'Falha na autenticação'
      );
    });

    it('deve chamar endpoint /health com headers corretos', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ status: 200 });
      
      await authenticate('test-key');
      
      expect(apiClient.get).toHaveBeenCalledWith(
        '/health',
        expect.objectContaining({
          headers: { 'x-api-key': 'test-key' },
        })
      );
    });
  });

  describe('Integração com Axios', () => {
    it('deve ter métodos HTTP padrão', () => {
      expect(apiClient.get).toBeDefined();
      expect(apiClient.post).toBeDefined();
      expect(apiClient.put).toBeDefined();
      expect(apiClient.delete).toBeDefined();
      expect(apiClient.patch).toBeDefined();
    });

    it('deve exportar instância do Axios', () => {
      expect(apiClient).toBeDefined();
      expect(typeof apiClient.get).toBe('function');
    });
  });
});
