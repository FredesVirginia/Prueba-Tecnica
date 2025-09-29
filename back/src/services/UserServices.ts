import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  RegisterUserDto,
  LoginUserDto,
  LoginResponseDto,
} from "@/types/dto/UserDto";

export const registerUser = async (userData: RegisterUserDto) => {
  try {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error: any = new Error("El email ya está registrado");
      error.code = "EMAIL_ALREADY_EXISTS";
      error.statusCode = 400;
      throw error;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  } catch (error: any) {
    if (error.code) {
      throw error;
    }

    console.error("Error no manejado en registerUser:", error);
    const serverError: any = new Error("Error interno del servidor");
    serverError.code = "SERVER_ERROR";
    serverError.statusCode = 500;
    throw serverError;
  }
};

export const loginUser = async (
  loginData: LoginUserDto
): Promise<LoginResponseDto> => {
  try {
    const { email, password } = loginData;

    const user = await User.findOne({ email });
    if (!user) {
      const error: any = new Error("Email no encontrado");
      error.code = "INVALID_CREDENTIALS";
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error: any = new Error("Contraseña incorrecta");
      error.code = "INVALID_CREDENTIALS";
      error.statusCode = 401;
      throw error;
    }

    try {
      if (!process.env.JWT_SECRET) {
        const configError: any = new Error(
          "Error de configuración: JWT_SECRET no está configurado"
        );
        configError.code = "CONFIG_ERROR";
        configError.statusCode = 500;
        throw configError;
      }

      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        message: "Login exitoso",
        token,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      };
    } catch (error: any) {
      const tokenError: any = new Error(
        "Error al generar el token de autenticación"
      );
      tokenError.code = "TOKEN_GENERATION_ERROR";
      tokenError.statusCode = 500;
      throw tokenError;
    }
  } catch (error: any) {
    if (error.code) {
      throw error;
    }

    console.error("Error no manejado en loginUser:", error);
    const serverError: any = new Error("Error interno del servidor");
    serverError.code = "SERVER_ERROR";
    serverError.statusCode = 500;
    throw serverError;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await User.find().select("-password");
    const data = users.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    }));
    return data
  } catch (error: any) {
    if (error.code) {
      throw error;
    }

    console.error("Error no manejado en getAllUsers:", error);
    const serverError: any = new Error("Error interno del servidor");
    serverError.code = "SERVER_ERROR";
    serverError.statusCode = 500;
    throw serverError;
  }
};
