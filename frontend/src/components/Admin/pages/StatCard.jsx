import React from 'react';
import { Video as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  violet: 'bg-violet-100 text-violet-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  teal: 'bg-teal-100 text-teal-600',
};

export default function StatCard({ title, value, change, trend, icon: Icon, color, onClick }) {
  const isClickable = !!onClick;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-all ${
        isClickable ? 'cursor-pointer hover:scale-105 hover:border-emerald-400' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-600 mb-1 truncate">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 truncate">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="flex items-center gap-1">
        {trend === 'up' && <TrendingUp size={16} className="text-green-600" />}
        {trend === 'down' && <TrendingDown size={16} className="text-red-600" />}
        <span
          className={`text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-600'
          }`}
        >
          {change}
        </span>
        <span className="text-sm text-slate-500 ml-1">vs last period</span>
      </div>
    </div>
  );
}
