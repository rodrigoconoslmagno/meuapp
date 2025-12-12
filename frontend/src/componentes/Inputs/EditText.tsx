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
  col?: string; 
  maxLength?: number;
  errorMessage?: string;
  type?: string;
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
          required={required} 
          className={classNames("w-full", {
            "p-invalid border-red-500": !!errorMessage,
          })}
        />

        <label htmlFor={id} className="flex items-center justify-between w-full">
          <span>
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        </label>
      </span>

      {errorMessage ? (
        <small className="p-error text-red-500 mt-1 ml-1">
          {errorMessage}
        </small>
      ) : null}
    </div>
  );
}
