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
  icon = null, // Material Symbol icon name, e.g. 'badge', 'key'
}) => {
  const isError = error && touched;

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label className="block font-label font-bold uppercase tracking-wide text-ink text-sm" htmlFor={name}>
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="material-symbols-outlined text-ink">{icon}</span>
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full py-4 brutal-input text-lg font-body text-ink placeholder-ink/50
            ${icon ? 'pl-12 pr-4' : 'px-4'}
            ${isError ? 'border-primary shadow-brutal' : ''}
          `}
        />
      </div>
      {isError && (
        <span className="font-mono text-xs font-bold text-primary mt-0.5 animate-fadeIn">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
};

export default Input;
