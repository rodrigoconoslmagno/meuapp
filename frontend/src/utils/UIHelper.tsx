// src/components/shared/UIHelper.tsx
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { RefObject } from "react";
import { Button } from "primereact/button";

export class UIHelper {
  private static toastRef: RefObject<Toast> | null = null;

  // ✅ Define o Toast global (setado uma vez no App)
  static registerToast(ref: RefObject<Toast>) {
    this.toastRef = ref;
  }

  // ✅ Mostra uma mensagem genérica
  static showMessage(
    severity: "success" | "info" | "warn" | "error",
    summary: string,
    detail: string,
    life: number = 4000
  ) {
    this.toastRef?.current?.show({ severity, summary, detail, life });
  }

  // ✅ Atalhos práticos
  static success(detail: string, summary = "Sucesso") {
    this.showMessage("success", summary, detail);
  }

  static error(detail: string, summary = "Erro") {
    this.showMessage("error", summary, detail, 6000);
  }

  static warn(detail: string, summary = "Atenção") {
    this.showMessage("warn", summary, detail);
  }

  static info(detail: string, summary = "Informação") {
    this.showMessage("info", summary, detail);
  }

  // ✅ Confirmação com callback
  static confirm(
    message: string,
    accept: () => void,
    reject?: () => void,
    header: string = "Confirmação"
  ) {
    confirmDialog({
      message,
      header,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      acceptClassName: "p-button-danger",
      accept: accept,
      reject: reject,
      // 👇 personalizando os botões com autoFocus
      footer: (
        <div className="flex justify-end gap-2">
          <Button
            label="Não"
            icon="pi pi-times"
            onClick={reject}
            className="p-button-text"
          />
          <Button
            label="Sim"
            icon="pi pi-check"
            onClick={accept}
            autoFocus // 👈 foca automaticamente
            className="p-button-danger"
          />
        </div>
      ),
    });
  }

  static confirmAsync(message: string, header = "Confirmação"): Promise<boolean> {
    return new Promise((resolve) => {
      confirmDialog({
        message,
        header,
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Sim",
        rejectLabel: "Não",
        acceptClassName: "p-button-danger",
        closable: false,
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }
     
}
