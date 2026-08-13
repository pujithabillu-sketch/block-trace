import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useProducts } from '../../context/ProductContext';
import { PageContainer } from '../layout/PageContainer';
import { PageHeader } from '../ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { GpsLocationTracker } from '../ui/GpsLocationTracker';
import { WorkspaceProofCard } from '../ui/WorkspaceProofCard';
import {
  Package,
  PlusCircle,
  Truck,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Activity,
  Layers,
  History,
} from 'lucide-react';

export const ManufacturerDashboard: React.FC = () => {
  const { setActiveNav, navigateToProductDetails } = useNavigation();
  const { products, historyEvents } = useProducts();

  // Statistics tailored for Manufacturer
  const totalProducts = products.length;
  const registeredBatches = products.filter((p) => p.currentStatus === 'REGISTERED' || p.currentStatus === 'MANUFACTURED' || p.currentStatus === 'IN_TRANSIT').length;
  const inTransitCount = products.filter((p) => p.currentStatus === 'IN_TRANSIT').length;
  const verifiedCount = products.filter((p) => !p.recalled && !p.counterfeitReported).length;

  const sampleRiceProduct = products.find((p) => p.productId === 'PROD-RICE-0001') || products[0];

  return (
    <PageContainer>
      <PageHeader
        title="Manufacturer Control Center"
        description="Register new production batches, mint Algorand provenance records, track live GPS transport, and verify smart contract security."
        breadcrumbs={[{ label: 'Manufacturer Workspace' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveNav('register-product')}
              variant="primary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Register New Product
            </Button>
            <Button
              onClick={() => setActiveNav('transfers')}
              variant="outline"
              size="md"
              leftIcon={<Truck className="w-4 h-4" />}
            >
              Transfer Batch
            </Button>
          </div>
        }
      />

      {/* 4 STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Products</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalProducts}</h3>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">Active Batches</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Batches</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{registeredBatches}</h3>
              <p className="text-[11px] text-indigo-600 font-semibold mt-1">On-Chain ARC-4</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Transit</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{inTransitCount}</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">Custody En Route</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Products</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{verifiedCount}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% Authentic</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WORKSPACE ON-CHAIN PROOF OF AUTHENTICATION & LIVE GPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GpsLocationTracker product={sampleRiceProduct} />
        <WorkspaceProofCard role="MANUFACTURER" title="Industrial Workspace Proof of Authenticity" />
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setActiveNav('register-product')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Register Product</p>
              <p className="text-[11px] text-slate-500">Mint provenance record</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>

        <button
          onClick={() => setActiveNav('qr-scanner')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">QR Code Label</p>
              <p className="text-[11px] text-slate-500">Generate physical tag</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </button>

        <button
          onClick={() => setActiveNav('transfers')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Transfer Batch</p>
              <p className="text-[11px] text-slate-500">Dispatch to distributor</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
        </button>

        <button
          onClick={() => setActiveNav('supply-chain')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Supply Chain Map</p>
              <p className="text-[11px] text-slate-500">Audit timeline</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
        </button>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="default">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                Featured Product Batch: {sampleRiceProduct.name}
              </CardTitle>
              <Button onClick={() => setActiveNav('products')} variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div
                onClick={() => navigateToProductDetails(sampleRiceProduct.productId)}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/80 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                      📁 {sampleRiceProduct.category || 'Food & Perishables'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">{sampleRiceProduct.productId}</span>
                  </div>
                  <StatusBadge status={sampleRiceProduct.currentStatus} />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900">{sampleRiceProduct.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Origin: <span className="font-semibold text-slate-800">{sampleRiceProduct.farmSource || sampleRiceProduct.origin}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Quality Cert</span>
                    <span className="font-bold text-emerald-700">{sampleRiceProduct.qualityCert || 'FSSAI-ORGANIC'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Quantity</span>
                    <span className="font-bold text-slate-800">{sampleRiceProduct.quantity} {sampleRiceProduct.unit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Metadata Hash</span>
                    <span className="font-mono text-[10px] font-bold text-teal-700 truncate block">
                      {sampleRiceProduct.metadataHash.substring(0, 14)}...
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Live Mint Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {historyEvents.slice(0, 4).map((evt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-700">{evt.productId}</span>
                    <span className="text-[10px] text-slate-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="font-semibold text-slate-800">{evt.eventType}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
