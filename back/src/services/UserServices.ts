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
      const error = new Error("El email ya está registrado");
      (error as any).code = "EMAIL_ALREADY_EXISTS";
      (error as any).statusCode = 400;
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
    const serverError = new Error("Error interno del servidor");
    (serverError as any).code = "SERVER_ERROR";
    (serverError as any).statusCode = 500;
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
      const error = new Error("Email no encontrado");
      (error as any).code = "INVALID_CREDENTIALS";
      (error as any).statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Contraseña incorrecta");
      (error as any).code = "INVALID_CREDENTIALS";
      (error as any).statusCode = 401;
      throw error;
    }

    try {
      if (!process.env.JWT_SECRET) {
        const configError = new Error(
          "Error de configuración: JWT_SECRET no está configurado"
        );
        (configError as any).code = "CONFIG_ERROR";
        (configError as any).statusCode = 500;
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
      const tokenError = new Error(
        "Error al generar el token de autenticación"
      );
      (tokenError as any).code = "TOKEN_GENERATION_ERROR";
      (tokenError as any).statusCode = 500;
      throw tokenError;
    }
  } catch (error: any) {
    if (error.code) {
      throw error;
    }

    console.error("Error no manejado en loginUser:", error);
    const serverError = new Error("Error interno del servidor");
    (serverError as any).code = "SERVER_ERROR";
    (serverError as any).statusCode = 500;
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
    const serverError = new Error("Error interno del servidor");
    (serverError as any).code = "SERVER_ERROR";

    throw serverError;
  }
};
