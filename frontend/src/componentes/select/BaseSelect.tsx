import React from 'react';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { ITemplateOption } from '@/types/ITemplateOption';
import classNames from 'classnames';

interface SimpleSelectProps extends Omit<DropdownProps, 'options' | 'value'> {
    options: ITemplateOption[];
    value: number | null; 
    onChange: (e: { value: number | null }) => void;
}

export const BaseSelect: React.FC<SimpleSelectProps> = ({ options, className, ...rest }) => {
    return (
        <Dropdown
            options={options}
            optionLabel="label" 
            optionValue="value"
            className={classNames("w-full p-inputtext-sm transition-colors", className)}
            style={{ minHeight: "2.5rem", display: 'flex', alignItems: 'center' }}
            {...rest as any}
        />
    );
};