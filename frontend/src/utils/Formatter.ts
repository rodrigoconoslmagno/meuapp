// utils/Formatter.ts
export const Formatter = {
    formatValue(value: any, field?: string): string {
      if (value === null || value === undefined) return "";
  
      // Booleanos → Ativo/Inativo
      if (typeof value === "boolean") {
        return value ? "Ativo" : "Inativo";
      }
  
      // Datas ISO → formato brasileiro
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        const date = new Date(value);
        return date.toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }).replace(",", "");
      }
  
      // CNPJ ou CPF → autoformata conforme tamanho
      if (typeof value === "string" && /^[0-9]{11,14}$/.test(value)) {
        if (value.length === 11)
          return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        if (value.length === 14)
          return value.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            "$1.$2.$3/$4-$5"
          );
      }
  
      // Números → separador de milhar
      if (typeof value === "number") {
        return value.toLocaleString("pt-BR");
      }
  
      // Valor padrão
      return String(value);
    },
  };
  