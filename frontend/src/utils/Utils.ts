const Utils = {

    getContextPath(): string {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        
        const contextPath = pathParts.length > 0 && !pathParts[0].includes(".")
            ? `/${pathParts[0]}`
            : "";
        
        return contextPath || "/";
    }  
}
export default Utils;