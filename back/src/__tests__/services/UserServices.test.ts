import * as UserServices from '../../services/UserServices';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock de los módulos
jest.mock('../../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('debería registrar un usuario exitosamente', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockUser = {
        _id: {
          toString: jest.fn().mockReturnValue('user-id-123')
        },
        name: userData.name,
        email: userData.email,
        password: 'hashed-password'
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await UserServices.registerUser(userData);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        password: 'hashed-password'
      });
      expect(result).toEqual({
        _id: 'user-id-123',
        name: userData.name,
        email: userData.email
      });
    });

    it('debería lanzar un error si el email ya está registrado', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      const existingUser = {
        _id: 'existing-user-id',
        name: 'Existing User',
        email: userData.email
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(existingUser);

      // Act & Assert
      try {
        await UserServices.registerUser(userData);
        fail('Se esperaba que la función lanzara un error');
      } catch (error: any) {
        expect(error.message).toBe('El email ya está registrado');
        expect(error.code).toBe('EMAIL_ALREADY_EXISTS');
        expect(error.statusCode).toBe(400);
      }
      
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('debería iniciar sesión exitosamente', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockUser = {
        _id: {
          toString: jest.fn().mockReturnValue('user-id-123')
        },
        name: 'Test User',
        email: loginData.email,
        password: 'hashed-password'
      };
      
      process.env.JWT_SECRET = 'test-secret';
      
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      // Act
      const result = await UserServices.loginUser(loginData);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user-id-123' },
        'test-secret',
        { expiresIn: '1h' }
      );
      expect(result).toEqual({
        message: 'Login exitoso',
        token: 'mock-token',
        user: {
          _id: 'user-id-123',
          name: mockUser.name,
          email: mockUser.email
        }
      });
    });

    it('debería lanzar un error si el email no existe', async () => {
      // Arrange
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      try {
        await UserServices.loginUser(loginData);
        fail('Se esperaba que la función lanzara un error');
      } catch (error: any) {
        expect(error.message).toBe('Email no encontrado');
        expect(error.code).toBe('INVALID_CREDENTIALS');
        expect(error.statusCode).toBe(401);
      }
      
      expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('debería lanzar un error si la contraseña es incorrecta', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'wrong-password'
      };
      
      const mockUser = {
        _id: 'user-id-123',
        name: 'Test User',
        email: loginData.email,
        password: 'hashed-password'
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      try {
        await UserServices.loginUser(loginData);
        fail('Se esperaba que la función lanzara un error');
      } catch (error: any) {
        expect(error.message).toBe('Contraseña incorrecta');
        expect(error.code).toBe('INVALID_CREDENTIALS');
        expect(error.statusCode).toBe(401);
      }
      
      expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
    });
  });

  describe('getAllUsers', () => {
    it('debería obtener todos los usuarios', async () => {
      // Arrange
      const mockUsers = [
        {
          _id: {
            toString: jest.fn().mockReturnValue('user-id-1')
          },
          name: 'User 1',
          email: 'user1@example.com',
          password: 'hashed-password-1'
        },
        {
          _id: {
            toString: jest.fn().mockReturnValue('user-id-2')
          },
          name: 'User 2',
          email: 'user2@example.com',
          password: 'hashed-password-2'
        }
      ];
      
      const mockSelect = jest.fn().mockReturnThis();
      (User.find as jest.Mock).mockReturnValue({
        select: mockSelect
      });
      mockSelect.mockResolvedValue(mockUsers);

      // Act
      const result = await UserServices.getAllUsers();

      // Assert
      expect(User.find).toHaveBeenCalled();
      expect(mockSelect).toHaveBeenCalledWith('-password');
      expect(result).toEqual([
        {
          _id: 'user-id-1',
          name: 'User 1',
          email: 'user1@example.com'
        },
        {
          _id: 'user-id-2',
          name: 'User 2',
          email: 'user2@example.com'
        }
      ]);
    });

    it('debería manejar errores al obtener usuarios', async () => {
      // Arrange
      const mockError = new Error('Error al obtener usuarios');
      
      const mockSelect = jest.fn().mockReturnThis();
      (User.find as jest.Mock).mockReturnValue({
        select: mockSelect
      });
      mockSelect.mockRejectedValue(mockError);

      // Act & Assert
      try {
        await UserServices.getAllUsers();
        fail('Se esperaba que la función lanzara un error');
      } catch (error: any) {
        expect(error.message).toBe('Error interno del servidor');
        expect(error.code).toBe('SERVER_ERROR');
        expect(error.statusCode).toBe(500);
      }
      
      expect(User.find).toHaveBeenCalled();
      expect(mockSelect).toHaveBeenCalledWith('-password');
    });
  });
});
