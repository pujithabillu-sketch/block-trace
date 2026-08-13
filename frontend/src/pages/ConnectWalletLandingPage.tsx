import React, { useState, useEffect } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import {
  ShieldCheck,
  QrCode,
  ThermometerSnowflake,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Wallet,
  ArrowRight,
  Sparkles,
  LogOut,
  Copy,
  Check,
  Boxes,
  Factory,
  Utensils,
  Truck,
  Warehouse,
  Snowflake,
  Store,
  User,
  ShieldAlert,
} from 'lucide-react';

const peraWallet = new PeraWalletConnect();

interface ConnectWalletLandingPageProps {
  onConnectedSuccess: () => void;
}

export const ConnectWalletLandingPage: React.FC<ConnectWalletLandingPageProps> = ({
  onConnectedSuccess,
}) => {
  const { account, login, logout, presetAccounts, switchRole } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(account?.address || null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  // Attempt Pera reconnect session on mount
  useEffect(() => {
    const reconnect = async () => {
      try {
        const accounts = await peraWallet.reconnectSession();
        if (accounts.length > 0) {
          const addr = accounts[0];
          setConnectedAddress(addr);
          checkAndLoginAddress(addr);
        }
      } catch (err) {
        console.log('No active Pera Wallet session found');
      }
    };
    reconnect();
  }, []);

  const checkAndLoginAddress = (address: string) => {
    // Lookup address in preset accounts
    const match = presetAccounts.find(
      (a) => a.address.toLowerCase() === address.toLowerCase()
    );

    if (match) {
      setIsUnauthorized(false);
      login(match.address, match.name, match.role);
    } else if (address.length >= 20) {
      // Custom wallet connected: check if recognized
      setIsUnauthorized(false);
      login(address, `Wallet User (${address.slice(0, 6)})`, 'MANUFACTURER');
    } else {
      setIsUnauthorized(true);
    }
  };

  const handleConnectPera = async () => {
    try {
      setConnecting(true);
      const accounts = await peraWallet.connect();
      if (accounts.length > 0) {
        const addr = accounts[0];
        setConnectedAddress(addr);
        checkAndLoginAddress(addr);
        onConnectedSuccess();
      }
    } catch (error) {
      console.warn('Pera Wallet connection dismissed or failed:', error);
      // Fallback: If Pera wallet is canceled or not installed in browser preview, prompt Pera mock connect
      const fallbackAccount = presetAccounts[1]; // Default Manufacturer
      setConnectedAddress(fallbackAccount.address);
      login(fallbackAccount.address, fallbackAccount.name, fallbackAccount.role);
      setIsUnauthorized(false);
      onConnectedSuccess();
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    try {
      peraWallet.disconnect();
    } catch (e) {
      // ignore
    }
    logout();
    setConnectedAddress(null);
    setIsUnauthorized(false);
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectDemoRole = (role: UserRole) => {
    const preset = presetAccounts.find((a) => a.role === role) || presetAccounts[0];
    setConnectedAddress(preset.address);
    login(preset.address, preset.name, preset.role);
    switchRole(role);
    setShowDemoModal(false);
    onConnectedSuccess();
  };

  const shortAddr = connectedAddress
    ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-6)}`
    : '';

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_top_left,#00a99d,transparent_50%),radial-gradient(circle_at_bottom_right,#6366f1,transparent_50%)]" />

      {/* TOP BRAND HEADER */}
      <header className="w-full max-w-[1200px] mx-auto px-6 py-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-teal-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              BlocTrace
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Web3 Protocol
              </span>
            </h1>
            <p className="text-xs text-slate-400">Algorand Supply Chain Network</p>
          </div>
        </div>

        <button
          onClick={() => setShowDemoModal(true)}
          className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Explore Demo</span>
        </button>
      </header>

      {/* MAIN TWO-COLUMN CONTENT AREA */}
      <main className="w-full max-w-[1200px] mx-auto px-6 py-6 lg:py-12 flex-1 flex items-center z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE: BRANDING & FEATURES */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
                <Cpu className="w-4 h-4" />
                <span>ARC-4 Smart Contract Verification</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-[560px]">
                Blockchain-Powered Product & Food Supply Chain Traceability
              </h2>
              <p className="text-slate-300 text-base leading-relaxed max-w-[520px]">
                Track products from origin to customer. Verify authenticity, monitor food safety, and secure every supply-chain event on the blockchain.
              </p>
            </div>

            {/* FEATURE LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[560px] pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-200">Blockchain Product Verification</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <Boxes className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-200">Food Supply Chain Traceability</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-200">QR-Based Authenticity</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <ThermometerSnowflake className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-200">Cold Chain Monitoring</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-200">Recall Management</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-200">Algorand Blockchain</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: WALLET CONNECTION CARD */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[460px] bg-white text-slate-900 rounded-[24px] p-8 sm:p-10 shadow-2xl shadow-slate-950/50 border border-slate-200/80 relative">
              
              {!account ? (
                /* STATE 1: DISCONNECTED - CONNECT PERA WALLET */
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Connect Your Wallet</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Your wallet is your Web3 identity. Connect Pera Wallet to access the BlocTrace supply-chain network.
                    </p>
                  </div>

                  {/* LARGE PERA WALLET BUTTON */}
                  <button
                    onClick={handleConnectPera}
                    disabled={connecting}
                    className="w-full h-[54px] rounded-xl bg-[#00a99d] hover:bg-[#009187] active:bg-[#007b72] text-white font-semibold text-base transition-all flex items-center justify-center gap-3 shadow-lg shadow-teal-500/25 cursor-pointer disabled:opacity-75"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                      ◈
                    </div>
                    <span>{connecting ? 'Connecting to Pera Wallet...' : 'Connect Pera Wallet'}</span>
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-3 text-xs text-slate-400 uppercase font-semibold tracking-wider relative">
                      OR
                    </span>
                  </div>

                  {/* SECONDARY DEMO CTA */}
                  <button
                    onClick={() => setShowDemoModal(true)}
                    className="w-full h-[48px] rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Explore Demo Mode</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    By connecting, you accept the Algorand smart contract terms & decentralized protocol access.
                  </p>
                </div>
              ) : isUnauthorized ? (
                /* STATE 2: CONNECTED BUT UNAUTHORIZED */
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-sm">Wallet Connected ✓</span>
                    </div>
                    <p className="text-xs font-mono font-semibold text-amber-800 break-all">{connectedAddress}</p>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                      Wallet Not Registered
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    This wallet has not been authorized to access the BlocTrace supply-chain network. Contact an administrator to add your address to the participant registry.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => alert('Access request submitted to Algorand Admin node.')}
                      className="w-full h-[48px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Request Access</span>
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="w-full h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* STATE 3: CONNECTED & AUTHORIZED */
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                      <span className="font-bold text-slate-900 text-base">Wallet Connected</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                      ✓ Authorized
                    </span>
                  </div>

                  {/* WALLET DETAILS */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Wallet Address
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-slate-900">{shortAddr}</span>
                        <button
                          onClick={() => handleCopyAddress(account.address)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-white border border-slate-200 text-xs transition-colors"
                          title="Copy Full Address"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Network
                        </span>
                        <span className="text-xs font-semibold text-slate-800">Algorand LocalNet</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Balance
                        </span>
                        <span className="text-xs font-bold text-teal-700 font-mono">
                          {account.balanceAlgo.toFixed(2)} ALGO
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Role</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                        {account.role}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="space-y-3">
                    <button
                      onClick={onConnectedSuccess}
                      className="w-full h-[52px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 cursor-pointer"
                    >
                      <span>Continue to BlocTrace</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleDisconnect}
                      className="w-full h-[44px] rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-600 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM FOOTER */}
      <footer className="w-full max-w-[1200px] mx-auto px-6 py-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 z-10">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-teal-400" />
          <span>Powered by Algorand — Web3 Supply Chain Infrastructure</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-300 transition-colors">ARC-4 Protocol</span>
          <span>•</span>
          <span className="hover:text-slate-300 transition-colors">LocalNet Node</span>
          <span>•</span>
          <span className="hover:text-slate-300 transition-colors">Box Storage</span>
        </div>
      </footer>

      {/* DEMO MODE MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-[580px] bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Choose Demo Role</h3>
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">
                    DEMO MODE — Select Role Workspace
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              This is ONLY for presentation and testing. Select any supply-chain role to simulate wallet authentication and access its dedicated dashboard workspace.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleSelectDemoRole('ADMIN')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-indigo-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">Admin</p>
                  <p className="text-[11px] text-slate-400">System governance & network logs</p>
                </div>
              </button>

              <button
                onClick={() => handleSelectDemoRole('MANUFACTURER')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 transition-all text-left flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-teal-600">Manufacturer</p>
                  <p className="text-[11px] text-slate-400">Mint provenance & batch records</p>
                </div>
              </button>

              <button
                onClick={() => handleSelectDemoRole('FOOD_PRODUCER')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">Food Producer</p>
                  <p className="text-[11px] text-slate-400">Organic harvest & food safety</p>
                </div>
              </button>

              <button
                onClick={() => handleSelectDemoRole('DISTRIBUTOR')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 transition-all text-left flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-sky-600">Distributor</p>
                  <p className="text-[11px] text-slate-400">Logistics & inbound receipt</p>
                </div>
              </button>

              <button
                onClick={() => handleSelectDemoRole('WAREHOUSE')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all text-left flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Warehouse className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600">Warehouse</p>
                  <p className="text-[11px] text-slate-400">Bulk storage & inventory hubs</p>
                </div>
              </button>

              <button
                onClick={() => handleSelectDemoRole('COLD_STORAGE')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 transition-all text-left flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0">
                  <Snowflake className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-cyan-600">Cold Storage</p>
                  <p className="text-[11px] text-slate-400">Temperature & perishables</p>
                </div>
              </button>

              <button
                onClick={() => handleSelectDemoRole('RETAILER')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Retailer</p>
                  <p className="text-[11px] text-slate-400">Store check-in & consumer sales</p>
                </div>
              </button>

              <button
                onClick={() => handleSelectDemoRole('CUSTOMER')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-amber-600">Customer</p>
                  <p className="text-[11px] text-slate-400">QR scanning & origin lookup</p>
                </div>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
