import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, type = 'text', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full text-left">
        {label && (
          <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          className={`w-full px-4 py-2 rounded-xl border text-xs font-bold text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50/50 focus:bg-white ${
            error ? 'border-red-300 focus:ring-red-200/20 focus:border-red-400' : 'border-[#E2E8F0]'
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-[10px] font-bold text-red-500 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
