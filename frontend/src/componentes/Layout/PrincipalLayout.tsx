import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import { useLayout } from "./LayoutContext";
import { Button } from "primereact/button";
import "./PrincipalLayout.css";

export default function PrincipalLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { title, actions, setHeader } = useLayout();
  const location = useLocation();

  // 🔹 Reset header ao trocar de rota (evita header "preso")
  useEffect(() => {
    setHeader("", []); // limpa sempre que muda a rota
  }, [location.pathname]);

  // 🔹 Define se o header deve ser exibido (oculta no dashboard)
  const showHeader = title && !["/dashboard", "/"].includes(location.pathname);

  return (
    <div className="layout-container">
      <SidebarMenu collapsed={collapsed} toggleCollapsed={() => setCollapsed(!collapsed)} />

      <div className={`layout-content ${collapsed ? "collapsed" : ""}`}>
        {showHeader && (
          <header className="layout-header">
            <div className="layout-header-left">
              <h2>{title}</h2>
            </div>

            <div className="layout-header-actions">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  label={action.label}
                  icon={action.icon}
                  onClick={action.onClick}
                  className={action.className || ""}
                />
              ))}
            </div>
          </header>
        )}

        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
