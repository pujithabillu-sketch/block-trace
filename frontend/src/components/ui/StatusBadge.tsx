import React from 'react';
import type { ProductStatus, VerificationState } from '../../types';
import { ShieldCheck, AlertTriangle, XCircle, HelpCircle, Truck, Store, CheckCircle, Package } from 'lucide-react';

interface StatusBadgeProps {
  status?: ProductStatus;
  verificationState?: VerificationState;
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  verificationState,
  showIcon = true,
  className = '',
}) => {
  // If verificationState is specified (AUTHENTIC, SUSPICIOUS, RECALLED, NOT_FOUND)
  if (verificationState) {
    switch (verificationState) {
      case 'AUTHENTIC':
        return (
          <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] shadow-xs ${className}`}>
            {showIcon && <ShieldCheck className="w-4 h-4 text-[#16A34A]" />}
            <span>AUTHENTIC / VERIFIED</span>
          </span>
        );
      case 'SUSPICIOUS':
        return (
          <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] shadow-xs ${className}`}>
            {showIcon && <AlertTriangle className="w-4 h-4 text-[#D97706]" />}
            <span>SUSPICIOUS / COUNTERFEIT</span>
          </span>
        );
      case 'RECALLED':
        return (
          <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] shadow-xs ${className}`}>
            {showIcon && <XCircle className="w-4 h-4 text-[#DC2626]" />}
            <span>RECALLED</span>
          </span>
        );
      case 'NOT_FOUND':
        return (
          <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#F8FAFC] text-[#475569] border border-[#CBD5E1] ${className}`}>
            {showIcon && <HelpCircle className="w-4 h-4 text-[#64748B]" />}
            <span>PRODUCT NOT FOUND</span>
          </span>
        );
    }
  }

  // Lifecycle status badge fallback
  switch (status) {
    case 'REGISTERED':
    case 'MANUFACTURED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD] ${className}`}>
          {showIcon && <Package className="w-4 h-4 text-[#0284C7]" />}
          <span>{status}</span>
        </span>
      );
    case 'IN_TRANSIT':
      return (
        <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] ${className}`}>
          {showIcon && <Truck className="w-4 h-4 text-[#4F46E5]" />}
          <span>IN TRANSIT</span>
        </span>
      );
    case 'AT_DISTRIBUTOR':
    case 'AT_WAREHOUSE':
      return (
        <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE] ${className}`}>
          {showIcon && <Store className="w-4 h-4 text-[#7C3AED]" />}
          <span>{status.replace('_', ' ')}</span>
        </span>
      );
    case 'AT_RETAILER':
      return (
        <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] ${className}`}>
          {showIcon && <Store className="w-4 h-4 text-[#16A34A]" />}
          <span>AT RETAILER</span>
        </span>
      );
    case 'SOLD':
      return (
        <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] ${className}`}>
          {showIcon && <CheckCircle className="w-4 h-4 text-[#16A34A]" />}
          <span>SOLD</span>
        </span>
      );
    case 'RECALLED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] ${className}`}>
          {showIcon && <XCircle className="w-4 h-4 text-[#DC2626]" />}
          <span>RECALLED</span>
        </span>
      );
    case 'COUNTERFEIT_REPORTED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] ${className}`}>
          {showIcon && <AlertTriangle className="w-4 h-4 text-[#D97706]" />}
          <span>COUNTERFEIT REPORTED</span>
        </span>
      );
    case 'LOST':
      return (
        <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#F8FAFC] text-[#475569] border border-[#CBD5E1] ${className}`}>
          <span>LOST</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#F8FAFC] text-[#475569] border border-[#CBD5E1] ${className}`}>
          <span>{status || 'UNKNOWN'}</span>
        </span>
      );
  }
};
