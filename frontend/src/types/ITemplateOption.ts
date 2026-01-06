/**
 * Interface base para opções de Dropdown e MultiSelect.
 * O 'value' é sempre o código INT do Enum no backend.
 */
export interface ITemplateOption {
    label: string;
    value: number; 
}