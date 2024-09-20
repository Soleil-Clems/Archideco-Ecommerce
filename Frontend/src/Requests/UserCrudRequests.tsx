import axios from "axios";
import { ApiResponse, UpdateUserFields } from "../Types/userCrud";
import { UserBody } from "../Types/User";
import { Newsletter } from "../Types/User";
import { localhost } from "../constants/Localhost";

export const getMe = async (token: string): Promise<ApiResponse | string> => {
  try {
    const response = await axios.get<ApiResponse>(`${localhost}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || "Une erreur est survenue";
    } else {
      return "Une erreur est survenue";
    }
  }
};

export const getUser = async (
  token: string,
  id: number
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${localhost}/api/users/${id}`,
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

export const getUserInformationForCart = async (
  token: string
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${localhost}/api/getmyinformation`,
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

export const getAllUser = async (
  token: string
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.get<ApiResponse>(`${localhost}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || "Une erreur est survenue";
    } else {
      return "Une erreur est survenue";
    }
  }
};

export const getAllMember = async (
  token: string
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${localhost}/api/users/admin`,
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
export const createUser = async (
  token: string,
  email: string,
  firstname: string,
  lastname: string,
  password: string
): Promise<ApiResponse | string> => {
  const requestBody: UserBody = { email, firstname, lastname, password };
  try {
    const response = await axios.post<ApiResponse>(
      `${localhost}/api/users`,
      requestBody,
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

export const updateUser = async (
  token: string,
  id: number,
  fields: UpdateUserFields
) => {
  try {
    const response = await axios.patch<ApiResponse>(
      `${localhost}/api/users/${id}`,
      fields,
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
      return error.response.data.message;
    }
  }
};

export const deleteUser = async (
  token: string,
  id: number
): Promise<ApiResponse | string> => {
  try {
    const response = await axios.delete<ApiResponse>(
      `${localhost}/api/users/${id}`,
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

export const newsletterUser = async (
  email: string
): Promise<ApiResponse | any> => {
  const requestBody: Newsletter = {
    email,
  };
  try {
    const response = await axios.post<ApiResponse>(
      `${localhost}/api/newsletter`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || "Une erreur est survenue";
    } else {
      return "Une erreur est survenue";
    }
  }
};
