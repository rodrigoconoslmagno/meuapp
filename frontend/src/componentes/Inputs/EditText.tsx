import React from "react";
import { InputText } from "primereact/inputtext";
import classNames from "classnames";

interface EditTextProps {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  col?: string; // Ex: "12", "6", "4"
  maxLength?: number;
  errorMessage?: string; // 🔥 opcional
  type?: string; // ex: "text", "password", etc.
}

/**
 * Campo de texto genérico integrado com PrimeReact
 * - Label flutuante
 * - Suporte a required e erro visual automático
 * - Exibição opcional de mensagem customizada
 */
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
  type = "text",
}: EditTextProps) {
  return (
    <div
      className={classNames(
        `p-col-${col}`,
        "md:col-" + col,
        "flex flex-col mb-3"
      )}
    >
      <span className="p-float-label w-full">
        <InputText
          id={id}
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required} // ⚙️ usado pela validação automática do Crud
          className={classNames("w-full", {
            // 🔴 Borda vermelha se:
            // - errorMessage customizado, OU
            // - o Crud tiver marcado o campo como p-invalid (validação automática)
            "p-invalid border-red-500": !!errorMessage,
          })}
        />

        <label htmlFor={id} className="flex items-center justify-between w-full">
          <span>
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        </label>
      </span>

      {/* 🔎 exibe mensagem se existir, senão mantém padrão visual */}
      {errorMessage ? (
        <small className="p-error text-red-500 mt-1 ml-1">
          {errorMessage}
        </small>
      ) : null}
    </div>
  );
}
