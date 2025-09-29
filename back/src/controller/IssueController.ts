import {
  createIssue,
  deleteIssue,
  getIssueById,
  getIssues,
  getIssuesWithFilters,
  updateIssue,
} from "../services/IssueServices";
import { IssueDto, UpdateIssueDto } from "@/types/dto/IssueDto";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const issueDto: IssueDto = req.body;
    const issue = await createIssue(issueDto);
    res.status(201).json(issue);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: error.message,
      code: error.code,
    });
  }
};

export const updateAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Extraer el ID del issue de la URL
    const assignedToDto: UpdateIssueDto = req.body; // Recibir todo el DTO

    if (!assignedToDto.assignedTo) {
      res.status(400).json({
        message: "El campo assignedTo es requerido",
      });
      return;
    }

    const updatedIssue = await updateIssue(id!, assignedToDto);
    res.status(200).json({
      message: "Asignación actualizada exitosamente",
      issue: updatedIssue,
    });
  } catch (error: any) {
    console.error("Error en updateAssignment:", error);

    if (error.code === "ISSUE_NOT_FOUND") {
      res.status(404).json({
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      });
    } else if (error.code === "ISSUE_UPDATE_FAILED") {
      res.status(500).json({
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      });
    } else {
      res.status(500).json({
        message: "Error interno del servidor",
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
      });
    }
  }
};

export const getAllIssues = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 5;

    const result = await getIssues(page, limit);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error en getAllIssues:", error);

    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message,
      code: error.code || "SERVER_ERROR",
      status: status,
    });
  }
};

export const getIssueId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const issue = await getIssueById(id!);
    res.status(200).json({
      issue: issue,
    });
  } catch (error: any) {
    console.error("Error en getIssueId:", error);

    // Usamos el statusCode del error
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message,
      code: error.code || "SERVER_ERROR",
      status: status,
    });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteIssue(id!);

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error en deleteIssue:", error);

    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message,
      code: error.code || "SERVER_ERROR",
      status: status,
    });
  }
};


export const getIssuesWithFiltersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, priority, assignedTo, createdBy, title, description } = req.query;
    const page = parseInt(req.query.page as string) || 1;

  
    const filters = {
      ...(status && { status: status as string }),
      ...(priority && { priority: priority as string }),
      ...(assignedTo && { assignedTo: assignedTo as string }),
      ...(createdBy && { createdBy: createdBy as string }),
      ...(title && { title: title as string }),
      ...(description && { description: description as string }),
    };

   
    const result = await getIssuesWithFilters(filters, page, 5);

    res.status(200).json({
      success: true,
      data: result.issues,
      pagination: result.pagination,
      filters: result.filters,
      message: `Se encontraron ${result.pagination.totalIssues} issues con los filtros aplicados`,
    });
  } catch (error: any) {
    console.error("Error en getIssuesWithFiltersController:", error);

    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
    });
  }
};
