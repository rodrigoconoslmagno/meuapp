import { MenuItem } from "@/types/MenuItem";

export const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      path: "/dashboard",
    },
    {
      label: "Usuários",
      icon: "pi pi-users",
      path: "/usuarios",
    },
    {
      label: "Cadastros",
      icon: "pi pi-folder",
      children: [
        { label: "Clientes", icon: "pi pi-id-card", path: "/clientes" },
        { label: "Produtos", icon: "pi pi-box", path: "/produtos" },
        { label: "Fornecedores", icon: "pi pi-truck", path: "/fornecedores" },
      ],
    },
    {
      label: "Sair",
      icon: "pi pi-sign-out",
      action: "logout",
    },
  ];