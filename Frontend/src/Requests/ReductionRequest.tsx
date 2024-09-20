import axios from "axios";
import { ApiResponse } from "../Types/userCrud";
import { CreateReductionBody, UpdateReductionBody } from "../Types/reduction";
import { localhost } from "../constants/Localhost";

export const getAllReductions = async (
  token: string
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${localhost}/api/reduction`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || "Une erreur est survenue";
    } else {
      return "Une erreur est survenue";
    }
  }
};

export const getReduction = async (
  token: string,
  id: number
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${localhost}/api/reduction/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || "Une erreur est survenue";
    } else {
      return "Une erreur est survenue";
    }
  }
};

export const createReduction = async (
  token: string,
  reductionData: CreateReductionBody
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.post<ApiResponse>(
      `${localhost}/api/reduction`,
      reductionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || "Une erreur est survenue";
    } else {
      return "Une erreur est survenue";
    }
  }
};

export const createPromo = async (
  token: string,
  reductionData: CreateReductionBody
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.post<ApiResponse>(
      `${localhost}/api/codepromo`,
      reductionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || "Une erreur est survenue";
    } else {
      return "Une erreur est survenue";
    }
  }
};

export const VerifyCodePromo = async (
  code: string,
  token: string
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.post<ApiResponse>(
      `${localhost}/api/codepromo/verify`,
      {
        codePromotion: code,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.value;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || "Erreur inconnue du serveur";
    } else if (axios.isAxiosError(error)) {
      return "Erreur de réseau ou requête annulée";
    } else {
      return "Une erreur inconnue s'est produite";
    }
  }
};

export const updateReduction = async (
  token: string,
  id: number,
  reductionData: UpdateReductionBody
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.patch<ApiResponse>(
      `${localhost}/api/reduction/${id}`,
      reductionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || "Une erreur est survenue";
    } else {
      return "Une erreur est survenue";
    }
  }
};

export const deleteReduction = async (
  token: string,
  id: number
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.delete<ApiResponse>(
      `${localhost}/api/reduction/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || "Une erreur est survenue";
    } else {
      return "Une erreur est survenue";
    }
  }
};

export const deleteCodePromo = async (
  token: string,
  codePromo: string
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.post<ApiResponse>(
      `${localhost}/api/deleteCodePromo`,
      { codePromo },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || "Une erreur est survenue";
    } else {
      return "Une erreur est survenue";
    }
  }
};
