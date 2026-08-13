import React from 'react';
import { ShieldCheck, Key, Cpu, Award, CheckCircle, ExternalLink, Lock } from 'lucide-react';
import type { UserRole } from '../../types';

interface WorkspaceProofCardProps {
  role: UserRole;
  title?: string;
  address?: string;
  className?: string;
}

export const WorkspaceProofCard: React.FC<WorkspaceProofCardProps> = ({
  role,
  title = 'Workspace On-Chain Proof of Authentication',
  address = 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
  className = '',
}) => {
  return (
    <div className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">{title}</h4>
            <p className="text-[11px] text-slate-500 font-medium">Algorand ARC-4 Smart Contract Cryptographic Verification</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-emerald-600" /> Authenticated Workspace
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block flex items-center gap-1">
            <Key className="w-3 h-3 text-teal-600" /> Authorized Role Key
          </span>
          <span className="font-bold text-slate-900 block truncate">{role} WORKSPACE</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block flex items-center gap-1">
            <Cpu className="w-3 h-3 text-indigo-600" /> AVM Smart Contract ID
          </span>
          <span className="font-bold text-indigo-700 block">APP-1048201 (ARC-4)</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-600" /> Organic Farm Provenance
          </span>
          <span className="font-bold text-slate-900 block truncate">USDA & FSSAI Certified</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" /> Cryptographic Box Key
          </span>
          <span className="font-bold text-emerald-700 block truncate">BOX_0x{address.substring(0, 8)}...</span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300">Signed Public Address:</span>
          <span className="text-teal-300 font-bold truncate max-w-[280px]">{address}</span>
        </div>
        <a
          href={`https://testnet.algoexplorer.io/address/${address}`}
          target="_blank"
          rel="noreferrer"
          className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 shrink-0"
        >
          Verify Certificate <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
