import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({}) {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("protectedrout", isAuthenticated, isLoading)

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}