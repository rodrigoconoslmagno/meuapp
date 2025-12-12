import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CrudView } from "./CrudView";
import { useLayout } from "@/componentes/Layout/LayoutContext";
import { BaseEntity } from "@/types/BaseEntity";
import serverBack from "@/api/server";
import { UIHelper } from "@/utils/UIHelper";
import { useNavigate } from "react-router-dom";

export const HeaderActionsPortal = ({ children }: { children: React.ReactNode }) => {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const found = document.getElementById("header-actions-slot");
    if (found) {
      setSlot(found);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.getElementById("header-actions-slot");
      if (el) {
        setSlot(el);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  if (!slot) return null;
  return ReactDOM.createPortal(children, slot);
};

interface CrudProps<T extends BaseEntity, F> {
  entityType: new () => T; 
  pageTitle: string;
  columns: { field: keyof T; header: string; body?: (rowData: T) => React.ReactNode }[];
  emptyModel: T;
  itemIdField: keyof T;
  renderForm: (data: T, onChange: (field: keyof T, value: any) => void) => React.ReactNode;
  renderFilter?: (filters: F, onChange: (field: keyof F, value: any) => void, onApply?: () => void, onClear?: () => void) => React.ReactNode;
  emptyFilter?: F;
  serviceName?: string; 
  extraActions?: { label: string; icon?: string; onClick: () => void; className?: string }[];
  beforeNew?: () => Promise<void> | void;
  afterNew?: (data: T) => Promise<void> | void;
  beforeEdit?: (item: T) => Promise<void> | void;
  afterEdit?: (item: T) => Promise<void> | void;
  beforeSave?: (data: T) => Promise<T> | T;
  afterSave?: (data: T) => Promise<void> | void;
}

export function Crud<T extends Record<string, any>, F = any>(props: CrudProps<T, F>) {
  const { entityType, pageTitle, columns, emptyModel, itemIdField, renderForm, renderFilter, emptyFilter, extraActions } = props;
  const { setHeader, layoutReady } = useLayout();

  const [items, setItems] = useState<T[]>([]);
  const [formData, setFormData] = useState<T>(emptyModel);
  const [filters, setFilters] = useState<F>(emptyFilter || ({} as F));
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"list" | "form">("list");
  const navigate = useNavigate();

  const serviceName = props.serviceName || (entityType.name.charAt(0).toLowerCase() + entityType.name.slice(1) + "Service");

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (!pageTitle) return;
  
    let alreadySet = false;
  
    setHeader(prev => {
      if (prev.title === pageTitle) {
        alreadySet = true;
        return prev;
      }
      return { title: pageTitle, actions: [] };
    });
  
    if (!alreadySet) {
      const observer = new MutationObserver(() => {
        const slot = document.getElementById("header-actions-slot");
        if (slot) {
          setHeader(pageTitle, []);
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [pageTitle, setHeader]);
  

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serverBack.invoke<T[]>(serviceName, "listar", filters);
      setItems(data);
    } catch (error: any) {
      UIHelper.error(error.message || "Erro ao carregar registros.");
    } finally {
      setLoading(false);
    }
  }, [serviceName, filters]);

  const handleNew = useCallback(async () => {
    if (props.beforeNew) await props.beforeNew();
    const novo = { ...emptyModel };
    setFormData(novo);
    setMode("form");
    if (props.afterNew) await props.afterNew(novo);
  }, [props, emptyModel]);

  const handleEdit = useCallback(async (item: T) => {
    if (props.beforeEdit) await props.beforeEdit(item);
    setFormData({ ...item });
    setMode("form");
    if (props.afterEdit) await props.afterEdit(item);
  }, [props]);

  const handleDelete = useCallback(async (item: T) => {
    const confirmado = await UIHelper.confirmAsync(`Deseja realmente excluir este registro?`);
    if (!confirmado) return;
    await serverBack.invoke<void>(serviceName, "deletar", { id: item[itemIdField] });
    loadItems();
    UIHelper.success(pageTitle + " excluído com sucesso!");
  }, [serviceName, itemIdField, loadItems, pageTitle]);

  const handleSave = useCallback(async () => {
    try {
      const inputs = document.querySelectorAll<HTMLInputElement>(
        "input[required], textarea[required], select[required]"
      );
      let erro = false;
      inputs.forEach((i) => {
        if (!i.value) {
          i.classList.add("p-invalid");
          erro = true;
        }
      });
      if (erro) {
        UIHelper.error("Preencha os campos obrigatórios");
        return;
      }

      let dataToSave = props.beforeSave ? await props.beforeSave(formData) : formData;
      const saved = await serverBack.invoke<T>(serviceName, "salvar", dataToSave);
      if (props.afterSave) await props.afterSave(saved);

      UIHelper.success(pageTitle + " salvo!");
      await loadItems();
      setMode("list");
    } catch (e: any) {
      UIHelper.error(e.message);
    }
  }, [formData, props, serviceName, pageTitle, loadItems]);

  const handleCancel = useCallback(() => setMode("list"), []);
  const handleToggleFilter = useCallback(() => setShowFilter((p) => !p), []);
  const handleApplyFilter = useCallback(() => {
    setShowFilter(false);
    loadItems();
  }, [loadItems]);
  const handleClearFilter = useCallback(() => {
    setFilters(emptyFilter || ({} as F));
    loadItems();
  }, [emptyFilter, loadItems]);

  const onChangeField = (field: keyof T, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const onChangeFilter = (field: keyof F, value: any) => setFilters({ ...filters, [field]: value });

  const renderButtons = () => (
    mode === "list" ? (
      <>
        <button className="p-button p-component p-button-text p-button-secondary" onClick={handleToggleFilter}>
          <span className="p-button-icon p-c pi pi-filter"></span>
          <span className="p-button-label p-c">Filtros</span>
        </button>
        {extraActions?.map((action, i) => (
          <button key={i} className={`p-button p-component ${action.className || ""}`} onClick={action.onClick}>
            {action.icon && <span className={`p-button-icon p-c ${action.icon}`}></span>}
            <span className="p-button-label p-c">{action.label}</span>
          </button>
        ))}
        <button className="p-button p-component p-button-primary" onClick={handleNew}>
          <span className="p-button-icon p-c pi pi-plus"></span>
          <span className="p-button-label p-c">Novo</span>
        </button>
      </>
    ) : (
      <>
        <button className="p-button p-component p-button-text p-button-secondary" onClick={handleCancel}>
          <span className="p-button-icon p-c pi pi-ban"></span>
          <span className="p-button-label p-c">Cancelar</span>
        </button>
        <button className="p-button p-component p-button-primary" onClick={handleSave}>
          <span className="p-button-icon p-c pi pi-check"></span>
          <span className="p-button-label p-c">Salvar</span>
        </button>
      </>
    )
  );

  return (
    <>
      <div data-crud-root>
        <HeaderActionsPortal>
          {renderButtons()}
          <button
            className="p-button p-component p-button-rounded p-button-text"
            onClick={() => (
                mode === "list" ? navigate("/") : handleCancel())
            }
          >
            <span className="p-button-icon p-c pi pi-times"></span>
          </button>
        </HeaderActionsPortal>
      
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
      </div>
    </>
  );
}