import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className="w-full animate-pulse border-2 border-black bg-white brutal-shadow">
        <div className="h-12 bg-gray-300 border-b-2 border-black"></div>
        {items.map((_, idx) => (
          <div key={idx} className="flex border-b border-black/10 p-4 gap-4 items-center">
            <div className="h-4 bg-gray-200 w-1/4"></div>
            <div className="h-4 bg-gray-200 w-1/2"></div>
            <div className="h-4 bg-gray-200 w-1/8"></div>
            <div className="h-4 bg-gray-200 w-1/8"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="w-full h-64 border-2 border-black bg-[#EAE7DC] p-6 flex items-end justify-between gap-4 animate-pulse">
        {Array.from({ length: 6 }).map((_, idx) => {
          const height = [40, 70, 50, 90, 30, 60][idx % 6];
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end min-w-[60px]">
              <div className="h-3 bg-gray-300 w-8"></div>
              <div className="w-full bg-gray-300 border-t-2 border-l-2 border-r-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ height: `${height}%` }}></div>
              <div className="h-3 bg-gray-300 w-12"></div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default: 'card' preset
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {items.map((_, idx) => (
        <div key={idx} className="border-2 border-black bg-white p-6 shadow-brutal flex flex-col gap-4 animate-pulse text-left relative overflow-hidden">
          <div className="h-5 bg-gray-300 w-1/4"></div>
          <div className="h-10 bg-gray-200 w-3/4"></div>
          <div className="h-4 bg-gray-200 w-full"></div>
          <div className="h-4 bg-gray-200 w-5/6"></div>
          <div className="h-10 bg-gray-300 w-full mt-4"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
