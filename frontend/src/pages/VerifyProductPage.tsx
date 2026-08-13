import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { WalletAddress } from '../components/ui/WalletAddress';
import {
  ShieldCheck,
  Search,
  QrCode,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import type { VerificationState } from '../types';

type VerifyStep = 'IDLE' | 'CHECKING' | 'DONE';

export const VerifyProductPage: React.FC = () => {
  const { globalSearch, setActiveNav } = useNavigation();
  const { getProductById } = useProducts();

  const [query, setQuery] = useState(globalSearch || '');
  const [step, setStep] = useState<VerifyStep>('IDLE');
  const [searchedId, setSearchedId] = useState<string | null>(null);

  // If globalSearch is pre-populated (e.g. from QR scanner), auto-verify
  useEffect(() => {
    if (globalSearch) {
      setQuery(globalSearch);
      triggerVerify(globalSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerVerify = (id: string) => {
    if (!id.trim()) return;
    setStep('CHECKING');
    setSearchedId(null);
    setTimeout(() => {
      setSearchedId(id.trim().toUpperCase());
      setStep('DONE');
    }, 900);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    triggerVerify(query);
  };

  const record = searchedId ? getProductById(searchedId) : null;

  let verificationState: VerificationState = 'NOT_FOUND';
  if (record) {
    if (record.recalled) verificationState = 'RECALLED';
    else if (record.counterfeitReported) verificationState = 'SUSPICIOUS';
    else verificationState = 'AUTHENTIC';
  }

  const quickVerify = (id: string) => {
    setQuery(id);
    triggerVerify(id);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Verify Your Product"
        description="Scan the QR code or enter the Product ID to verify authenticity."
        breadcrumbs={[{ label: 'Verify Product' }]}
      />

      {/* Hero Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setActiveNav('qr-scanner')}
          className="group p-6 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50 hover:bg-teal-100 hover:border-teal-500 transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer"
        >
          <div className="w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <QrCode className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-teal-900 text-sm">Scan QR Code</h3>
            <p className="text-xs text-teal-700 mt-0.5">Use device camera to scan product tag</p>
          </div>
          <span className="text-xs text-teal-600 font-semibold flex items-center gap-1">
            Open Scanner <ArrowRight className="w-3 h-3" />
          </span>
        </button>

        <div className="p-6 rounded-2xl border-2 border-slate-200 bg-white flex flex-col justify-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Enter Product ID</h3>
              <p className="text-xs text-slate-500">Type the product ID printed on packaging</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="PROD-100001"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={step === 'CHECKING'}
            >
              Verify
            </Button>
          </form>

          {/* Quick test links across multi-domain products */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
            <span className="text-slate-400">Quick test domains:</span>
            <button onClick={() => quickVerify('PROD-100001')} className="text-emerald-600 font-mono font-semibold hover:underline" title="Food & Agriculture">
              Milk 🥛
            </button>
            <button onClick={() => quickVerify('PROD-100004')} className="text-blue-600 font-mono font-semibold hover:underline" title="Electronics & Chips">
              5G Phone ⚡
            </button>
            <button onClick={() => quickVerify('PROD-100007')} className="text-purple-600 font-mono font-semibold hover:underline" title="Luxury Goods & Watches">
              Swiss Watch 💎
            </button>
            <button onClick={() => quickVerify('PROD-100008')} className="text-amber-700 font-mono font-semibold hover:underline" title="Industrial & Aerospace">
              Turbine Blade 🏭
            </button>
            <button onClick={() => quickVerify('PROD-100009')} className="text-rose-600 font-mono font-semibold hover:underline" title="Fine Beverages & Wine">
              Napa Wine 🍷
            </button>
            <button onClick={() => quickVerify('PROD-100003')} className="text-amber-600 font-mono font-semibold hover:underline" title="Pharmaceuticals & Healthcare">
              Multivitamin 💊
            </button>
            <button onClick={() => quickVerify('PROD-100002')} className="text-rose-700 font-mono font-semibold hover:underline" title="Recalled Batch">
              Recalled ✕
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {step === 'CHECKING' && (
        <Card variant="default" className="p-8 text-center">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-3" />
          <h3 className="font-bold text-slate-900">Checking blockchain record...</h3>
          <p className="text-xs text-slate-500 mt-1">
            Querying Algorand Box Map storage for <span className="font-mono font-bold">{query.toUpperCase()}</span>
          </p>
        </Card>
      )}

      {/* Verification Result */}
      {step === 'DONE' && searchedId && (
        <div className="space-y-4">
          {/* Large Verification Banner */}
          {verificationState === 'AUTHENTIC' && (
            <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl border border-emerald-700 shadow-xl text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 bg-emerald-400/20 rounded-2xl border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-9 h-9 text-emerald-300" />
                </div>
                <div>
                  <div className="text-xs font-extrabold tracking-widest text-emerald-300 mb-1">✓ VERIFIED</div>
                  <h2 className="text-2xl font-extrabold">AUTHENTIC PRODUCT</h2>
                  <p className="text-xs text-emerald-200 mt-1">
                    Blockchain record verified. Product ID <span className="font-mono font-bold text-white">{searchedId}</span> is registered,
                    has no active recall or counterfeit reports.
                  </p>
                </div>
              </div>
            </div>
          )}

          {verificationState === 'SUSPICIOUS' && (
            <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 rounded-2xl border border-amber-700 shadow-xl text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 bg-amber-400/20 rounded-2xl border border-amber-400/40 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-9 h-9 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-extrabold tracking-widest text-amber-300 mb-1">⚠ SUSPICIOUS</div>
                  <h2 className="text-2xl font-extrabold">COUNTERFEIT REPORT FOUND</h2>
                  <p className="text-xs text-amber-200 mt-1">
                    An incident report with cryptographic evidence has been logged against Product ID{' '}
                    <span className="font-mono font-bold text-white">{searchedId}</span>. Do not purchase or distribute.
                  </p>
                </div>
              </div>
            </div>
          )}

          {verificationState === 'RECALLED' && (
            <div className="p-6 sm:p-8 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 rounded-2xl border border-rose-700 shadow-xl text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 bg-rose-400/20 rounded-2xl border border-rose-400/40 flex items-center justify-center shrink-0">
                  <XCircle className="w-9 h-9 text-rose-300" />
                </div>
                <div>
                  <div className="text-xs font-extrabold tracking-widest text-rose-300 mb-1">✕ RECALLED</div>
                  <h2 className="text-2xl font-extrabold">PRODUCT RECALLED</h2>
                  <p className="text-xs text-rose-200 mt-1">
                    This batch has been officially recalled by the manufacturer or system admin. All transfers are permanently locked on-chain.
                  </p>
                </div>
              </div>
            </div>
          )}

          {verificationState === 'NOT_FOUND' && (
            <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl border border-slate-600 shadow-xl text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 bg-slate-500/20 rounded-2xl border border-slate-400/40 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-9 h-9 text-slate-300" />
                </div>
                <div>
                  <div className="text-xs font-extrabold tracking-widest text-slate-300 mb-1">? NOT FOUND</div>
                  <h2 className="text-2xl font-extrabold">PRODUCT NOT FOUND</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    No box map record exists on Algorand for <span className="font-mono font-bold text-white">{searchedId}</span>. This product may be unregistered or counterfeit. Exercise extreme caution.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Product Details (if found) */}
          {record && (
            <Card variant="default">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Product Name:</span>
                      <span className="font-bold text-slate-900">{record.name || '—'}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">Batch Number:</span>
                      <span className="font-mono font-bold text-slate-900">{record.batchId}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-100 items-center">
                      <span className="text-slate-500 font-medium">Current Status:</span>
                      <StatusBadge status={record.currentStatus} showIcon={false} />
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">Category:</span>
                      <span className="font-semibold text-slate-900">{record.category || '—'}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div>
                      <span className="text-slate-500 font-medium block mb-1">Manufacturer:</span>
                      <WalletAddress address={record.manufacturer} />
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-500 font-medium block mb-1">Current Holder:</span>
                      <WalletAddress address={record.currentHolder} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-slate-900 text-white rounded-xl font-mono text-xs">
                  <div className="flex items-center gap-2 text-teal-400 font-bold mb-2">
                    <FileText className="w-4 h-4" /> Document SHA-256 Hash
                  </div>
                  <p className="text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800">
                    {record.metadataHash}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                    onClick={() => setActiveNav('counterfeit-reports')}
                  >
                    Report Suspicious Activity
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setStep('IDLE');
                      setQuery('');
                      setSearchedId(null);
                    }}
                  >
                    Verify Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </PageContainer>
  );
};
