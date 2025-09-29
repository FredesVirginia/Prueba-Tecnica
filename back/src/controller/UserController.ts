import { Request, Response } from "express";
import {
  RegisterUserDto,
  LoginUserDto,
  RegisterResponseDto,
} from "../types/dto/UserDto";
import { getAllUsers, loginUser, registerUser } from "../services/UserServices";

export const register = async (req: Request, res: Response) => {
  try {
    const userData: RegisterUserDto = req.body;
    const user = await registerUser(userData);

    const response: RegisterResponseDto = {
      message: "Usuario registrado exitosamente",
      userId: user._id,
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error("Error en register:", error);

    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message,
      code: error.code || "SERVER_ERROR",
      status: status,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const loginData: LoginUserDto = req.body;
    const result = await loginUser(loginData);

    res.json(result);
  } catch (error: any) {
    console.error("Error en login:", error);

    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message,
      code: error.code || "SERVER_ERROR",
      status: status,
    });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error: any) {
    console.error("Error en getAllUsers:", error);

    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message,
      code: error.code || "SERVER_ERROR",
      status: status,
    });
  }
};
