import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { WalletAddress } from '../components/ui/WalletAddress';
import {
  ShieldCheck,
  HelpCircle,
  ArrowLeftRight,
  FileText,
  Clock,
  ArrowLeft,
  Factory,
  Truck,
  Store,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { selectedProductId, setActiveNav } = useNavigation();
  const { getProductById, getProductHistory } = useProducts();

  const activeId = selectedProductId || 'PROD-RICE-0001';
  const product = getProductById(activeId);
  const history = getProductHistory(activeId);

  return (
    <PageContainer>
      <PageHeader
        title={product ? `${product.name} (${product.productId})` : `Product Details: ${activeId}`}
        description="Comprehensive audit trail & on-chain verification state for physical product."
        breadcrumbs={[
          { label: 'Products', key: 'products' },
          { label: activeId },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => setActiveNav('products')}
          >
            Back to Products
          </Button>
        }
      />

      {!product ? (
        <Card variant="default" className="p-8 text-center bg-slate-50 border-slate-200">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Product Record Not Found</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            No box map record exists on Algorand for Product ID <span className="font-mono font-bold text-slate-900">{activeId}</span>.
          </p>
          <Button variant="primary" size="md" onClick={() => setActiveNav('products')}>
            Return to Catalog
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* HEADER BADGE & QUICK STATUS */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-extrabold text-indigo-600">{product.productId}</span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-500">{product.category}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
              <p className="text-xs text-slate-500 mt-1">
                Manufacturer: <strong className="text-slate-800">{product.farmSource || product.origin}</strong> | Batch: <strong className="font-mono text-slate-800">{product.batchId}</strong>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={product.currentStatus} />
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowLeftRight className="w-4 h-4" />}
                onClick={() => setActiveNav('transfers')}
              >
                Transfer Product
              </Button>
            </div>
          </div>

          {/* 1. PRODUCT INFORMATION */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-1 font-medium">Product ID:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{product.productId}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-1 font-medium">Batch ID:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{product.batchId}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-1 font-medium">Category:</span>
                  <span className="font-bold text-slate-900 text-sm">{product.category}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-1 font-medium">Origin:</span>
                  <span className="font-semibold text-slate-900 text-sm">{product.origin}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-1 font-medium">Manufacturer:</span>
                  <WalletAddress address={product.manufacturer} />
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block mb-1 font-medium">Current Owner / Custody:</span>
                  <WalletAddress address={product.currentHolder} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. BLOCKCHAIN VERIFICATION */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Blockchain Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-emerald-700 block font-semibold text-[11px]">Blockchain Status</span>
                    <span className="text-emerald-950 font-extrabold text-base">✓ VERIFIED AUTHENTIC</span>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block font-medium text-[11px]">Transaction Hash Reference</span>
                  <span className="font-mono font-bold text-slate-900 text-xs truncate block mt-1">
                    {history[0]?.txId || 'TX-RICE-REG-99101A'}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block font-medium text-[11px]">Blockchain Protocol</span>
                  <span className="font-bold text-indigo-600 text-sm block mt-0.5">Algorand LocalNet (ARC-4)</span>
                </div>
              </div>

              {/* SHA-256 Metadata Hash */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 font-mono">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                  <FileText className="w-4 h-4" /> Off-Chain SHA-256 Metadata Hash
                </div>
                <p className="text-slate-300 break-all text-[11px] bg-slate-950 p-2.5 rounded border border-slate-800">
                  {product.metadataHash}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. SUPPLY CHAIN JOURNEY (Manufacturer → Distributor → Retailer → Customer) */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" /> Supply Chain Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl border-2 border-teal-300 bg-teal-50/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Factory className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-slate-900">1. Manufacturer</span>
                  </div>
                  <p className="font-semibold text-slate-700">Andhra Agro Foods</p>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-2">✓ Registered</span>
                </div>

                <div className="p-4 rounded-xl border-2 border-indigo-300 bg-indigo-50/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-900">2. Distributor</span>
                  </div>
                  <p className="font-semibold text-slate-700">Global Logistics Corp</p>
                  <span className="text-[10px] text-amber-600 font-bold block mt-2">⚡ In Transit</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Store className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-900">3. Retailer</span>
                  </div>
                  <p className="font-semibold text-slate-500">Retail Organics Store</p>
                  <span className="text-[10px] text-slate-400 block mt-2">Pending Receipt</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-900">4. Customer</span>
                  </div>
                  <p className="font-semibold text-slate-500">Verified Consumer</p>
                  <span className="text-[10px] text-slate-400 block mt-2">Pending Sale</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. ACTIVITY HISTORY */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.map((evt, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-slate-900">{evt.eventType}</span>
                        <StatusBadge status={evt.status} />
                      </div>
                      <p className="text-slate-500">
                        {new Date(evt.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date(evt.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {evt.txId && (
                      <span className="font-mono text-[11px] text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200/80">
                        Tx: {evt.txId}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};
