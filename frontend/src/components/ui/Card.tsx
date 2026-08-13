import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'bordered' | 'elevated';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all duration-200';
  
  const variantStyles = {
    default: 'hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]',
    glass: 'bg-white/80 backdrop-blur-md border border-[#E2E8F0]',
    bordered: 'border border-[#CBD5E1] shadow-none',
    elevated: 'shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)] border border-[#E2E8F0]',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`pb-4 mb-4 border-b border-[#E2E8F0] flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h3 className={`text-[16px] font-bold text-[#0F172A] leading-tight ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <p className={`text-[13px] text-[#64748B] font-normal leading-relaxed mt-1 ${className}`}>{children}</p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`space-y-4 ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between ${className}`}>
    {children}
  </div>
);
