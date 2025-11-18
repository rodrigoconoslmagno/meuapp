import Session from "@/utils/session";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const isLogged = Session.getUser() !== null;

  return isLogged ? <Outlet /> : <Navigate to="/" replace />;
}