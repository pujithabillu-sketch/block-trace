import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import {
  Shield,
  Box,
  Truck,
  Building2 as Warehouse,
  Store,
  UserCheck,
  Crown,
  ArrowRight,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import type { UserRole } from '../types';

interface RoleSelectionPageProps {
  onRoleSelected: (role: UserRole) => void;
  onNavigateToLanding: () => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({
  onRoleSelected,
  onNavigateToLanding,
}) => {
  const { account, switchRole, logout } = useAuth();
  const { setActiveNav } = useNavigation();

  const handleSelect = (targetRole: UserRole) => {
    switchRole(targetRole);
    setActiveNav('dashboard');
    onRoleSelected(targetRole);
  };

  const roleCards = [
    {
      role: 'ADMIN' as UserRole,
      title: 'Admin',
      description: 'Monitor the entire BlocTrace network & on-chain health.',
      icon: Crown,
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    {
      role: 'MANUFACTURER' as UserRole,
      title: 'Manufacturer',
      description: 'Register products, manage batches and mint ARC-4 records.',
      icon: Box,
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      btnColor: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
    {
      role: 'FOOD_PRODUCER' as UserRole,
      title: 'Food Producer',
      description: 'Record organic harvests, processing & food safety certs.',
      icon: Box,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
      role: 'DISTRIBUTOR' as UserRole,
      title: 'Distributor',
      description: 'Receive inbound shipments and dispatch to regional hubs.',
      icon: Truck,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      role: 'WAREHOUSE' as UserRole,
      title: 'Warehouse',
      description: 'Stock management, storage monitoring and bulk dispatch.',
      icon: Warehouse,
      iconBg: 'bg-teal-50 text-teal-600 border border-teal-100',
      btnColor: 'bg-teal-600 hover:bg-teal-700 text-white',
    },
    {
      role: 'COLD_STORAGE' as UserRole,
      title: 'Cold Storage',
      description: 'Monitor temperature sensors & perishable product logs.',
      icon: Warehouse,
      iconBg: 'bg-cyan-50 text-cyan-600 border border-cyan-100',
      btnColor: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    },
    {
      role: 'RETAILER' as UserRole,
      title: 'Retailer',
      description: 'Manage store inventory, check-in stock & consumer checkout.',
      icon: Store,
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    },
    {
      role: 'CUSTOMER' as UserRole,
      title: 'Customer',
      description: 'Scan QR codes, verify provenance & check origin.',
      icon: UserCheck,
      iconBg: 'bg-violet-50 text-violet-600 border border-violet-100',
      btnColor: 'bg-violet-600 hover:bg-violet-700 text-white',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col justify-between items-center font-sans text-[#0f172a] select-none box-border">
      {/* 2. Header */}
      <header className="w-full h-[70px] bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-6 flex items-center justify-center shadow-xs">
        <div className="max-w-[1100px] w-full flex items-center justify-between mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[18px] font-bold tracking-tight text-[#0f172a]">
                  BlocTrace
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-700">
                  Workspace Setup
                </span>
              </div>
              <p className="text-[12px] text-[#64748b] font-medium">
                Logged in as: User ({account?.role?.toLowerCase() || 'admin'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {account?.role && (
              <button
                onClick={() => {
                  setActiveNav('dashboard');
                  onRoleSelected(account.role);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Workspace</span>
              </button>
            )}
            <button
              onClick={() => {
                logout();
                onNavigateToLanding();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1 & 3. Main Content (Max width 1100px, 100% horizontally centered) */}
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-6 py-10 flex flex-col items-center justify-center">
        {/* Main Heading */}
        <div className="text-center mb-9 space-y-1.5">
          <h2 className="text-[30px] font-bold text-[#0f172a] tracking-tight leading-tight">
            Choose Your Workspace
          </h2>
          <p className="text-[14px] text-[#64748b] font-normal">
            Select the workspace you want to access.
          </p>
        </div>

        {/* 4 & 5. Workspace Cards Grid (Max 340px card width, 24px gap, 3 per row on desktop) */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] w-full max-w-[1068px] justify-items-center">
            {roleCards.map((card) => {
              const IconComp = card.icon;
              const isCurrentRole = account?.role === card.role;
              return (
                <div
                  key={card.role}
                  className="w-full max-w-[340px] min-h-[190px] bg-white border border-[#e2e8f0] rounded-[18px] p-[22px] flex flex-col justify-between transition-all duration-200 hover:-translate-y-[3px] hover:shadow-md hover:border-slate-300 relative box-border"
                  style={{
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  {/* ACTIVE Badge */}
                  {isCurrentRole && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      ACTIVE
                    </span>
                  )}

                  <div className="space-y-3">
                    {/* Icon (48px x 48px rounded square) */}
                    <div className={`w-[48px] h-[48px] rounded-[14px] flex items-center justify-center shrink-0 ${card.iconBg}`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-[18px] font-bold text-[#0f172a] tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-[13px] leading-[1.5] text-[#64748b] mt-1 font-normal">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Continue Button (38px height, 9px radius, 13px font) */}
                  <div className="pt-3 mt-3 border-t border-[#f1f5f9]">
                    <button
                      onClick={() => handleSelect(card.role)}
                      className={`w-full h-[38px] rounded-[9px] font-semibold text-[13px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${card.btnColor}`}
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 11. Footer */}
      <footer className="w-full py-5 bg-white border-t border-[#e2e8f0] text-center text-[12px] text-[#64748b] font-medium shrink-0">
        BlocTrace • Workspace Environment Selection
      </footer>
    </div>
  );
};
