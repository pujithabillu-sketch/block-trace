import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { LogOut, ChevronDown, Shield, User, Settings as SettingsIcon, LayoutGrid } from 'lucide-react';

interface ProfileMenuProps {
  onSwitchWorkspace?: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onSwitchWorkspace }) => {
  const { account, logout, isAuthenticated } = useAuth();
  const { setActiveNav } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated || !account) return null;

  return (
    <div className="relative select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
          {account.name ? account.name.charAt(0) : 'U'}
        </div>
        <div className="hidden md:flex flex-col text-left leading-tight">
          <span className="text-xs font-extrabold text-slate-900 truncate max-w-[120px]">{account.name}</span>
          <span className="text-[10px] font-bold text-indigo-600">{account.role}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 p-2">
            <div className="p-3 border-b border-slate-100 bg-slate-50 rounded-xl mb-1">
              <p className="text-xs font-bold text-slate-900">{account.name}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{account.address}</p>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
                <Shield className="w-3 h-3 text-indigo-600" /> {account.role} ROLE
              </div>
            </div>

            {onSwitchWorkspace && (
              <button
                onClick={() => {
                  onSwitchWorkspace();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100/80 transition-colors cursor-pointer mb-1 border border-indigo-100"
              >
                <LayoutGrid className="w-4 h-4 text-indigo-600" />
                <span>Switch Workspace / Role</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveNav('settings');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Profile Details</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('settings');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Settings</span>
            </button>

            <div className="border-t border-slate-100 my-1 pt-1">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect & Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
