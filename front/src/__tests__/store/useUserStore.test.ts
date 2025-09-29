import { useUserStore } from '../../store/useUserStore';
import { act } from '@testing-library/react';

// Mock de react-secure-storage
jest.mock('react-secure-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('useUserStore', () => {
  beforeEach(() => {
    // Limpiar el estado entre pruebas
    act(() => {
      useUserStore.setState({
        user: {
          _id: '',
          name: '',
          email: '',
        }
      });
    });
  });

  test('debe tener un estado inicial correcto', () => {
    const state = useUserStore.getState();
    
    expect(state.user).toEqual({
      _id: '',
      name: '',
      email: '',
    });
    expect(typeof state.setUser).toBe('function');
  });

  test('debe actualizar el usuario correctamente', () => {
    const mockUser = {
      _id: '123',
      name: 'Test User',
      email: 'test@example.com',
    };
    
    act(() => {
      useUserStore.getState().setUser(mockUser);
    });
    
    const updatedState = useUserStore.getState();
    expect(updatedState.user).toEqual(mockUser);
  });
});