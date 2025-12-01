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
        
        // Se a primeira parte não contiver um ponto (ou seja, não é um arquivo), 
        // consideramos que é o context path (ex: /meuapp)
        const contextPath = pathParts.length > 0 && !pathParts[0].includes(".")
            ? `/${pathParts[0]}`
            : "";
        
        // Se o resultado for vazio, retornamos a raiz "/"
        return contextPath || "/";
    }
}
export default Utils;