import { useEffect, useState, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarMenu from "@/componentes/Layout/SidebarMenu";
import { useLayout } from "@/componentes/Layout/LayoutContext";
import { Button } from "primereact/button";
import "./PrincipalLayout.css";

export default function PrincipalLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { title, actions, setHeader, setLayoutReady } = useLayout();
  const location = useLocation();
  const lastHasCrud = useRef<boolean | null>(null);

  useEffect(() => {
    const main = document.querySelector("main.app-layout-main");
    if (!main) return;

    const checkCrudPresence = () => {
      const hasCrud = !!main.querySelector("[data-crud-root]");
      // Evita re-render e loop: só limpa se mudou de verdade
      if (hasCrud !== lastHasCrud.current) {
        lastHasCrud.current = hasCrud;
        if (!hasCrud) {
          setHeader("", []);
        }
      }
    };

    // Executa imediatamente ao trocar de rota
    checkCrudPresence();

    // Observa o DOM durante a transição de tela
    const observer = new MutationObserver(() => checkCrudPresence());
    observer.observe(main, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [location.pathname, setHeader]);

  // 🔹 Marca layout pronto assim que o slot for montado
  useEffect(() => {
    const slot = document.getElementById("header-actions-slot");
    setLayoutReady(!!slot);
  }, [title, location.pathname]);

  return (
    <div className="app-layout-container">
      <SidebarMenu collapsed={collapsed} toggleCollapsed={() => setCollapsed(!collapsed)} />

      <div className={`app-layout-content ${collapsed ? "collapsed" : ""}`}>
        {/* 🧠 Header sempre renderizado, mas escondido quando não há conteúdo */}
        <header
          className="app-toolbar transition-all duration-300 flex flex-row items-center justify-between"
          style={{
            display: !title && actions.length === 0 ? "none" : "flex",
            padding: "0.5rem 1rem",
            gap: "1rem",
          }}
        >
          <div className="flex items-center gap-3">
            <h2 className="m-0 text-white text-xl font-semibold">{title}</h2>
          </div>

          <div
            className="app-toolbar-actions flex items-center gap-2"
            style={{ justifyContent: "flex-end" }}
          >
            {actions.map((action, index) => (
              <Button
                key={index}
                label={action.label}
                icon={action.icon}
                onClick={action.onClick}
                className={action.className || ""}
              />
            ))}

            {/* 🚀 Slot do Portal */}
            <div id="header-actions-slot" />
          </div>
        </header>

        <main className="app-layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}