import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User";

export const validateRegister = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validación del nombre
      await body("name")
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .isLength({ min: 2, max: 50 })
        .withMessage("El nombre debe tener entre 2 y 50 caracteres")
        .trim()
        .escape()
        .run(req);

      // Validación del email
      await body("email")
        .notEmpty()
        .withMessage("El email es obligatorio")
        .isEmail()
        .withMessage("El formato del email es inválido")
        .custom(async (value) => {
          const existingUser = await User.findOne({ email: value });
          if (existingUser) {
            throw new Error("Este email ya está registrado");
          }
          return true;
        })
        .trim()
        .normalizeEmail()
        .run(req);

      // Validación de la contraseña
      await body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .isLength({ min: 6, max: 50 })
        .withMessage("La contraseña debe tener entre 6 y 50 caracteres")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/)
        .withMessage("La contraseña debe contener al menos una letra y un número")
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
      console.error("Error en la validación del registro:", error);
      res.status(500).json({
        success: false,
        message: "Error interno durante la validación",
        code: "VALIDATION_ERROR",
        error: error.message
      });
    }
  };
};

export const validateLogin = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validación del email
      await body("email")
        .notEmpty()
        .withMessage("El email es obligatorio")
        .isEmail()
        .withMessage("El formato del email es inválido")
        .trim()
        .normalizeEmail()
        .run(req);

      // Validación de la contraseña
      await body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .isLength({ min: 6, max: 50 })
        .withMessage("La contraseña debe tener entre 6 y 50 caracteres")
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
      console.error("Error en la validación del login:", error);
      res.status(500).json({
        success: false,
        message: "Error interno durante la validación",
        code: "VALIDATION_ERROR",
        error: error.message
      });
    }
  };
};

