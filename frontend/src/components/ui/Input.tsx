import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col mb-5">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-semibold text-[#334155] mb-2 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full h-[48px] bg-white border ${
            error ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#4F46E5] focus:ring-[#4F46E5]/15'
          } rounded-[10px] ${
            leftIcon ? 'pl-11' : 'pl-3.5'
          } ${
            rightIcon ? 'pr-11' : 'pr-3.5'
          } py-2 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-[12px] text-[#DC2626] font-medium mt-1.5">{error}</p>}
      {!error && helperText && <p className="text-[12px] text-[#64748B] mt-1.5">{helperText}</p>}
    </div>
  );
};
