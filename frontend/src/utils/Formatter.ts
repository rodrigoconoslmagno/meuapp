export const Formatter = {
    formatValue(value: any, field?: string): string {
        if (value === null || value === undefined) {
            return "";
        }

        if (typeof value === "boolean") {
            return value ? "Ativo" : "Inativo";
        }

        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
            return this.formatarDataHora(value);
        }

         if (typeof value === "string") {
            const cleanValue = value.replace(/[^\d]+/g, "");
            if (/^[0-9]{11,14}$/.test(cleanValue)) {
                return this.formatarCnpjCpf(value, this.getCnpjCpfPlaceholder(value));
            }
        }

        if (typeof value === "number") {
            return value.toLocaleString("pt-BR");
        }

        return String(value);
    },

    formatarDataHora(dateString: string | undefined): string {
        if (dateString === undefined) {
            return "";
        }

        const date = new Date(dateString);
        return date.toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
        }).replace(",", "");
    },

    formatarCnpjCpf(value: string | undefined, placeholder: string): string {
        if (!value) {
          return placeholder;
        }
        const cleanValue = value.replace(/[^\d]+/g, '');
        let maskedValue = "";
        let cleanIndex = 0;

        if (!cleanValue) {
          return ""
        }

        for (let i = 0; i < placeholder.length; i++) {
            if (placeholder[i] !== '_') {
                maskedValue += placeholder[i];
            } else {
                if (cleanIndex < cleanValue.length) {
                    maskedValue += cleanValue[cleanIndex];
                    cleanIndex++;
                } else {
                    maskedValue +=  placeholder[i]
                }
            }
        }

        return maskedValue;
    },

    getCnpjCpfPlaceholder(value: string | undefined): string {
        const cleanValue = value ? value.replace(/[^\d]+/g, "") : "";
        if (cleanValue.length > 11) {
            return "__.___.___/____-__";
        } else {
            return "___.___.___-__";
        }
    },
};
