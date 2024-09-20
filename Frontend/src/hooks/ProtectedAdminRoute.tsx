import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import decodeToken from "./DecodeToken";

const ProtectedAdminRoute: React.FC = () => {
  const { authToken, isLoading } = useContext(AuthContext);
  const location = useLocation();
  const tokenDecode = decodeToken;
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!authToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const VerifyAdminToken = tokenDecode(authToken);

  if (!VerifyAdminToken?.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default ProtectedAdminRoute;
