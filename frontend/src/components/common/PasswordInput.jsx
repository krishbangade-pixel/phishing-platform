import React, { useState } from 'react';
import { Lock as LockIcon, Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  className = '',
  name,
  id,
  autoComplete,
  disabled = false,
  ariaLabel
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex items-center">
      <LockIcon className="w-4 h-4 absolute left-3.5 text-slate-500 pointer-events-none z-10" />
      <input
        type={showPassword ? 'text' : 'password'}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        id={id}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`glass-input w-full pl-10 pr-10 text-xs ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none p-1 rounded-md z-10"
        title={showPassword ? 'Hide password' : 'Show password'}
        aria-label={ariaLabel || (showPassword ? 'Hide password' : 'Show password')}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
