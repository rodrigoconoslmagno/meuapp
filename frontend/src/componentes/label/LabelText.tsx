import classNames from "classnames";

interface LabelTextProps {
  id: string;
  label: string;
  value?: string | number | null;
  col?: string;
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
        <div
          className="p-inputtext w-full border border-gray-300 rounded text-gray-800 bg-gray-100 flex items-center px-3"
          style={{
            height: "2.75rem",
            lineHeight: "2.75rem", 
            paddingTop: "0",
            paddingBottom: "0",
          }}
        >
          {value}
        </div>

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
