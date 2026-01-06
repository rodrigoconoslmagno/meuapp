/**
 * Mapeia valores base-12 para classes do Tailwind v4.
 * Adaptado para o grid de: 1 col (mobile), 2 cols (md), 4 cols (lg).
 */
export const getColSpanClass = (col: string): string => {
    const colInt = parseInt(col);
    
    if (colInt >= 12) {
        return "col-span-full"; 
    } else if (colInt >= 6) {
        return "col-span-full lg:col-span-2";
    } else if (colInt >= 3) {
        return "col-span-full md:col-span-1 lg:col-span-1";
    }
    
    return "col-span-full";
};