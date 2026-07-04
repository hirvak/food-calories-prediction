import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    type: 'up' | 'down';
    value: string;
  };
}

export const KPICard = ({ icon, label, value, trend }: KPICardProps) => {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
          {icon}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
          <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">{value}</h4>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-bold ${
          trend.type === 'up' ? 'text-emerald-600' : 'text-red-500'
        }`}>
          {trend.type === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{trend.value}</span>
        </div>
      )}
    </Card>
  );
};
