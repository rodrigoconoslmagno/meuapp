import { InputText } from "primereact/inputtext";
import classNames from "classnames";
import { getColSpanClass } from '@/utils/LayoutUtils';
import { useCallback, useEffect, useState, useRef } from 'react';
import { FormatType } from '@/types/FormatTypes';
import { Formatter } from '@/utils/Formatter';

interface EditTextProps {
    id: string;
    label: string;
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    col?: string;
    maxLength?: number;
    errorMessage?: string;
    type?: string;
    formatType?: any;
}

export function EditText({
    id,
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
    required = false,
    col = "12",
    maxLength,
    errorMessage,
    type,
    formatType,
}: EditTextProps) {
    const [formattedValue, setFormattedValue] = useState<string | undefined>(value);
    const [rawValue, setRawValue] = useState<string | undefined>(value); // Track the unformatted value
    const [internalPlaceholder, setInternalPlaceholder] = useState<string | undefined>(placeholder);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let initialValue = value;
        let initialFormattedValue = value;

        if (formatType === FormatType.CnpjCpf) {
            setInternalPlaceholder(Formatter.getCnpjCpfPlaceholder(initialValue));
            initialFormattedValue = Formatter.formatarCnpjCpf(initialValue, Formatter.getCnpjCpfPlaceholder(initialValue));
        }

        posicionaCursorFormatType();
    }, [value, formatType, placeholder]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        const cleanValueLength  = newValue.replace(/[^\d]+/g, '').length;
         if (formatType === FormatType.CnpjCpf && cleanValueLength > 14) {
             newValue = newValue.substring(0,18);
         }
        setRawValue(newValue);

        let formatted = newValue;
        if (newValue && formatType === FormatType.CnpjCpf) {
            formatted = Formatter.formatarCnpjCpf(newValue, Formatter.getCnpjCpfPlaceholder(newValue));
        }

        setFormattedValue(formatted);
        onChange(formatted);

    }, [onChange, formatType]);

    const posicionaCursorFormatType = () => {
        if (formatType === FormatType.CnpjCpf){
            if (inputRef.current) {
                const cleanValue = value ? value.replace(/[^\d]+/g, '') : '';
                let cursorPosition = cleanValue.length;
                if (cleanValue.length > 3 && cleanValue.length < 7) {
                    cursorPosition = cleanValue.length + 1;
                } else if (cleanValue.length > 6 && cleanValue.length < 10) {
                    cursorPosition = cleanValue.length + 2;
                } else if (cleanValue.length > 9 && cleanValue.length < 12) {
                   cursorPosition = cleanValue.length + 3;
                } else if (cleanValue.length > 11 && cleanValue.length <= 12) {
                    cursorPosition = cursorPosition + 3;
                } else if (cleanValue.length > 11 && cleanValue.length <=    14) {
                    cursorPosition = cursorPosition + 4;
                }

                inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
            }
        }
    };

    const getMaxLength = () : number | undefined => {
        switch(formatType){
            case FormatType.CnpjCpf:
                return 19
        }

        return maxLength;
    }

    const currentMaxLength = getMaxLength();

    return (
        <div
            className={classNames(
                getColSpanClass(col),
                "relative w-full"
            )}
        >
            <span className="p-float-label w-full block">
                <InputText
                    ref={inputRef}
                    id={id}
                    type={type}
                    value={formattedValue ?? ""}
                    onChange={handleInputChange}
                    disabled={disabled}
                    placeholder={internalPlaceholder}
                    maxLength={currentMaxLength}
                    required={required}
                    className={classNames("w-full p-inputtext-base transition-colors", {
                        "p-invalid border-red-500": !!errorMessage,
                        "bg-slate-50/30": !disabled,
                    })}
                    style={{
                        minHeight: "2.5rem"
                    }}
                />

                <label
                    htmlFor={id}
                    className={classNames("text-base transition-all", {
                        "text-red-500": !!errorMessage,
                        "text-slate-500": !errorMessage
                    })}
                >
                    {label} {required && <span className="text-red-500 font-bold">*</span>}
                </label>
            </span>

            {errorMessage && (
                <small className="p-error block text-base mt-1 font-medium animate-in fade-in">
                {errorMessage}
                </small>
            )}
        </div>
    );
}
