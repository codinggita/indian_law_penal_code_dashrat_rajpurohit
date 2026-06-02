import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon = null,
}) => {
  const baseStyle = 'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium tracking-wide transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none';

  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20 focus:ring-indigo-500 dark:shadow-indigo-900/35',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 focus:ring-slate-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 focus:ring-red-500',
    outline: 'border-2 border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500',
    glass: 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white focus:ring-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {icon && <span className="mr-2 inline-flex">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
