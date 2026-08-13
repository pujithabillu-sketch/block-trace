import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Search,
  ArrowRight,
  Box,
  CheckCircle2,
  Lock,
  Globe,
  Store,
  Truck,
  UserCheck,
  Sparkles,
  Database,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToRegister,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePublicSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    if (searchQuery.trim().toUpperCase().includes('PROD') || searchQuery.trim().length > 3) {
      setSearchResult({
        productId: searchQuery.trim().toUpperCase(),
        name: 'Ethiopian Yirgacheffe Organic Coffee',
        category: 'Organic Food & Agriculture',
        origin: 'Sidama Region, Ethiopia (Farm Lot #849)',
        manufacturer: 'Apex Global Agri Ltd.',
        status: 'AUTHENTIC',
        txHash: 'TX7K9M2P4Q6R8S0T2U4V6W8X0Y2Z4A6B8C0D2E4F5G',
        blockRound: 8940089,
        timestamp: '2026-08-12 10:30 UTC',
      });
    } else {
      setSearchResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Enterprise Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                BlocTrace
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  Algorand Web3
                </span>
              </span>
              <p className="text-xs text-slate-500 font-medium">Blockchain-Powered Product Traceability</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#traceability" className="hover:text-indigo-600 transition-colors">Traceability</a>
            <a href="#journey" className="hover:text-indigo-600 transition-colors">Supply Chain Journey</a>
            <a href="#verification" className="hover:text-indigo-600 transition-colors">Product Verification</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToLogin}
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={onNavigateToRegister}
              className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Blockchain-Powered Product Traceability Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Blockchain-Powered Product Traceability
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Trace, verify and monitor products across the entire supply chain with blockchain-backed transparency.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onNavigateToRegister}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-base shadow-xs transition-all text-center cursor-pointer"
            >
              Login to Account
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 1: How BlocTrace Works */}
      <section id="how-it-works" className="px-6 py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How BlocTrace Works
            </h2>
            <p className="text-sm text-slate-600">
              End-to-end cryptographic verification ensuring raw material origin and zero-tampering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Product Registration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manufacturers register batch details, origin location, and attach unique SHA-256 metadata on Algorand.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Custodial Handoffs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Logistics hubs and distributors confirm custody transfers, logging timestamps and box states on-chain.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Verification & Purchase</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Retailers and end customers scan QR codes to instantly verify product origin proof before purchasing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Blockchain-Powered Traceability */}
      <section id="traceability" className="px-6 py-20 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Blockchain-Powered Traceability
          </h2>
          <p className="text-sm text-slate-600">
            Immutable smart contracts power tamper-evident supply chain intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
            <Globe className="w-6 h-6 text-indigo-600" />
            <h4 className="text-base font-bold text-slate-900">Algorand AVM Network</h4>
            <p className="text-xs text-slate-500">Pure Proof-of-Stake consensus ensuring fast, green, & low-cost transactions.</p>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
            <Database className="w-6 h-6 text-indigo-600" />
            <h4 className="text-base font-bold text-slate-900">ARC-4 Box Storage</h4>
            <p className="text-xs text-slate-500">On-chain key-value maps storing state records without central server dependencies.</p>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
            <Lock className="w-6 h-6 text-emerald-600" />
            <h4 className="text-base font-bold text-slate-900">SHA-256 Hashes</h4>
            <p className="text-xs text-slate-500">Cryptographic proof attached to every batch for mathematical anti-tamper security.</p>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h4 className="text-base font-bold text-slate-900">Instant Verification</h4>
            <p className="text-xs text-slate-500">QR code verification response in less than 1 second anywhere in the world.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Manufacturer → Distributor → Retailer → Customer */}
      <section id="journey" className="px-6 py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Manufacturer → Distributor → Retailer → Customer
            </h2>
            <p className="text-sm text-slate-600">
              Clear visual journey representing each stage of the supply chain lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Manufacturer</h3>
              <p className="text-xs text-slate-600">Registers products, manages batches, prints QR codes, and ships inventory.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Distributor</h3>
              <p className="text-xs text-slate-600">Receives incoming stock, manages warehouse inventory, and executes transfers.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Retailer</h3>
              <p className="text-xs text-slate-600">Manages store inventory, verifies shelf authenticity, and sells to customers.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Customer</h3>
              <p className="text-xs text-slate-600">Browses authentic products, places orders, tracks shipments, and verifies QR codes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Product Verification */}
      <section id="verification" className="px-6 py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Product Verification Portal
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Public verification endpoint for instant authenticity lookup on Algorand.
            </p>
          </div>

          <form onSubmit={handlePublicSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Product ID (e.g. PROD-100001)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Verify</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {hasSearched && searchResult && (
            <div className="max-w-2xl mx-auto p-6 bg-slate-50 border border-emerald-200 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-black text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    VERIFIED AUTHENTIC
                  </span>
                  <span className="text-xs font-mono text-slate-500">{searchResult.productId}</span>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  {searchResult.category}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 font-medium">Product Name</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{searchResult.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Origin Location</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{searchResult.origin}</p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-600 flex items-center justify-between truncate">
                <span className="truncate">TxHash: {searchResult.txHash}</span>
                <span className="text-emerald-600 font-bold ml-2 shrink-0">On-Chain Verified</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-8 text-center text-xs text-slate-500 font-semibold">
        <p>BlocTrace · Blockchain-Powered Product Traceability · Algorand Smart Contracts</p>
      </footer>
    </div>
  );
};
