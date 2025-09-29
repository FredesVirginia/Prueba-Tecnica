// DTOs (Data Transfer Objects) para operaciones de usuario

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  _id: string;
  name: string;
  email: string;
}

export interface LoginResponseDto {
  message: string;
  token: string;
  user?: UserResponseDto;
}

export interface RegisterResponseDto {
  message: string;
  userId: string;
}