import React from 'react';
import { BaseSelect } from './BaseSelect';
import { EnumNameKey } from '@/types/EnumTypes';
import { DropdownProps } from 'primereact/dropdown';
import { useEnumOptions } from './useEnumOptions';
import { getColSpanClass } from '@/utils/LayoutUtils';
import classNames from 'classnames';

interface SelectEnumProps extends Omit<DropdownProps, 'options' | 'value'> {
    enumName: EnumNameKey;
    label: string;
    value: number | null;
    col?: string;
    errorMessage?: string;
    onChange: (e: { value: number | null }) => void;
}

export const EnumSelect: React.FC<SelectEnumProps> = ({ 
    enumName, 
    label, 
    col = "12", 
    errorMessage, 
    placeholder = "Selecione...", 
    ...rest 
}) => {
    const { options, loading } = useEnumOptions(enumName);

    return (
        <div className={classNames(getColSpanClass(col), "relative w-full")}>
            <span className="p-float-label w-full block">
                <BaseSelect
                    id={rest.id}
                    options={options}
                    placeholder={loading ? "Carregando..." : placeholder}
                    disabled={loading || rest.disabled}
                    className={classNames({ "p-invalid border-red-500": !!errorMessage })}
                    {...rest}
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