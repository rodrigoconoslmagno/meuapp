export interface MenuItem {
    label: string;
    icon?: string;
    path?: string;
    action?: string;
    component?: React.ComponentType<any>;
    children?: MenuItem[];

    permission?: string;
    visible?: boolean;
    order?: number;
  }