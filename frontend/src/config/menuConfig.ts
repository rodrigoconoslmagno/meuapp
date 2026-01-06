import Dashboard from "@/componentes/Paginas/Dashboard";
import Mercadorias from "@/componentes/Paginas/Mercadoria";
import Participantes from "@/componentes/Paginas/Participante";
import Usuarios from "@/componentes/Paginas/Usuarios";
import { MenuItem } from "@/types/MenuItem";

export const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      path: "/dashboard",
      component: Dashboard
    },
    {
      label: "Usuários",
      icon: "pi pi-users",
      path: "/usuarios",
      component: Usuarios
    },
    {
      label: "Cadastros",
      icon: "pi pi-folder",
      children: [
        { label: "Participante", icon: "pi pi-id-card", path: "/participante", component: Participantes },
        // { label: "Mercadoria", icon: "pi pi-box", path: "/mercadoria", component: Mercadorias },
      ],
    },
    {
      label: "Sair",
      icon: "pi pi-sign-out",
      action: "logout",
    },
  ];