import axios from "axios";
import {
  LoginRequestBody,
  LoginResponse,
  RegisterRequestBody,
  RegisterResponse,
} from "../Types/auth";
import { localhost } from "../constants/Localhost";

export const register = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  const requestBody: RegisterRequestBody = {
    firstname,
    lastname,
    email,
    password,
  };

  try {
    const response = await axios.post<RegisterResponse>(
      `${localhost}/api/register`,
      requestBody
    );
    return response.data;
  } catch (error: any) {
    return error.response.data.message || "echec de l'inscription";
  }
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const requestBody: LoginRequestBody = { email, password };

  try {
    const response = await axios.post<LoginResponse>(
      `${localhost}/api/login_check`,
      requestBody
    );
    return response.data;
  } catch (error: any) {
    return error.response?.data?.message || "Échec de la connexion";
  }
};

export const getAssistant = async (question: string) => {
  try {
    const response = await axios.post(`http://localhost:8001/api/assistant`, {
      question: question,
    });
    return response.data;
  } catch (error: any) {
    return error.response?.data?.message || "Échec de la connexion";
  }
};
