import { createContext, useContext, useState } from "react";

interface HeaderAction {
  label: string;
  icon?: string;
  onClick: () => void;
  className?: string;
}

interface LayoutContextType {
  title: string;
  actions: HeaderAction[];
  setHeader: (title: string, actions: HeaderAction[]) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  title: "",
  actions: [],
  setHeader: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("");
  const [actions, setActions] = useState<HeaderAction[]>([]);

  const setHeader = (newTitle: string, newActions: HeaderAction[]) => {
    setTitle(newTitle);
    setActions(newActions);
  };

  return (
    <LayoutContext.Provider value={{ title, actions, setHeader }}>
      {children}
    </LayoutContext.Provider>
  );
}
