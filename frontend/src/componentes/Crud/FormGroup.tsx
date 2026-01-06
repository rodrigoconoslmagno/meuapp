import React from "react";

interface FormGroupProps {
  title?: string;
  description?: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormGroup({ title, description, icon, children, className = "" }: FormGroupProps) {
  return (
    <div className={`w-full bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-4 transition-all hover:border-slate-300 ${className}`}>
      
      {title && (
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            {icon && <i className={`${icon} text-blue-600 text-base`}></i>}
            <h3 className="text-base font-semibold tracking-tight text-slate-800 m-0">
              {title}
            </h3>
          </div>
          {description && (
            <p className="text-xs text-slate-500 m-0 font-normal">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="px-4 pb-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-7 items-start">
          {children}
        </div>
      </div>
    </div>
  );
}