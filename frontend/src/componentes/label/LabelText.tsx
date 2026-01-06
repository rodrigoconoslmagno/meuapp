import classNames from "classnames";
import { getColSpanClass } from '@/utils/LayoutUtils';

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
    <div className={classNames(getColSpanClass(col), "relative", className)}>
      <span className="p-float-label w-full block">
        <div
          className={classNames(
            "w-full min-h-[40px] flex items-center px-3 rounded-md border border-slate-200 bg-slate-50/50 text-slate-800 text-base transition-colors",
            "hover:border-slate-300"
          )}
        >
          {value || <span className="text-slate-400 opacity-50">—</span>} 
        </div>

        <label
          htmlFor={id}
          className="ml-2 px-1 text-base font-medium text-slate-500 bg-white"
          style={{
            transform: 'translateY(-50%)',
            top: '-0.25rem',
            left: '0',
            position: 'absolute',
            pointerEvents: 'none'
          }}
        >
          {label}
        </label>
      </span>
    </div>
  );
}