import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, id, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full text-left">
        {label && (
          <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={`w-full px-3 py-2 rounded-xl border text-xs font-bold text-slate-900 bg-white transition-all focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 ${
            error ? 'border-red-300 focus:ring-red-200/20 focus:border-red-400' : 'border-[#E2E8F0]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-[10px] font-bold text-red-500 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
