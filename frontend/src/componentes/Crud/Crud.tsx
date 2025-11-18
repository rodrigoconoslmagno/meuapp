import React, { useEffect, useState } from "react";
import { CrudView } from "./CrudView";
import { useLayout } from "@/componentes/Layout/LayoutContext";
import { BaseEntity } from "@/types/BaseEntity";
import serverBack from "@/api/server";
import { UIHelper } from "@/utils/UIHelper";
import { access } from "fs";
import { rejects } from "assert";

interface CrudProps<T extends BaseEntity, F> {
  entityType: new () => T; // construtor da entidade
  title: string;
  columns: { field: keyof T; 
             header: string;
             body?: (rowData: T) => React.ReactNode;
           }[];
  emptyModel: T;
  itemIdField: keyof T;
  renderForm: (data: T, 
               onChange: (field: keyof T, value: any) => void) => React.ReactNode;
  renderFilter?: (filters: F, 
                  onChange: (field: keyof F, value: any) => void,
                  onApply?: () => void,
                  onClear?: () => void) => React.ReactNode;
  emptyFilter?: F;

  // 🔥 novos hooks
  beforeNew?: () => Promise<void> | void;
  afterNew?: (data: T) => Promise<void> | void;
  beforeEdit?: (item: T) => Promise<void> | void;
  afterEdit?: (item: T) => Promise<void> | void;
  beforeSave?: (data: T) => Promise<T> | T;
  afterSave?: (data: T) => Promise<void> | void;
}

export function Crud<T extends Record<string, any>, F = any>(props: CrudProps<T, F>) {
  const { entityType, title, columns, emptyModel, itemIdField, renderForm, renderFilter, emptyFilter } = props;
  const { setHeader } = useLayout();

  const [items, setItems] = useState<T[]>([]);
  const [formData, setFormData] = useState<T>(emptyModel);
  const [filters, setFilters] = useState<F>(emptyFilter || ({} as F));
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"list" | "form">("list");

  // Inferir nome do service a partir da entidade
  const serviceName = entityType.name.charAt(0).toLowerCase() + entityType.name.slice(1) + "Service";

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await serverBack.invoke<T[]>(serviceName, "listar", filters);
      setItems(data);
    } catch (error: any) {
      console.error(`Erro ao listar ${serviceName}:`, error);
      if (error.message) {
        UIHelper.error(error.message || "Erro ao carregar registros.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleNew = async () => {
    try {
        if (props.beforeNew) await props.beforeNew();
    
        const novo = { ...emptyModel };
        setFormData(novo);
        setMode("form");
    
        if (props.afterNew) await props.afterNew(novo);
      } catch (err) {
        console.error("Erro em beforeNew/afterNew:", err);
      }
  };

  const handleEdit = async (item: T) => {
    try {
      if (props.beforeEdit) await props.beforeEdit(item);
  
      setFormData({ ...item });
      setMode("form");
  
      if (props.afterEdit) await props.afterEdit(item);
    } catch (err) {
      console.error("Erro em beforeEdit/afterEdit:", err);
    }
  };

  const handleDelete = async (item: T) => {
    try {
        const confirmado = await UIHelper.confirmAsync(
            `Deseja realmente excluir este registro?`
          );
      
        if (!confirmado) {
            return;
        }
        
        await serverBack.invoke<void>(serviceName, "deletar", { id: item[itemIdField] });
        loadItems();
        UIHelper.success(title || " excluido com sucesso!");
      } catch (error: any) {
        console.error(`Erro ao deletar ${serviceName}:`, error);
        if (error.message) {
            UIHelper.error(error.message || "Erro ao carregar registros.");
          }
      }
  };

  const handleSave = async () => {
    try {
      // 🔎 Valida campos obrigatórios
      const invalidFields: string[] = [];
  
      // pega todos os inputs dentro do form renderizado
      const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        "input[required], textarea[required], select[required]"
      );
      
  
      inputs.forEach((input) => {
        if (!input.value?.trim()) {
          invalidFields.push(input.id);
          input.classList.add("p-invalid", "border-red-500");
        } else {
          input.classList.remove("p-invalid", "border-red-500");
        }
      });
  
      if (invalidFields.length > 0) {
        UIHelper.error("Preencha todos os campos obrigatórios antes de salvar.");
        const firstInvalid = document.getElementById(invalidFields[0]);
        firstInvalid?.focus();
        return; // ❌ impede o save
      }
  
      // 🔥 Continua se passou na validação
      let dataToSave = formData;
  
      if (props.beforeSave) {
        dataToSave = await props.beforeSave(formData);
      }
  
      const action = "salvar";
      const saved = await serverBack.invoke<T>(serviceName, action, dataToSave);
  
      if (props.afterSave) {
        await props.afterSave(saved);
      }
  
      UIHelper.success(title || " salvo com sucesso!");
      await loadItems();
      setMode("list");
    } catch (error: any) {
      console.error(`Erro ao salvar ${serviceName}:`, error);
      if (error.message) {
        UIHelper.error(error.message || "Erro ao carregar registros.");
      }
    }
  };

  const handleCancel = () => setMode("list");
  const handleToggleFilter = () => setShowFilter(!showFilter);
  const handleApplyFilter = () => { setShowFilter(false); loadItems(); };
  const handleClearFilter = () => { setFilters(emptyFilter || ({} as F)); loadItems(); };

  const onChangeField = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const onChangeFilter = (field: keyof F, value: any) => {
    setFilters({ ...filters, [field]: value });
  };

  useEffect(() => {
    if (mode === "list") {
      setHeader(title, [
          { label: "Filtros", icon: "pi pi-filter", onClick: handleToggleFilter, className: "p-button-text p-button-secondary" },
          { label: "Novo", icon: "pi pi-plus", onClick: handleNew, className: "p-button-primary" },
          { label: "", icon: "pi pi-times", onClick: () => window.history.back(), className: "p-button-rounded p-button-text" },
      ]);
    } else {
      setHeader(title, [
          { label: "Cancelar", icon: "pi pi-ban", onClick: handleCancel, className: "p-button-text p-button-secondary" },
          { label: "Salvar", icon: "pi pi-check", onClick: handleSave, className: "p-button-primary" },
          { label: "", icon: "pi pi-times", onClick: handleCancel, className: "p-button-rounded p-button-text" },
      ]);
    }
  }, [mode, showFilter, formData]);

  return (
    <CrudView
      columns={columns}
      items={items}
      itemIdField={itemIdField}
      loading={loading}
      mode={mode}
      formContent={
        <React.Fragment key={formData[itemIdField] ?? "novo"}>
          {renderForm(formData, onChangeField)}
        </React.Fragment>
      }
      filterPanel={renderFilter ? renderFilter(filters, onChangeFilter) : null}
      showFilter={showFilter}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCloseFilter={() => setShowFilter(false)}
      onApplyFilter={handleApplyFilter}
      onClearFilter={handleClearFilter}
    />
  );
}
