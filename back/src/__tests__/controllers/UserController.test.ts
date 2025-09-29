import { Request, Response } from 'express';
import * as UserController from '../../controller/UserController';
import * as UserServices from '../../services/UserServices';

// Mock de los servicios
jest.mock('../../services/UserServices');

describe('UserController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    mockRequest = {};
    responseObject = {
      statusCode: 0,
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockImplementation((code) => {
        responseObject.statusCode = code;
        return responseObject;
      })
    };
    mockResponse = responseObject;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debería registrar un usuario exitosamente', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      mockRequest.body = userData;
      
      const mockUser = {
        _id: 'user-id-123',
        name: userData.name,
        email: userData.email
      };
      
      (UserServices.registerUser as jest.Mock).mockResolvedValue(mockUser);

      // Act
      await UserController.register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(UserServices.registerUser).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuario registrado exitosamente',
        userId: mockUser._id
      });
    });

    it('debería manejar errores durante el registro', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      mockRequest.body = userData;
      
      const mockError = new Error('Error de prueba');
      (mockError as any).statusCode = 400;
      (mockError as any).code = 'TEST_ERROR';
      
      (UserServices.registerUser as jest.Mock).mockRejectedValue(mockError);

      // Act
      await UserController.register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(UserServices.registerUser).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error de prueba',
        code: 'TEST_ERROR',
        status: 400
      });
    });
  });

  describe('login', () => {
    it('debería iniciar sesión exitosamente', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      mockRequest.body = loginData;
      
      const mockResult = {
        message: 'Login exitoso',
        token: 'jwt-token-123',
        user: {
          _id: 'user-id-123',
          name: 'Test User',
          email: loginData.email
        }
      };
      
      (UserServices.loginUser as jest.Mock).mockResolvedValue(mockResult);

      // Act
      await UserController.login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(UserServices.loginUser).toHaveBeenCalledWith(loginData);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('debería manejar errores durante el login', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      mockRequest.body = loginData;
      
      const mockError = new Error('Credenciales inválidas');
      (mockError as any).statusCode = 401;
      (mockError as any).code = 'INVALID_CREDENTIALS';
      
      (UserServices.loginUser as jest.Mock).mockRejectedValue(mockError);

      // Act
      await UserController.login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(UserServices.loginUser).toHaveBeenCalledWith(loginData);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS',
        status: 401
      });
    });
  });

  describe('getUsers', () => {
    it('debería obtener todos los usuarios exitosamente', async () => {
      // Arrange
      const mockUsers = [
        { _id: 'user-id-1', name: 'User 1', email: 'user1@example.com' },
        { _id: 'user-id-2', name: 'User 2', email: 'user2@example.com' }
      ];
      
      (UserServices.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      // Act
      await UserController.getUsers(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(UserServices.getAllUsers).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it('debería manejar errores al obtener usuarios', async () => {
      // Arrange
      const mockError = new Error('Error al obtener usuarios');
      (mockError as any).statusCode = 500;
      (mockError as any).code = 'SERVER_ERROR';
      
      (UserServices.getAllUsers as jest.Mock).mockRejectedValue(mockError);

      // Act
      await UserController.getUsers(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(UserServices.getAllUsers).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error al obtener usuarios',
        code: 'SERVER_ERROR',
        status: 500
      });
    });
  });
});