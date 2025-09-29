import request from 'supertest';
import express, { Express } from 'express';
import userRoutes from '../../routes/userRoutes';
import * as UserController from '../../controller/UserController';

// Mock del controlador
jest.mock('../../controller/UserController');
jest.mock('../../middleware/validateUser', () => ({
  validateRegister: () => (req: any, res: any, next: any) => next(),
  validateLogin: () => (req: any, res: any, next: any) => next()
}));

describe('User Routes', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('debería llamar al controlador getUsers', async () => {
      // Arrange
      const mockUsers = [
        { _id: 'user-id-1', name: 'User 1', email: 'user1@example.com' },
        { _id: 'user-id-2', name: 'User 2', email: 'user2@example.com' }
      ];
      
      (UserController.getUsers as jest.Mock).mockImplementation((req, res) => {
        res.json(mockUsers);
      });

      // Act
      const response = await request(app).get('/api/users');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(UserController.getUsers).toHaveBeenCalled();
    });
  });

  describe('POST /api/users/register', () => {
    it('debería llamar al controlador register', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockResponse = {
        message: 'Usuario registrado exitosamente',
        userId: 'user-id-123'
      };
      
      (UserController.register as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      // Act
      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(UserController.register).toHaveBeenCalled();
    });
  });

  describe('POST /api/users/login', () => {
    it('debería llamar al controlador login', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockResponse = {
        message: 'Login exitoso',
        token: 'jwt-token-123',
        user: {
          _id: 'user-id-123',
          name: 'Test User',
          email: loginData.email
        }
      };
      
      (UserController.login as jest.Mock).mockImplementation((req, res) => {
        res.json(mockResponse);
      });

      // Act
      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(UserController.login).toHaveBeenCalled();
    });
  });
});