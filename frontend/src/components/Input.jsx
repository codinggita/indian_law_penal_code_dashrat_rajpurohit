import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = '',
  className = '',
  disabled = false,
  required = false,
}) => {
  const isError = error && touched;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 outline-none text-slate-900 dark:text-slate-100 disabled:opacity-50
          ${
            isError
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          }`}
      />
      {isError && (
        <span className="text-xs font-medium text-red-500 mt-0.5 animate-fadeIn">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
};

export default Input;
