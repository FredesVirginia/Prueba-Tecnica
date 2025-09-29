import { login, getAllUser } from '../../../hooks/useUsers/request';
import { issueApi } from '../../../api/api';

// Mock del módulo axios
jest.mock('../../../api/api', () => ({
  issueApi: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('User API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    test('debe retornar datos de login exitoso', async () => {
      // Mock de respuesta exitosa
      const mockResponse = {
        data: {
          token: 'fake-token',
          user: { _id: '123', name: 'Test User', email: 'test@example.com' }
        }
      };
      
      (issueApi.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      const credentials = { email: 'test@example.com', password: 'password123' };
      const result = await login(credentials);
      
      expect(issueApi.post).toHaveBeenCalledWith('/users/login', credentials);
      expect(result).toEqual(mockResponse.data);
    });

    test('debe manejar errores de login', async () => {
      // Mock de respuesta con error
      const mockError = {
        response: {
          data: { code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas' }
        }
      };
      
      (issueApi.post as jest.Mock).mockRejectedValueOnce(mockError);
      
      const credentials = { email: 'wrong@example.com', password: 'wrongpassword' };
      
      await expect(login(credentials)).rejects.toEqual(mockError.response.data);
      expect(issueApi.post).toHaveBeenCalledWith('/users/login', credentials);
    });
  });

  describe('getAllUser', () => {
    test('debe retornar lista de usuarios', async () => {
      // Mock de respuesta exitosa
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@example.com' },
        { _id: '2', name: 'User 2', email: 'user2@example.com' }
      ];
      
      const mockResponse = { data: mockUsers };
      (issueApi.get as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      const result = await getAllUser();
      
      expect(issueApi.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
    });

    test('debe manejar errores al obtener usuarios', async () => {
      // Mock de respuesta con error
      const mockError = {
        response: {
          data: { code: 'SERVER_ERROR', message: 'Error del servidor' }
        }
      };
      
      (issueApi.get as jest.Mock).mockRejectedValueOnce(mockError);
      
      await expect(getAllUser()).rejects.toEqual(mockError.response.data);
      expect(issueApi.get).toHaveBeenCalledWith('/users');
    });
  });
});