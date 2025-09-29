import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { Status, Priority } from "../types/enums/enums";
import mongoose from "mongoose";
import User from "../models/User";

export const validateIssues = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validación del título
      await body("title")
        .notEmpty()
        .withMessage("El título es obligatorio")
        .isLength({ min: 3, max: 100 })
        .withMessage("El título debe tener entre 3 y 100 caracteres")
        .trim()
        .escape()
        .run(req);

      // Validación de la descripción
      await body("description")
        .notEmpty()
        .withMessage("La descripción es obligatoria")
        .isLength({ min: 10, max: 1000 })
        .withMessage("La descripción debe tener entre 10 y 1000 caracteres")
        .trim()
        .run(req);

      // Validación del estado
      await body("status")
        .optional()
        .isIn(Object.values(Status))
        .withMessage(`Estado inválido. Valores permitidos: ${Object.values(Status).join(", ")}`)
        .run(req);

      // Validación de la prioridad
      await body("priority")
        .optional()
        .isIn(Object.values(Priority))
        .withMessage(`Prioridad inválida. Valores permitidos: ${Object.values(Priority).join(", ")}`)
        .run(req);

      // Validación del creador
      await body("createdBy")
        .notEmpty()
        .withMessage("El campo createdBy es obligatorio")
        .isMongoId()
        .withMessage("El ID de createdBy debe ser un ID válido de MongoDB")
        .custom(async (value) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("ID de usuario inválido");
          }
          const user = await User.findById(value);
          if (!user) {
            throw new Error("El usuario creador no existe");
          }
          return true;
        })
        .run(req);

      // Validación del usuario asignado
      await body("assignedTo")
        .optional()
        .isMongoId()
        .withMessage("El ID de assignedTo debe ser un ID válido de MongoDB")
        .custom(async (value) => {
          if (value) {
            if (!mongoose.Types.ObjectId.isValid(value)) {
              throw new Error("ID de usuario asignado inválido");
            }
            const user = await User.findById(value);
            if (!user) {
              throw new Error("El usuario asignado no existe");
            }
          }
          return true;
        })
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().reduce((acc: any, error: any) => {
          if (!acc[error.path]) {
            acc[error.path] = error.msg;
          }
          return acc;
        }, {});

        res.status(400).json({
          success: false,
          errors: errorMessages,
          code: "VALIDATION_ERROR"
        });
        return;
      }

      next();
    } catch (error: any) {
      console.error("Error en la validación:", error);
      res.status(500).json({
        success: false,
        message: "Error interno durante la validación",
        code: "VALIDATION_ERROR",
        error: error.message
      });
    }
  };
};
