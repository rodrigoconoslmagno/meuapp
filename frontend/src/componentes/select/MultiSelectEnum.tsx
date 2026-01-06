import React from 'react';
import { MultiSelect, MultiSelectProps } from 'primereact/multiselect';
import { EnumNameKey } from '@/types/EnumTypes';
import { useEnumOptions } from './useEnumOptions';
import { getColSpanClass } from '@/utils/LayoutUtils';
import classNames from 'classnames';

interface MultiSelectEnumProps extends Omit<MultiSelectProps, 'options' | 'value'> {
    enumName: EnumNameKey; 
    label: string; 
    value: number[];
    col?: string;
    errorMessage?: string;
    onChange: (e: { value: number[] }) => void;
}

export const MultiSelectEnum: React.FC<MultiSelectEnumProps> = ({ 
    enumName, 
    label, 
    col = "12", 
    errorMessage, 
    placeholder = "Selecione múltiplos...", 
    ...rest 
}) => {
    const { options, loading } = useEnumOptions(enumName);

    return (
        <div className={classNames(getColSpanClass(col), "relative w-full")}>
            <span className="p-float-label w-full block">
                <MultiSelect
                    options={options}
                    optionLabel="label"
                    optionValue="value" 
                    placeholder={loading ? "Carregando..." : placeholder}
                    disabled={loading || rest.disabled}
                    display="chip"
                    className={classNames("w-full p-inputtext-sm", { "p-invalid border-red-500": !!errorMessage })}
                    style={{ minHeight: "2.5rem" }}
                    {...rest as any}
                />
                <label htmlFor={rest.id} className={classNames("text-sm", { "text-red-500": !!errorMessage })}>
                    {label}
                </label>
            </span>
            {errorMessage && (
                <small className="p-error block text-xs mt-1 font-medium">{errorMessage}</small>
            )}
        </div>
    );
};