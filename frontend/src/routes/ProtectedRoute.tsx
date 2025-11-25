import Session from "@/utils/session";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const [checked, setChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const user = Session.getUser();
    setIsLogged(!!user);
    setChecked(true);
  }, []);

  if (!checked) return null; // evita redirecionamento precoce

  return isLogged ? <Outlet /> : <Navigate to="/meuapp" replace />;

}