import React from "react";
import classNames from "classnames";

interface LabelTextProps {
  id: string;
  label: string;
  value?: string | number | null;
  col?: string; // Ex: "12", "6", "4"
  className?: string;
}

export function LabelText({
  id,
  label,
  value = "",
  col = "12",
  className,
}: LabelTextProps) {
  return (
    <div
      className={classNames(
        `p-col-${col}`,
        "md:col-" + col,
        "flex flex-col mb-3 relative",
        className
      )}
    >
      <span className="p-float-label w-full relative">
        {/* Área que exibe o valor (simula InputText) */}
        <div
          className="p-inputtext w-full border border-gray-300 rounded text-gray-800 bg-gray-100 flex items-center px-3"
          style={{
            height: "2.75rem", // altura igual ao InputText do PrimeReact
            lineHeight: "2.75rem", // centraliza verticalmente
            paddingTop: "0", // remove excesso
            paddingBottom: "0",
          }}
        >
          {value}
        </div>

        {/* Label ajustado e alinhado */}
        <label
          className="text-gray-600 text-sm absolute bg-white px-1"
          style={{
            top: "-0.75rem",
            left: "0.75rem",
          }}
        >
          {label}
        </label>
      </span>
    </div>
  );
}
