import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'muted';
  className?: string;
}

export const Badge = ({ children, variant = 'primary', className = '' }: BadgeProps) => {
  const styles = {
    primary: "bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]",
    secondary: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    danger: "bg-red-50 text-red-700 border border-red-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    muted: "bg-slate-50 text-slate-450 border border-slate-100"
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
