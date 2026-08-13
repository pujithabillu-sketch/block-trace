import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  Globe,
  Copy,
  QrCode,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Coins,
  Cpu,
  Sun,
  Moon,
  Sparkles,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Wheat,
  Snowflake,
  Warehouse,
  Truck,
  Store,
  UserCheck,
  Factory,
  Key,
} from 'lucide-react';
import type { UserRole } from '../types';

export const WalletPage: React.FC = () => {
  const { account, network, switchRole } = useAuth();
  const { historyEvents } = useProducts();

  const currentRole: UserRole = account?.role || 'MANUFACTURER';
  const walletAddress = account?.address || 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4';
  const algoBalance = account?.balanceAlgo || 4250.75;

  // Theme mode toggle: 'light' (Clean Natural Light by default) or 'dark'
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('light');
  const [copied, setCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Role Configuration for Wallet themes and role tokens
  const getRoleWalletConfig = (role: UserRole) => {
    switch (role) {
      case 'FOOD_PRODUCER':
        return {
          title: 'Organic Produce Farm Wallet',
          tagline: 'Farm-to-fork harvest minting & USDA organic verification keys',
          icon: <Wheat className="w-6 h-6 text-emerald-600" />,
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          darkBadgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          gradientBg: 'from-emerald-950 via-slate-900 to-teal-950',
          tokens: [
            { name: 'USDA Organic Provenance ASA', id: 'ASA-99401', amount: '1,500 Units', type: 'Certificate' },
            { name: 'Harvest Batch Mint Key', id: 'ASA-10294', amount: 'Active (Unlimited)', type: 'Permission' },
          ],
        };
      case 'COLD_STORAGE':
        return {
          title: 'Cold Chain Thermal Vault Wallet',
          tagline: 'Sensor telemetry signing keys & thermal breach event loggers',
          icon: <Snowflake className="w-6 h-6 text-cyan-600 animate-spin-slow" />,
          badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
          darkBadgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          gradientBg: 'from-cyan-950 via-slate-900 to-sky-950',
          tokens: [
            { name: 'Thermal Sensor Log Key ASA', id: 'ASA-55012', amount: 'Sensor Active', type: 'Telemetry' },
            { name: 'Ultra-Cold Pass #04', id: 'ASA-88201', amount: 'Vault Level 3', type: 'Security' },
          ],
        };
      case 'WAREHOUSE':
        return {
          title: 'Logistics Storage Hub Wallet',
          tagline: 'High-density pallet rack allocations & box map index keys',
          icon: <Warehouse className="w-6 h-6 text-purple-600" />,
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
          darkBadgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          gradientBg: 'from-purple-950 via-slate-900 to-indigo-950',
          tokens: [
            { name: 'Pallet Stock Manifest Token', id: 'ASA-33019', amount: '4,500 Units', type: 'Storage' },
            { name: 'Rack Capacity Key A-12', id: 'ASA-77102', amount: '92% Occupied', type: 'Allocation' },
          ],
        };
      case 'DISTRIBUTOR':
        return {
          title: 'Freight Fleet Transport Wallet',
          tagline: 'Multi-hop transit handoffs & digital waybill signing keys',
          icon: <Truck className="w-6 h-6 text-amber-600" />,
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          darkBadgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          gradientBg: 'from-amber-950 via-slate-900 to-orange-950',
          tokens: [
            { name: 'Digital Waybill Manifest ASA', id: 'ASA-44018', amount: '38 Active Trips', type: 'Freight' },
            { name: 'Customs Clearance Pass', id: 'ASA-66104', amount: 'Authorized', type: 'Border Pass' },
          ],
        };
      case 'RETAILER':
        return {
          title: 'Retail Storefront POS Wallet',
          tagline: 'Point-of-sale customer warranty minting & shelf check-ins',
          icon: <Store className="w-6 h-6 text-rose-600" />,
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          darkBadgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          gradientBg: 'from-rose-950 via-slate-900 to-pink-950',
          tokens: [
            { name: 'Customer Digital Warranty ASA', id: 'ASA-11209', amount: '890 Minted', type: 'Warranty' },
            { name: 'POS Register Terminal Key', id: 'ASA-77301', amount: 'Online', type: 'Terminal' },
          ],
        };
      case 'CONSUMER':
      case 'CUSTOMER':
        return {
          title: 'Consumer Verification Wallet',
          tagline: 'Product authenticity scan logs & physical NFC check-in keys',
          icon: <UserCheck className="w-6 h-6 text-teal-600" />,
          badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
          darkBadgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          gradientBg: 'from-teal-950 via-slate-900 to-slate-950',
          tokens: [
            { name: 'Verified Consumer NFT Tag', id: 'ASA-88001', amount: 'Authentic Seal', type: 'Proof' },
          ],
        };
      case 'ADMIN':
        return {
          title: 'System Governance Master Wallet',
          tagline: 'Algorand ARC-4 Smart Contract owner keys & participant authorization',
          icon: <Key className="w-6 h-6 text-indigo-600" />,
          badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          darkBadgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          gradientBg: 'from-indigo-950 via-slate-900 to-slate-950',
          tokens: [
            { name: 'BlockTrace Contract Owner Badge', id: 'APP-1048201', amount: 'Master Key', type: 'Governance' },
            { name: 'Role Authority Mint Key', id: 'ASA-00001', amount: 'Full Admin', type: 'Permission' },
          ],
        };
      default:
        return {
          title: 'Industrial Manufacturing Wallet',
          tagline: 'ARC-4 batch registration & on-chain provenance minting',
          icon: <Factory className="w-6 h-6 text-teal-600" />,
          badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
          darkBadgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          gradientBg: 'from-teal-950 via-slate-900 to-slate-950',
          tokens: [
            { name: 'Manufacturing Origin ASA', id: 'ASA-10001', amount: 'Master Mint', type: 'Provenance' },
            { name: 'Algorand Box Storage Key', id: 'BOX-64KB', amount: 'Allocated', type: 'Storage' },
          ],
        };
    }
  };

  const roleConfig = getRoleWalletConfig(currentRole);
  const isDark = themeMode === 'dark';

  return (
    <PageContainer>
      <PageHeader
        title="Workspace Web3 Wallet"
        description="Role-customized Web3 wallet interface with on-chain assets, light/dark theme customization, and box storage audit."
        breadcrumbs={[{ label: 'Web3 Wallet' }]}
        actions={
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <Button
              onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
              variant="outline"
              size="md"
              leftIcon={isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            >
              {isDark ? 'Light Theme' : 'Dark Theme'}
            </Button>
            <Button
              onClick={() => setIsQrOpen(true)}
              variant="secondary"
              size="md"
              leftIcon={<QrCode className="w-4 h-4" />}
            >
              Wallet QR Code
            </Button>
          </div>
        }
      />

      {/* QUICK WORKSPACE ROLE PRESET SWITCHER */}
      <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Switch Workspace Wallet Mode:
          </span>
          <span className="text-[11px] text-slate-500">Active Workspace: <strong className="text-slate-900">{currentRole}</strong></span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {[
            { r: 'ADMIN', label: 'Admin' },
            { r: 'MANUFACTURER', label: 'Manufacturer' },
            { r: 'FOOD_PRODUCER', label: 'Food Producer' },
            { r: 'DISTRIBUTOR', label: 'Distributor' },
            { r: 'WAREHOUSE', label: 'Warehouse' },
            { r: 'COLD_STORAGE', label: 'Cold Storage' },
            { r: 'RETAILER', label: 'Retailer' },
            { r: 'CONSUMER', label: 'Customer' },
          ].map((item) => {
            const isActive = currentRole === item.r;
            return (
              <button
                key={item.r}
                onClick={() => switchRole(item.r as UserRole)}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* HERO WORKSPACE WALLET CARD */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-md mb-8 ${
          isDark
            ? `bg-gradient-to-br ${roleConfig.gradientBg} border-slate-700/80 text-white`
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
                isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
              }`}>
                {roleConfig.icon}
              </div>
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${
                  isDark ? roleConfig.darkBadgeColor : roleConfig.badgeColor
                }`}>
                  {currentRole} WORKSPACE WALLET
                </span>
                <h2 className={`text-2xl font-extrabold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{roleConfig.title}</h2>
              </div>
            </div>
            <p className={`text-xs max-w-xl font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{roleConfig.tagline}</p>
          </div>

          {/* BALANCE DISPLAY */}
          <div className={`p-5 rounded-2xl border space-y-2 min-w-[240px] ${
            isDark ? 'bg-white/10 backdrop-blur-md border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              Available Algorand Balance
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className={`text-3xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{algoBalance.toLocaleString()}</h3>
              <span className="text-sm font-bold text-teal-600">ALGO</span>
            </div>
            <div className={`flex items-center justify-between pt-2 border-t text-xs ${
              isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'
            }`}>
              <span>Est. Value (~${(algoBalance * 0.28).toFixed(2)} USD)</span>
              <span className="text-teal-700 font-bold flex items-center gap-0.5">
                <Globe className="w-3 h-3 text-teal-600" /> {network}
              </span>
            </div>
          </div>
        </div>

        {/* ADDRESS & ACTIONS BAR */}
        <div className={`mt-6 pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'border-white/15' : 'border-slate-200'
        }`}>
          <div className="space-y-1">
            <span className={`text-[11px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Public Algorand Address</span>
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border max-w-full overflow-hidden ${
              isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-300'
            }`}>
              <span className={`font-mono text-xs font-bold truncate ${isDark ? 'text-teal-300' : 'text-teal-800'}`}>{walletAddress}</span>
              <button
                onClick={handleCopy}
                className={`p-1 rounded transition-colors cursor-pointer shrink-0 ${
                  isDark ? 'hover:bg-white/10 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                title="Copy Address"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsQrOpen(true)}
              variant="outline"
              size="sm"
              leftIcon={<QrCode className="w-3.5 h-3.5 text-teal-600" />}
            >
              View QR Tag
            </Button>
            <a
              href={`https://testnet.algoexplorer.io/address/${walletAddress}`}
              target="_blank"
              rel="noreferrer"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              Explorer <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* METRICS & ASSETS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* HELD ON-CHAIN TOKENS / ASSETS */}
        <div className="lg:col-span-2">
          <Card variant="default" className="bg-white border-slate-200 text-slate-900 shadow-xs">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
                <Coins className="w-5 h-5 text-teal-600" /> Workspace Held Algorand Assets (ASA)
              </CardTitle>
              <span className="text-xs font-mono font-semibold text-slate-500">ARC-4 Compliant</span>
            </CardHeader>
            <CardContent className="space-y-4">
              {roleConfig.tokens.map((token, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border-slate-200"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{token.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold border border-teal-300">
                        {token.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Asset Type: <strong className="text-slate-900">{token.type}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold font-mono text-emerald-700 block">{token.amount}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Box Map Verified</span>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl border flex items-center justify-between bg-slate-900 text-white">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Algorand Box Map Allocation</h4>
                    <p className="text-[11px] text-slate-300">ARC-4 Contract ID: #1048201 (64 KB Storage Reserved)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-teal-300 bg-teal-950 px-2.5 py-1 rounded-lg border border-teal-800">
                  ACTIVE
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SIDE SYSTEM STATUS */}
        <div className="space-y-6">
          <Card variant="default" className="bg-white border-slate-200 text-slate-900 shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Web3 Security Auditing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border flex items-center justify-between bg-slate-50 border-slate-200">
                <span className="text-slate-600 font-medium">Pera Wallet Status</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Connected
                </span>
              </div>
              <div className="p-3 rounded-xl border flex items-center justify-between bg-slate-50 border-slate-200">
                <span className="text-slate-600 font-medium">Node Latency</span>
                <span className="font-mono font-bold text-teal-700">14 ms (Fast)</span>
              </div>
              <div className="p-3 rounded-xl border flex items-center justify-between bg-slate-50 border-slate-200">
                <span className="text-slate-600 font-medium">AVM Contract</span>
                <span className="font-mono font-bold text-indigo-700">v2.4 ARC-4</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RECENT WALLET TRANSACTIONS LEDGER */}
      <Card variant="default" className="bg-white border-slate-200 text-slate-900 shadow-xs">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Layers className="w-5 h-5 text-teal-600" /> Recent Wallet Transaction Logs
          </CardTitle>
          <span className="text-xs text-slate-500 font-mono">Real-Time Ledger</span>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {historyEvents.slice(0, 5).map((evt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${evt.eventType.includes('REGISTER') ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>
                    {evt.eventType.includes('REGISTER') ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">{evt.eventType}</span>
                    <span className="text-[11px] font-mono text-teal-700 font-semibold">Target Product: {evt.productId}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-right">
                  <div className="font-mono text-[11px]">
                    <span className="text-slate-500 block">{new Date(evt.timestamp).toLocaleString()}</span>
                    {evt.txId && <span className="text-slate-700 font-semibold">{evt.txId.substring(0, 12)}...</span>}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    CONFIRMED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QR CODE MODAL */}
      <Modal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} title="Public Wallet QR Code" maxWidth="sm">
        <div className="p-6 text-center space-y-4">
          <div className="w-48 h-48 bg-white p-4 rounded-2xl border-2 border-slate-900 mx-auto flex flex-col items-center justify-center shadow-lg">
            <QrCode className="w-36 h-36 text-slate-900" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{currentRole} Algorand Key</h4>
            <p className="text-xs font-mono text-slate-600 break-all bg-slate-100 p-2 rounded mt-2">
              {walletAddress}
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={() => setIsQrOpen(false)} className="w-full">
            Close QR Modal
          </Button>
        </div>
      </Modal>
    </PageContainer>
  );
};
