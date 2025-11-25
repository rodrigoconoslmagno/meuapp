import { Routes, Route } from "react-router-dom";
import Login from "@/componentes/Login/Login";
import { menuItems } from "@/config/menuConfig";
import { EmptyWorkspace } from "@/componentes/Paginas/EmptyWorkspace";
import { AppLayout } from "@/componentes/Layout/AppLayout";

export default function AppRoutes() {
 // 🔹 Função recursiva para gerar rotas de menu e submenus
 const renderRoutesFromMenu = (items: any[]) => {
  return items.flatMap((item) => {
    const routes: JSX.Element[] = [];

    if (item.path && item.component) {
      routes.push(<Route key={item.path} path={item.path.replace(/^\//, "")} element={<item.component />} />);
    }

    if (item.children) {
      routes.push(...renderRoutesFromMenu(item.children));
    }

    return routes;
  });
};

  return (
    <Routes>
    <Route path="/login" element={<Login />} />

    {/* Área autenticada */}
    <Route path="/" element={<AppLayout />}>
      <Route index element={<EmptyWorkspace />} />
      {renderRoutesFromMenu(menuItems)}
    </Route>
  </Routes>
  );
}