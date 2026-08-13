import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-slate-100 text-[#334155] border-[#CBD5E1]',
    primary: 'bg-[#0F172A] text-white border-[#0F172A]',
    success: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
    warning: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
    danger: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    info: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
    purple: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
  };

  const sizeStyles = {
    sm: 'px-[8px] py-[3px] text-[10px]',
    md: 'px-[10px] py-[5px] text-[11px]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold tracking-wide uppercase rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
