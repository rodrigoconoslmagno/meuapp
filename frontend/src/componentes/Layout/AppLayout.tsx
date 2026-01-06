import { Outlet, useLocation } from "react-router-dom";
import { useLayout } from "@/componentes/Layout/LayoutContext"; 
import SidebarMenu from "./SidebarMenu";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { SpeedDial } from "primereact/speeddial";
import "./AppLayout.css"; 

export function AppLayout() {
  const { header: headerData, actions, setHeader, setLayoutReady } = useLayout(); 
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const lastHasCrud = useRef<boolean | null>(null);

  const dialItems = actions?.map((action) => ({
    label: action.label,
    icon: action.icon || "pi pi-external-link",
    command: () => action.onClick(),
    template: (item: any, options: any) => (
      <button 
        onClick={options.onClick} 
        className="flex items-center gap-2 p-3 mb-2 rounded-full shadow-lg bg-blue-600 text-white min-w-[120px] justify-end"
      >
        <span className="text-sm font-bold">{item.label}</span>
        <i className={`${item.icon}`}></i>
      </button>
    )
  }));

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
            className="app-header flex items-center justify-between gap-4"
            style={{
              visibility: !headerData?.title && actions.length === 0 ? "hidden" : "visible",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-xl font-semibold tracking-wide truncate flex-shrink min-w-0">
              {headerData?.title}
            </div>

            <div className="header-actions-container flex items-center gap-2 ml-auto"> 
              {actions?.map((action, index) => (
                <Button
                  key={index}
                  label={action.label}
                  icon={action.icon}
                  onClick={action.onClick}
                  className={`p-button-sm p-button-raised ${action.className || "p-button-text text-white"}`}
                />
              ))}
              <div id="header-actions-slot" className="flex items-center gap-2" />
            </div>
          </motion.header>

          <main id="app-main-content" className="app-main-content">
              <Outlet />
          </main>

          {actions && actions.length > 0 && (
            <div className="md:hidden">
                <SpeedDial 
                    model={dialItems} 
                    direction="up" 
                    className="fixed bottom-6 right-6 z-50"
                    buttonClassName="p-button-primary p-button-rounded shadow-2xl w-14 h-14"
                    showIcon="pi pi-ellipsis-v" 
                    hideIcon="pi pi-times" 
                />
            </div>
          )}
      </div>
    </div>
  );
}