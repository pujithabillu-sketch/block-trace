import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { NetworkType } from '../../types';
import { Globe, ChevronDown, Check } from 'lucide-react';

export const NetworkIndicator: React.FC = () => {
  const { network, setNetwork } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (net: NetworkType) => {
    setNetwork(net);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-700 transition-colors shadow-xs"
      >
        <span className="pulse-indicator" />
        <Globe className="w-3.5 h-3.5 text-teal-400" />
        <span>Algorand {network}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-40 p-1.5 text-slate-100 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-2.5 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800 mb-1">
              Select Algorand Network
            </div>
            
            <button
              onClick={() => handleSelect('LocalNet')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                network === 'LocalNet' ? 'bg-teal-950/80 text-teal-300 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Algorand LocalNet</span>
              </div>
              {network === 'LocalNet' && <Check className="w-3.5 h-3.5 text-teal-400" />}
            </button>

            <button
              onClick={() => handleSelect('TestNet')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                network === 'TestNet' ? 'bg-teal-950/80 text-teal-300 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Algorand TestNet</span>
              </div>
              {network === 'TestNet' && <Check className="w-3.5 h-3.5 text-teal-400" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
