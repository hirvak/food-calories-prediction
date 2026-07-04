import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01),0_10px_20px_-2px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
