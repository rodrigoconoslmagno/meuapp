import { useEffect } from "react";
import { useLayout } from "@/componentes/Layout/LayoutContext";

interface HeaderAction {
  label: string;
  icon?: string;
  onClick: () => void;
  className?: string;
}

export function useHeader(
  title: string,
  actions: HeaderAction[] = [],
  options?: { append?: boolean }
) {
  const { setHeader } = useLayout();

  useEffect(() => {
    setHeader(title, actions, options);
  }, [title, JSON.stringify(actions)]);
}