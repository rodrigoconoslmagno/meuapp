import { Outlet, useLocation } from "react-router-dom";
import { useLayout } from "@/componentes/Layout/LayoutContext"; 
import SidebarMenu from "./SidebarMenu";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import "./AppLayout.css"; 

export function AppLayout() {
  const { header: headerData, actions, setHeader, setLayoutReady } = useLayout(); 
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const lastHasCrud = useRef<boolean | null>(null);

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

  useEffect(() => {
    const slot = document.getElementById("header-actions-slot");
    setLayoutReady(!!slot);
  }, [location.pathname, setLayoutReady]);

  return (
    <div className="app-screen-container"> 
        
        <div className="flex-shrink-0 h-full relative z-30 shadow-xl">
           <SidebarMenu
              collapsed={collapsed}
              toggleCollapsed={() => setCollapsed((p) => !p)}
           />
        </div>

        <div className="app-content-wrapper"> 
            
            <motion.header
              className="app-header" 
              style={{
                display: !headerData?.title && actions.length === 0 ? "none" : "flex",
              }} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-xl font-semibold tracking-wide truncate">
                {headerData?.title}
              </div>

              <div className="flex items-center gap-2"> 
                 {actions?.map((action, index) => (
                  <Button
                    key={index}
                    label={action.label}
                    icon={action.icon}
                    onClick={action.onClick}
                    className={`p-button-text text-white hover:bg-white/10 ${action.className || ""}`}
                  />
                ))}
                <div id="header-actions-slot" className="flex items-center gap-2" />
              </div>
            </motion.header>

            <main 
                id="app-main-content"
                className="app-main-content p-5 relative z-0" 
            >
                <Outlet />
            </main>
        </div>
    </div>
  );
}