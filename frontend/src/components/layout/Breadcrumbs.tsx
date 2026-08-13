import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import type { NavItemKey } from '../../types';

interface BreadcrumbsProps {
  items: Array<{ label: string; key?: string }>;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { setActiveNav } = useNavigation();

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
      <button
        onClick={() => setActiveNav('dashboard')}
        className="flex items-center gap-1 hover:text-slate-900 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>BlockTrace</span>
      </button>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          {item.key ? (
            <button
              onClick={() => setActiveNav(item.key as NavItemKey)}
              className="hover:text-slate-900 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-slate-900 font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
