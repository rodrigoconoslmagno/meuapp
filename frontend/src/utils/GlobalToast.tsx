// src/components/shared/GlobalToast.tsx
import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { UIHelper } from "@/utils/UIHelper";

export default function GlobalToast() {
  const toast = useRef<Toast>(null);

  useEffect(() => {
    UIHelper.registerToast(toast);
    console.log("✅ GlobalToast registrado com sucesso");
  }, []);

  return <Toast ref={toast} position="top-right" />;
}
