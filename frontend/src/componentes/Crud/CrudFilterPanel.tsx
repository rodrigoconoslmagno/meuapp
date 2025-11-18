import React from "react";
import { Button } from "primereact/button";

interface CrudFilterPanelProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  children: React.ReactNode;
}

export default function CrudFilterPanel({
  visible,
  onClose,
  onApply,
  onClear,
  children,
}: CrudFilterPanelProps) {
  if (!visible) return null;

  return (
    <div className="filter-panel p-4 surface-card border-round-lg shadow-2 mb-3">
      <div className="flex justify-between align-items-center mb-3">
        <h3 className="m-0 text-lg font-medium">Filtros</h3>
        <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={onClose} />
      </div>

      <div className="grid">{children}</div>

      <div className="flex justify-end gap-2 mt-3">
        <Button label="Limpar" icon="pi pi-refresh" onClick={onClear} className="p-button-text p-button-secondary" />
        <Button label="Aplicar" icon="pi pi-check" onClick={onApply} className="p-button-primary" />
      </div>
    </div>
  );
}
