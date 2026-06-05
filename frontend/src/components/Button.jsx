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
  const baseStyle = 'inline-flex items-center justify-center px-6 py-2.5 transition-all duration-100 focus:outline-none disabled:opacity-50 disabled:pointer-events-none disabled:transform-none';

  const variants = {
    primary: 'brutal-btn',
    secondary: 'brutal-btn',
    danger: 'brutal-btn bg-crimson text-white',
    outline: 'brutal-btn-outline',
    glass: 'bg-transparent text-black dark:text-white brutal-border shadow-brutal hover:bg-black hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
