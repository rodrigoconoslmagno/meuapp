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
    }

}
export default Utils;