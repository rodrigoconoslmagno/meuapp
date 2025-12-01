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
  const isAuthenticated = !!token;

  const login = (newToken: string | null) => {
    setToken(newToken);
    console.log("login", newToken, token, isAuthenticated)
  };

  const logout = async () => {
    await serverBack.logout(); 

    setToken(undefined);
  };

  useEffect(() => {
    const validateSession = async () => {
      try {
        if (serverBack.getToken()) {
          const newAccessToken: string | null = await serverBack.refreshToken(); 
          login(newAccessToken);
          console.log("refresh auth ", newAccessToken, token)
        }
      } catch (error) {
        setToken(undefined); 
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