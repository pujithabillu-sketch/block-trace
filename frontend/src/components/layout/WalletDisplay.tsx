import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet, LogOut, Copy, Check, ShieldCheck, Cpu } from 'lucide-react';
import { WalletAddress } from '../ui/WalletAddress';

export const WalletDisplay: React.FC = () => {
  const { account, network, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isAuthenticated || !account) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = `${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4)}`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/90 border border-slate-200 text-xs font-semibold text-slate-800 transition-all duration-150 shadow-xs cursor-pointer"
        title="View Wallet Details"
      >
        <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
          <Wallet className="w-4 h-4" />
        </div>
        <div className="flex flex-col items-start text-left leading-tight">
          <span className="font-mono text-[11px] font-bold text-slate-900">
            {shortAddress}
          </span>
          <span className="text-[10px] text-teal-700 font-semibold">{account.balanceAlgo.toFixed(2)} ALGO</span>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-40 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-slate-900">Algorand Wallet</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Connected
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-3 space-y-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Wallet Address
                </span>
                <div className="flex items-center justify-between gap-1">
                  <WalletAddress address={account.address} truncate={true} copyable={false} />
                  <button
                    onClick={handleCopy}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg bg-white border border-slate-200 cursor-pointer"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" /> Network:
                </span>
                <span className="font-bold text-slate-800">Algorand {network || 'LocalNet'}</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 font-medium">Balance:</span>
                <span className="font-bold text-teal-700 font-mono">{account.balanceAlgo.toFixed(2)} ALGO</span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors border border-rose-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
