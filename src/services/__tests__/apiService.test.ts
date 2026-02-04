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
  });

  describe('Interceptors', () => {
    it('deve ter interceptors de request configurados', () => {
      expect(apiClient.interceptors.request).toBeDefined();
      expect(apiClient.interceptors.request.use).toBeDefined();
    });

    it('deve ter interceptors de response configurados', () => {
      expect(apiClient.interceptors.response).toBeDefined();
      expect(apiClient.interceptors.response.use).toBeDefined();
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
