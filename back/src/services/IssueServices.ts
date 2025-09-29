import Issues from "../models/Issues";
import User from "../models/User";
import { IssueDto, UpdateIssueDto } from "../types/dto/IssueDto";
import { Priority, Status } from "../types/enums/enums";
import mongoose from "mongoose";

export const createIssue = async (issueData: IssueDto) => {
  try {
    const createdByUser = await User.findById(issueData.createdBy);
    if (!createdByUser) {
      const error = new Error("El usuario createdBy no existe");
      (error as any).code = "USER_NOT_FOUND";
      (error as any).statusCode = 400;
      throw error;
    }

    const assignedToUser = await User.findById(issueData.assignedTo);
    if (assignedToUser) {
      if (!assignedToUser) {
        const error = new Error("El usuario assignedTo no existe");
        (error as any).code = "USER_NOT_FOUND";
        (error as any).statusCode = 400;
        throw error;
      }
    }

    const issue = await Issues.create(issueData);
    return issue;
  } catch (error: any) {
    if (error.code) {
      throw error;
    }

    console.error("Error al crear issue:", error);
    const serverError = new Error("Error al crear el issue");
    (serverError as any).code = "SERVER_ERROR";
    (serverError as any).statusCode = 500;
    throw serverError;
  }
};

export const getIssues = async (page: number = 1, limit: number = 5) => {
  try {
    // Validar parámetros de paginación
    if (page < 1) {
      const error = new Error("El número de página debe ser mayor a 0");
      (error as any).code = "INVALID_PAGE";
      (error as any).statusCode = 400;
      throw error;
    }

    if (limit < 1 || limit > 50) {
      const error = new Error("El límite debe estar entre 1 y 50");
      (error as any).code = "INVALID_LIMIT";
      (error as any).statusCode = 400;
      throw error;
    }

    // Calcular el skip para la paginación
    const skip = (page - 1) * limit;

    // Obtener el total de issues para calcular metadatos
    const total = await Issues.countDocuments();

    // Obtener los issues con paginación
    const issues = await Issues.find()
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); 

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      issues,
      pagination: {
        currentPage: page,
        totalPages,
        totalIssues: total,
        issuesPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
    };
  } catch (error: any) {
   
    if (error.code) {
      throw error;
    }

    console.error("Error al obtener issues:", error);
    const serverError = new Error("Error al obtener los issues");
    (serverError as any).code = "SERVER_ERROR";
    (serverError as any).statusCode = 500;
    throw serverError;
  }
};

export const getIssueById = async (issueId: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      const error = new Error("ID de issue inválido");
      (error as any).code = "INVALID_ID";
      (error as any).statusCode = 400;
      throw error;
    }

    const issue = await Issues.findById(issueId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!issue) {
      const error = new Error("Issue no encontrado");
      (error as any).code = "NOT_FOUND";
      (error as any).statusCode = 404;
      throw error;
    }

    return issue;
  } catch (error: any) {
    if (error.code) {
      throw error;
    }

    console.error("Error al obtener issue:", error);
    const serverError = new Error("Error al obtener el issue");
    (serverError as any).code = "SERVER_ERROR";
    (serverError as any).statusCode = 500;
    throw serverError;
  }
};


export const updateIssue = async (
  issueId: string,
  updateData: UpdateIssueDto
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      const error = new Error("ID de issue inválido");
      (error as any).code = "INVALID_ID";
      (error as any).statusCode = 400;
      throw error;
    }

    if (Object.keys(updateData).length === 0) {
      const error = new Error("No se proporcionaron datos para actualizar");
      (error as any).code = "INVALID_DATA";
      (error as any).statusCode = 400;
      throw error;
    }

    const issue = await Issues.findByIdAndUpdate(
      issueId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!issue) {
      const error = new Error("Issue no encontrado");
      (error as any).code = "NOT_FOUND";
      (error as any).statusCode = 404;
      throw error;
    }

    return issue;
  } catch (error: any) {
    if (error.code) {
      throw error;
    }

    console.error("Error al actualizar issue:", error);
    const serverError = new Error("Error al actualizar el issue");
    (serverError as any).code = "SERVER_ERROR";
    (serverError as any).statusCode = 500;
    throw serverError;
  }
};

// Función genérica para filtrar issues con múltiples criterios
export const getIssuesWithFilters = async (
  filters: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    createdBy?: string;
    title?: string;
    description?: string;
  } = {},
  page: number = 1,
  limit: number = 5
) => {
  try {
   
    if (page < 1) {
      const error = new Error("El número de página debe ser mayor a 0");
      (error as any).code = "INVALID_PAGE";
      (error as any).statusCode = 400;
      throw error;
    }

   
    const mongoFilters: any = {};
    
    // Validar y agregar filtro de status
    if (filters.status) {
      if (!Object.values(Status).includes(filters.status as Status)) {
        const error = new Error(`Status inválido. Valores permitidos: ${Object.values(Status).join(', ')}`);
        (error as any).code = "INVALID_STATUS";
        (error as any).statusCode = 400;
        throw error;
      }
      mongoFilters.status = filters.status;
    }
    
    // Validar y agregar filtro de priority
    if (filters.priority) {
      if (!Object.values(Priority).includes(filters.priority as Priority)) {
        const error = new Error(`Priority inválido. Valores permitidos: ${Object.values(Priority).join(', ')}`);
        (error as any).code = "INVALID_PRIORITY";
        (error as any).statusCode = 400;
        throw error;
      }
      mongoFilters.priority = filters.priority;
    }
    
    // Validar y agregar filtro de assignedTo
    if (filters.assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(filters.assignedTo)) {
        const error = new Error("ID de usuario assignedTo inválido");
        (error as any).code = "INVALID_USER_ID";
        (error as any).statusCode = 400;
        throw error;
      }
      
      const assignedUser = await User.findById(filters.assignedTo);
      if (!assignedUser) {
        const error = new Error("El usuario assignedTo no existe");
        (error as any).code = "USER_NOT_FOUND";
        (error as any).statusCode = 404;
        throw error;
      }
      
      mongoFilters.assignedTo = filters.assignedTo;
    }
    
    // Validar y agregar filtro de createdBy
    if (filters.createdBy) {
      if (!mongoose.Types.ObjectId.isValid(filters.createdBy)) {
        const error = new Error("ID de usuario createdBy inválido");
        (error as any).code = "INVALID_USER_ID";
        (error as any).statusCode = 400;
        throw error;
      }
      
      const createdUser = await User.findById(filters.createdBy);
      if (!createdUser) {
        const error = new Error("El usuario createdBy no existe");
        (error as any).code = "USER_NOT_FOUND";
        (error as any).statusCode = 404;
        throw error;
      }
      
      mongoFilters.createdBy = filters.createdBy;
    }
    
    // Agregar filtro de búsqueda por título (usando expresión regular para búsqueda parcial)
    if (filters.title && filters.title.trim() !== '') {
      mongoFilters.title = { $regex: filters.title, $options: 'i' }; // 'i' para hacer la búsqueda case-insensitive
    }
    
    // Agregar filtro de búsqueda por descripción (usando expresión regular para búsqueda parcial)
    if (filters.description && filters.description.trim() !== '') {
      mongoFilters.description = { $regex: filters.description, $options: 'i' };
    }

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

   
    const totalIssues = await Issues.countDocuments(mongoFilters);

    
    const issues = await Issues.find(mongoFilters)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    
    const totalPages = Math.ceil(totalIssues / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;

    return {
      issues,
      pagination: {
        currentPage: page,
        totalPages,
        totalIssues,
        issuesPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
      },
      filters: {
        applied: mongoFilters,
        available: {
          status: Object.values(Status),
          priority: Object.values(Priority)
        }
      }
    };
  } catch (error: any) {
    if (error.code) {
      throw error;
    }

    console.error("Error al obtener issues con filtros:", error);
    const serverError = new Error("Error interno del servidor al obtener issues");
    (serverError as any).code = "SERVER_ERROR";
    (serverError as any).statusCode = 500;
    throw serverError;
  }
};

export const deleteIssue = async (issueId: string) => {
  try {
    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      const error = new Error("ID de issue inválido");
      (error as any).code = "INVALID_ID";
      (error as any).statusCode = 400;
      throw error;
    }

    const deletedIssue = await Issues.findByIdAndDelete(issueId);

    if (!deletedIssue) {
      const error = new Error("Issue no encontrado");
      (error as any).code = "NOT_FOUND";
      (error as any).statusCode = 404;
      throw error;
    }

    return {
      message: "Issue eliminado correctamente",
      deletedIssue,
    };
  } catch (error: any) {
    if (error.code) {
      throw error;
    }

    console.error("Error al eliminar issue:", error);
    const serverError = new Error("Error al eliminar el issue");
    (serverError as any).code = "SERVER_ERROR";
    (serverError as any).statusCode = 500;
    throw serverError;
  }
};
