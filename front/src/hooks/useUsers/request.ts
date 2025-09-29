import { issueApi } from "../../api/api";
import type { IResLogin, User } from "./IResUser";

export interface ICredentiales {
  email: string;
  password: string;
}

export const login = async (credentials: ICredentiales): Promise<IResLogin > => {
  try {
    const data = await issueApi.post("/users/login", credentials);
    return data.data;
  } catch (error: any) {
    console.log("EL ERROR FUE", error.response.data);
    throw error.response.data;
  }
};

export const getAllUser = async (): Promise<User[]> => {
  try {
    const data = await issueApi.get("/users");
    return data.data;
  } catch (error: any) {
    console.log("EL ERROR FUE", error.response.data);
    throw error.response.data;
  }
};