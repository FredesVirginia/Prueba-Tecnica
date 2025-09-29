// Mock para los componentes de LoginPage
module.exports = {
  // Mock para la imagen de fondo
  fondoLogin: 'test-image-stub',
  
  // Mock para secureLocalStorage
  secureLocalStorage: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
  }
};