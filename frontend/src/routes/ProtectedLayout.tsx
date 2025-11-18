// src/routes/ProtectedLayout.tsx
import { Navigate, Outlet } from "react-router-dom";
import Session from "@/utils/session";

export default function ProtectedLayout() {
  const isAuthenticated = Session.isLoggedIn(); // verifica JSESSIONID ou estado global

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Renderiza todas as rotas internas
}
