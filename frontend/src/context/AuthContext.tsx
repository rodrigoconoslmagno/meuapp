import React, { createContext, useContext, useState, useEffect } from "react";
import serverBack from "@/api/server";

interface AuthContextProps {
  isAuthenticated: boolean;
  token?: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (newToken: string | null) => {
    setToken(newToken);
  };

  const logout = async () => {
    await serverBack.logout(); 

    setToken(undefined);
  };

  useEffect(() => {
    const validateSession = async () => {
      if (serverBack.getToken()) {
        setIsAuthenticated(true);
        setIsLoading(false);
        console.log("valida dentro")
        return;
      }
      try {
        const newAccessToken: string | null = await serverBack.refreshToken(); 
        login(newAccessToken);
        setIsAuthenticated(true);
      } catch (error) {
        setToken(undefined); 
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        login,
        logout,
        isLoading,
      }}
    >
      {children} 
    </AuthContext.Provider>
  );
}