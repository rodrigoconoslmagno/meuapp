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
  header: { title: string; actions: HeaderAction[] }; // ✅ novo campo para facilitar acesso direto
  setHeader: (
    titleOrUpdater:
      | string
      | ((prev: { title: string; actions: HeaderAction[] }) => { title: string; actions: HeaderAction[] }),
    actions?: HeaderAction[],
    options?: { append?: boolean }
  ) => void;
  layoutReady: boolean;
  setLayoutReady: (ready: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  title: "",
  actions: [],
  header: { title: "", actions: [] },
  setHeader: () => {},
  layoutReady: false,
  setLayoutReady: () => {},
});

export const useLayout = () => useContext(LayoutContext);

// ======================================================
// 🧠 Hook para páginas controlarem o header do layout
// ======================================================
export function usePageLayout() {
  const { setHeader } = useLayout();

  const setTitle = (title: string, actions: HeaderAction[] = []) => {
    setHeader(title, actions);
  };

  const clearHeader = () => {
    setHeader("", []);
  };

  return { setTitle, clearHeader };
}

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("");
  const [actions, setActions] = useState<HeaderAction[]>([]);
  const [layoutReady, setLayoutReady] = useState(false);

  const setHeader = (
    newTitleOrUpdater:
      | string
      | ((prev: { title: string; actions: HeaderAction[] }) => { title: string; actions: HeaderAction[] }),
    newActions: HeaderAction[] = [],
    options?: { append?: boolean }
  ) => {
    setTitle(prevTitle => {
      if (typeof newTitleOrUpdater === "function") {
        const result = newTitleOrUpdater({ title: prevTitle, actions });
        setActions(result.actions);
        return result.title;
      }

      if (options?.append) {
        setActions(prev => [...prev, ...newActions]);
        return newTitleOrUpdater || prevTitle;
      } else {
        setActions(newActions);
        return newTitleOrUpdater;
      }
    });
  };

  return (
    <LayoutContext.Provider
      value={{
        title,
        actions,
        header: { title, actions }, // ✅ adiciona o header consolidado
        setHeader,
        layoutReady,
        setLayoutReady,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
