// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  token?: string;
  loading: boolean; // ✅ novo estado
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(true); // ✅ inicia em “carregando”

  // 🔹 Ao iniciar, verifica se há token salvo (mantém login persistente)
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false); // 🔹 finaliza a verificação
  }, []);

  // 🔹 Efetua login: salva token e marca como autenticado
  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // 🔹 Efetua logout: limpa token e storage
  const logout = () => {
    setToken(undefined);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        loading,
        login,
        logout,
      }}
    >
      {/* 🔹 Evita renderizar o app até confirmar se há token */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
