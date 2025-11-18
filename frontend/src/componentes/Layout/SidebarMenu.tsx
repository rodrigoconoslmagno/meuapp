// src/componentes/Layout/SidebarMenu.tsx
import { motion, AnimatePresence } from "framer-motion";
import "./SidebarMenu.css";
import { menuItems } from "@/config/menuConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { MenuItem } from "@/types/MenuItem";
import Session from "@/utils/session";

export default function SidebarMenu({ collapsed, toggleCollapsed }: SidebarMenuProps) {
  const [openSub, setOpenSub] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      setOpenSub((prev) => (prev === item.label ? null : item.label));
      return;
    }

    if (item.action === "logout") {
      sessionStorage.clear();
      navigate("/");
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
  };

  const user = Session.getLoggedUser();
  const userInitials = user
    ? user.split(" ").map((p: string) => p[0]).join("").substring(0, 2).toUpperCase()
    : "U";
  return (
    <motion.aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      animate={{ width: collapsed ? 70 : 250 }}
      transition={{ duration: 0.25 }}
    >
     {/* Profile */}
      <div className="sidebar-profile">
        <div className="avatar">
          {userInitials}
        </div>

        {!collapsed && (
          <motion.div
            className="profile-info"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
          >
            <span className="profile-name">{user || "Usuário"}</span>
            <span className="profile-role">Logado</span>
          </motion.div>
        )}
      </div>
     
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && <h3 className="logo">MeuApp</h3>}

        <button className="collapse-btn" onClick={toggleCollapsed}>
          <i className={`pi ${collapsed ? "pi-angle-right" : "pi-angle-left"}`}></i>
        </button>
      </div>

      {/* Menu */}
      <ul className="menu-list">
        {menuItems.map((item: MenuItem) => (
          <li key={item.label}>
            <div
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => handleItemClick(item)}
              title={collapsed ? item.label : undefined}
            >
              <i className={item.icon}></i>

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.18 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {!collapsed && item.children && (
                <i
                  className={`pi pi-chevron-${openSub === item.label ? "down" : "right"} submenu-arrow`}
                ></i>
              )}
            </div>

            {/* Submenu */}
            <AnimatePresence>
              {!collapsed && item.children && openSub === item.label && (
                <motion.ul
                  className="submenu"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.children.map((sub: MenuItem) => (
                    <li
                      key={sub.label}
                      className="submenu-item"
                      onClick={() => sub.path && navigate(sub.path)}
                    >
                      {sub.label}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}
