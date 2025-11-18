import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import CrudFilterPanel from "./CrudFilterPanel";
import { Formatter } from "@/utils/Formatter";

interface CrudViewProps<T> {
  columns: { field: keyof T; 
             header: string;
             body?: (rowData: T) => React.ReactNode;
            }[];
  items: T[];
  itemIdField: keyof T;
  loading: boolean;
  mode: "list" | "form";
  formContent: React.ReactNode;
  filterPanel?: React.ReactNode;
  showFilter?: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onCloseFilter?: () => void;
  onApplyFilter?: () => void;
  onClearFilter?: () => void;
}

export function CrudView<T extends Record<string, any>>(props: CrudViewProps<T>) {
    const { columns, items, itemIdField, loading, mode, formContent, filterPanel, showFilter, onEdit, onDelete, onCloseFilter, onApplyFilter, onClearFilter } = props;

  return (
    <div>
      {mode === "list" && (
        <>
            {showFilter && (
                <CrudFilterPanel visible={showFilter!} onClose={onCloseFilter!} onApply={onApplyFilter!} onClear={onClearFilter!}>
                    {filterPanel}
                </CrudFilterPanel>
            )}
            
            <DataTable value={items} paginator rows={10} loading={loading} responsiveLayout="scroll">
            {columns.map((col) => (
                <Column key={String(col.field)} 
                        field={String(col.field)} 
                        header={col.header} 
                        sortable 
                        body={(rowData) => {
                            // Se o dev passou um body customizado, usa ele
                            if (col.body) return col.body(rowData);
                                // Caso contrário, usa a formatação padrão
                                const value = rowData[col.field];
                                return Formatter.formatValue(value, String(col.field));
                            }} />
            ))}
            <Column
                header="Ações"
                body={(rowData) => (
                <>
                    <Button icon="pi pi-pencil" rounded text severity="info" onClick={() => onEdit(rowData)} />
                    <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => onDelete(rowData)} />
                </>
                )}
            />
            </DataTable>
        </>
      )}

      {mode === "form" && (
        <div className="form-card">
          <div className="grid">{formContent}</div>
        </div>
      )}
    </div>
  );
}
