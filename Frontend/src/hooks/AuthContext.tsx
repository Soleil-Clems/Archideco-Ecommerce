import React, { createContext, useState, useEffect, ReactNode } from "react";
interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  isLoading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  authToken: null,
  setAuthToken: () => {},
  isLoading: true,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ authToken, setAuthToken, isLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
