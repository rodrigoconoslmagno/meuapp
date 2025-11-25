export interface MenuItem {
    label: string;
    icon?: string;
    path?: string;
    action?: string;
    component?: React.ComponentType<any>; // 🔹 componente da página
    children?: MenuItem[];
  
    // Campos opcionais úteis no futuro
    permission?: string;
    visible?: boolean;
    order?: number;
  }