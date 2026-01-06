import { Checkbox } from "primereact/checkbox";
import classNames from "classnames";
import { getColSpanClass } from '@/utils/LayoutUtils'; 

interface EditCheckBoxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  col?: string;
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
        getColSpanClass(col), 
        "flex flex-row items-center gap-3 self-center h-[2.5rem]"
      )}
    >
      <Checkbox
        inputId={id}
        checked={!!checked}
        onChange={(e) => onChange(!!e.checked)}
        disabled={disabled}
        className="transition-shadow"
      />
      <label 
        htmlFor={id} 
        className={classNames(
          "text-base font-medium cursor-pointer select-none", 
          disabled ? "text-slate-400" : "text-slate-700"
        )}
      >
        {label} {required && <span className="text-red-500 font-bold">*</span>}
      </label>
    </div>
  );
}