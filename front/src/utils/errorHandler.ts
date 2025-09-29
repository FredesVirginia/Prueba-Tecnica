export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NO_UPDATE_DATA: 'NO_UPDATE_DATA',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
} as const;

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];

export const getErrorMessage = (code: string): string => {
  const errorMessages: Record<string, string> = {
    [ErrorCode.VALIDATION_ERROR]: 'Hay campos inválidos o faltantes',
    [ErrorCode.SERVER_ERROR]: 'Error interno del servidor',
    [ErrorCode.NOT_FOUND]: 'Recurso no encontrado',
    [ErrorCode.UNAUTHORIZED]: 'No autorizado',
    [ErrorCode.NO_UPDATE_DATA]: 'No hay datos para actualizar',
    [ErrorCode.INVALID_CREDENTIALS]: 'Credenciales inválidas',
  };

  return errorMessages[code] || 'Error desconocido';
};

interface ErrorResponse {
  success: boolean;
  message?: string;
  code?: string;
  errors?: Record<string, string>;
}

export const handleApiError = (error: any): string => {
  const errorData = error?.response?.data as ErrorResponse;
  
  if (!errorData) {
    return 'Error de conexión';
  }

  // Si hay errores de validación específicos, mostramos el primero de forma más amigable
  if (errorData.code === ErrorCode.VALIDATION_ERROR && errorData.errors) {
    const errorMessages = Object.entries(errorData.errors).map(([field, message]) => {
      // Convertir nombres de campo a formato más amigable
      const fieldNames: Record<string, string> = {
        'title': 'Título',
        'description': 'Descripción',
        'status': 'Estado',
        'priority': 'Prioridad',
        'assignedTo': 'Asignado a',
        'createdBy': 'Creado por'
      };
      
      const readableField = fieldNames[field] || field;
      return `${readableField}: ${message}`;
    });
    
    return errorMessages.join(', ');
  }

  // Si hay un mensaje específico del servidor, lo usamos
  if (errorData.message) {
    return errorData.message;
  }

  // Si hay un código de error, usamos el mensaje genérico
  if (errorData.code) {
    return getErrorMessage(errorData.code);
  }

  return 'Error desconocido';
};