import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col mb-5">
      {label && (
        <label htmlFor={selectId} className="text-[13px] font-semibold text-[#334155] mb-2 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          className={`w-full h-[48px] bg-white border appearance-none ${
            error ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#4F46E5] focus:ring-[#4F46E5]/15'
          } rounded-[10px] pl-3.5 pr-10 text-[14px] text-[#0F172A] focus:outline-none focus:ring-4 transition-all duration-200 cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-[12px] text-[#DC2626] font-medium mt-1.5">{error}</p>}
      {!error && helperText && <p className="text-[12px] text-[#64748B] mt-1.5">{helperText}</p>}
    </div>
  );
};
