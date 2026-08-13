import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const effectiveLeftIcon = leftIcon || icon;
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-transparent select-none';

  const variantStyles = {
    primary: 'bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-xs focus:ring-[#4F46E5]',
    secondary: 'bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-xs focus:ring-[#0F172A]',
    outline: 'bg-white hover:bg-slate-50 text-[#334155] border-[#CBD5E1] hover:border-[#94A3B8] focus:ring-slate-400 shadow-2xs',
    danger: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs focus:ring-[#DC2626]',
    success: 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-xs focus:ring-[#16A34A]',
    ghost: 'bg-transparent hover:bg-slate-100 text-[#475569] hover:text-[#0F172A]',
  };

  const sizeStyles = {
    sm: 'h-[38px] px-3.5 text-[13px] gap-2',
    md: 'h-[46px] px-5 text-[14px] gap-2',
    lg: 'h-[52px] px-6 text-[15px] gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 spin-animation animate-spin" />
      ) : (
        effectiveLeftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
