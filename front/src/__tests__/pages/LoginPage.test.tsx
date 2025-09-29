import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';
import * as userRequests from '../../hooks/useUsers/request';
import { useUserStore } from '../../store/useUserStore';
import toast from 'react-hot-toast';

// Mock de los módulos necesarios
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../hooks/useUsers/request', () => ({
  login: jest.fn(),
}));

jest.mock('../../store/useUserStore', () => ({
  useUserStore: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('react-secure-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

// Mock para la imagen
jest.mock('../../assets/fondoLogin.jpg', () => ({
  default: 'test-image-stub'
}));

// Mock para los componentes de rsuite
jest.mock('rsuite', () => {
  const original = jest.requireActual('rsuite');
  return {
    ...original,
    Button: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => <button {...props}>{children}</button>,
    Input: ({ ...props }: { [key: string]: any }) => <input {...props} />,
    InputGroup: {
      ...original.InputGroup,
      Button: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => <button {...props}>{children}</button>,
      Addon: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => <span {...props}>{children}</span>
    }
  };
});

describe('LoginPage', () => {
  const mockSetUser = jest.fn();
  
  beforeEach(() => {
    // Configuración de los mocks antes de cada test
    (useUserStore as any).mockReturnValue({
      setUser: mockSetUser,
    });
    
    jest.clearAllMocks();
  });
  
  // Saltamos temporalmente estos tests para no romper lo que ya funciona
  it.skip('should render login form', () => {
    // Test saltado temporalmente
  });

  test('renderiza correctamente el formulario de login', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Bug Hunters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese su correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese su contraseña')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  test('muestra errores de validación cuando los campos están vacíos', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    const submitButton = screen.getByText('Iniciar Sesión');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('required')).toBeInTheDocument();
    });
  });

  test('realiza login exitoso con credenciales válidas', async () => {
    const mockUser = { _id: '123', name: 'Test User', email: 'test@example.com' };
    const mockResponse = { token: 'fake-token', user: mockUser };
    
    (userRequests.login as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Completar el formulario
    fireEvent.change(screen.getByPlaceholderText('Ingrese su correo electrónico'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByPlaceholderText('Ingrese su contraseña'), {
      target: { value: 'password123' },
    });
    
    // Enviar el formulario
    const submitButton = screen.getByText('Iniciar Sesión');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // Verificar que se llamó a la función login con las credenciales correctas
      expect(userRequests.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      
      // Verificar que se guardó el usuario en el store
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      
      // Verificar que se mostró un mensaje de éxito
      expect(toast.success).toHaveBeenCalledWith('¡Login exitoso!');
    });
  });

  test('muestra error cuando las credenciales son inválidas', async () => {
    const mockError = { code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas' };
    (userRequests.login as jest.Mock).mockRejectedValueOnce(mockError);
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Completar el formulario
    fireEvent.change(screen.getByPlaceholderText('Ingrese su correo electrónico'), {
      target: { value: 'wrong@example.com' },
    });
    
    fireEvent.change(screen.getByPlaceholderText('Ingrese su contraseña'), {
      target: { value: 'wrongpassword' },
    });
    
    // Enviar el formulario
    const submitButton = screen.getByText('Iniciar Sesión');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // Verificar que se mostró un mensaje de error
      expect(toast.error).toHaveBeenCalledWith('Credenciales inválidas');
    });
  });
});