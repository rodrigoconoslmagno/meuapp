import React from "react";
import { Checkbox } from "primereact/checkbox";
import classNames from "classnames";

interface EditCheckBoxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  col?: string; // Ex: "12", "6", "4"
}

export function EditCheckBox({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  col = "12",
}: EditCheckBoxProps) {
  return (
    <div
      className={classNames(
        `p-col-${col}`,
        "md:col-" + col,
        "flex flex-row items-center gap-2 mb-3"
      )}
    >
      <Checkbox
        inputId={id}
        checked={!!checked}
        onChange={(e) => onChange(!!e.checked)}
        disabled={disabled}
      />
      <label htmlFor={id} className="text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
}
