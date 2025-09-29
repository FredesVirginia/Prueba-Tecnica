import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { ACCESS_TOKEN_KEY } from "../pages/LoginPage";


export const baseUrl = "http://localhost:4000";


export const issueApi = axios.create({
  baseURL: baseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

issueApi.interceptors.request.use((config) => {
  config.headers.Authorization =
    "Bearer " + secureLocalStorage.getItem(ACCESS_TOKEN_KEY);
  return config;
});

issueApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      (error.response &&
        error.response.status === 403 &&
        error.response.data.code === "INVALID_CREDENTIALS") ||
      error.response.status === 401
    ) {
      localStorage.clear();

    
    }

    return Promise.reject(error);
  }
);
