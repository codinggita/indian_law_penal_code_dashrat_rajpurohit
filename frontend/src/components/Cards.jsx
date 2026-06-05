import React from 'react';

const Cards = ({ title, value, icon, trend = null, trendType = 'up', className = '' }) => {
  const isUp = trendType === 'up';

  return (
    <div className={`p-6 rounded-none border-2 border-black dark:border-white bg-[#D8D4C7] dark:bg-zinc-950 shadow-brutalist-lg dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.85)] flex items-center justify-between transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutalist-xl ${className}`}>
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs font-bold tracking-wider uppercase text-black dark:text-zinc-400">
          {title}
        </span>
        <span className="font-display text-4xl tracking-wider text-black dark:text-white mt-1 underline decoration-crimson decoration-2 underline-offset-4">
          {value}
        </span>
        {trend && (
          <div className="flex items-center gap-1 mt-3 font-mono text-xs font-bold">
            <span className="text-crimson">
              {isUp ? '▲' : '▼'} {trend}
            </span>
            <span className="text-black/60 dark:text-white/60">VS BASELINE</span>
          </div>
        )}
      </div>
      {icon && (
        <div className="p-3 rounded-none border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white shadow-brutalist-sm dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.85)] text-xl flex items-center justify-center">
          {icon}
        </div>
      )}
    </div>
  );
};

export default Cards;
