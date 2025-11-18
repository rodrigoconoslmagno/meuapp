import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/componentes/Login/Login";
import PrincipalLayout from "@/componentes/Layout/PrincipalLayout";
import Dashboard from "@/componentes/Paginas/Dashboard";
import Usuarios from "@/componentes/Paginas/Usuarios";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Produtos from "@/componentes/Paginas/Produtos";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Tela de login */}
        <Route path="/" element={<Login />} />

        {/* ROTAS PRIVADAS — só acessa se tiver sessão */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PrincipalLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/produtos" element={<Produtos />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}