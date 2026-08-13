import React from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; key?: string }>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumbs,
}) => {
  return (
    <div className="mb-8 pb-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-[30px] font-bold text-[#0F172A] tracking-tight leading-[1.2] mt-1">{title}</h1>
        {description && <p className="text-[14px] text-[#64748B] font-normal leading-[1.6] mt-2 max-w-3xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};
