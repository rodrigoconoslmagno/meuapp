export interface MenuItem {
    label: string;
    icon?: string;
    path?: string;
    action?: string;
  
    children?: MenuItem[];
  
    // Campos opcionais úteis no futuro
    permission?: string;
    visible?: boolean;
    order?: number;
  }