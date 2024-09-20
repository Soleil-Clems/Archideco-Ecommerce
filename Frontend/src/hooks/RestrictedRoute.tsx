import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const RestrictedRoute: React.FC = () => {
  const { authToken, isLoading } = useContext(AuthContext);
  const location = useLocation();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (authToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RestrictedRoute;
