// src/componentes/Layout/AppLayout.tsx

import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
// Assumindo que o LayoutContext e SidebarMenu estão importados corretamente
import { useLayout } from "@/componentes/Layout/LayoutContext"; 
import SidebarMenu from "./SidebarMenu";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import "./AppLayout.css"; // 👈 IMPORTANTE: Importar o CSS

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  // Renomeei 'header' para 'headerData' para evitar conflito com o elemento <header>
  const { header: headerData, actions, setHeader, setLayoutReady } = useLayout(); 
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const lastHasCrud = useRef<boolean | null>(null);

  // 🔹 Lógica de Detecção de CRUD (Mantida)
  useEffect(() => {
    const main = document.querySelector("main#app-main-content"); 
    if (!main) return;

    const checkCrudPresence = () => {
      const hasCrud = !!main.querySelector("[data-crud-root]");
      if (hasCrud !== lastHasCrud.current) {
        lastHasCrud.current = hasCrud;
        if (!hasCrud) {
          setHeader("", []);
        }
      }
    };
    checkCrudPresence();
    const observer = new MutationObserver(() => checkCrudPresence());
    observer.observe(main, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [location.pathname, setHeader]);

  // 🔹 Marca layout pronto
  useEffect(() => {
    const slot = document.getElementById("header-actions-slot");
    setLayoutReady(!!slot);
  }, [location.pathname, setLayoutReady]);


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    // 1. CONTAINER PRINCIPAL (usa a classe CSS)
    <div className="app-screen-container"> 
        
        {/* 🔹 SIDEBAR */}
        <div className="flex-shrink-0 h-full relative z-30 shadow-xl">
           <SidebarMenu
              collapsed={collapsed}
              toggleCollapsed={() => setCollapsed((p) => !p)}
           />
        </div>

        {/* 2. COLUNA DIREITA (Header + Conteúdo) (usa a classe CSS) */}
        <div className="app-content-wrapper"> 
            
            {/* 🔹 HEADER */}
            <motion.header
              // Usa APENAS a classe CSS, que agora contém todo o Flexbox e estilos
              className="app-header" 
              style={{
                // Mantém o display condicional aqui, pois é lógica React
                display: !headerData?.title && actions.length === 0 ? "none" : "flex",
                // Removemos background e color pois estão no CSS
              }} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Título (Fica à Esquerda) */}
              <div className="text-xl font-semibold tracking-wide truncate">
                {headerData?.title}
              </div>

              {/* Ações (Ficam à Direita) */}
              {/* Mantém as classes Tailwind aqui para o espaçamento interno do grupo de botões */}
              <div className="flex items-center gap-2"> 
                 {actions?.map((action, index) => (
                  <Button
                    key={index}
                    label={action.label}
                    icon={action.icon}
                    onClick={action.onClick}
                    // Mantém as classes de estilo para o botão do PrimeReact
                    className={`p-button-text text-white hover:bg-white/10 ${action.className || ""}`}
                  />
                ))}
                {/* Slot para Portal */}
                <div id="header-actions-slot" className="flex items-center gap-2" />
              </div>
            </motion.header>

            {/* 🔹 CONTEÚDO (MAIN) (usa a classe CSS) */}
            <main 
                id="app-main-content"
                // Adiciona o padding aqui, pois é um estilo que varia com o conteúdo e é local
                className="app-main-content p-5 relative z-0" 
            >
                <Outlet />
            </main>
        </div>
    </div>
  );
}