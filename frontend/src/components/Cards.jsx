import React from 'react';

const Cards = ({ title, value, icon, trend = null, trendType = 'up', className = '' }) => {
  const isUp = trendType === 'up';

  return (
    <div className={`p-6 rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl flex items-center justify-between transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-500/20 ${className}`}>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold tracking-wider uppercase text-slate-400">
          {title}
        </span>
        <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
          {value}
        </span>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold">
            <span className={isUp ? 'text-emerald-500' : 'text-red-500'}>
              {isUp ? '▲' : '▼'} {trend}
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        )}
      </div>
      {icon && (
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 shadow-inner">
          {icon}
        </div>
      )}
    </div>
  );
};

export default Cards;
