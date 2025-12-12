const Utils = {

    formatarDataHora(isoString: string | undefined): string {
        if (!isoString) {
            return "";
        }

        const data = new Date(isoString);
        return data.toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "medium",
        })
        .replace(",", "");
    },

    getContextPath(): string {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        
        const contextPath = pathParts.length > 0 && !pathParts[0].includes(".")
            ? `/${pathParts[0]}`
            : "";
        
        return contextPath || "/";
    }
}
export default Utils;