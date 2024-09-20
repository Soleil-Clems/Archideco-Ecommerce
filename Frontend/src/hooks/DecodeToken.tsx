import { DecodedToken } from "../Types/DecodedToken";
import { jwtDecode } from "jwt-decode";

export default function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
