import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useProducts } from '../../context/ProductContext';
import { PageContainer } from '../layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import {
  ShieldCheck,
  Search,
  QrCode,
  Box,
  Truck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { setActiveNav, setSelectedProductId, navigateToProductDetails } = useNavigation();
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const sampleRice = products.find((p) => p.productId === 'PROD-RICE-0001') || products[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedProductId(searchQuery.trim());
      setActiveNav('verify-product');
    }
  };

  return (
    <PageContainer>
      {/* WELCOME HERO SECTION */}
      <div className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consumer Provenance Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Welcome to BlocTrace
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Verify the origin, quality certificates, and supply chain journey of your products backed by immutable Algorand blockchain records.
          </p>

          {/* SEARCH VERIFIED PRODUCTS FORM */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-5 h-5 text-indigo-300" />
              <input
                type="text"
                placeholder="Enter Product ID (e.g. PROD-RICE-0001) or scan QR code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm font-medium focus:outline-none"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Verify Origin
            </Button>
          </form>
        </div>

        {/* Decorative subtle background shape */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* QUICK ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card
          onClick={() => setActiveNav('products')}
          variant="default"
          className="p-5 cursor-pointer group hover:border-indigo-300 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Box className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Browse Products</h3>
          <p className="text-xs text-slate-500 mb-4">Inspect verified products in the global catalog.</p>
          <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:underline">
            View Catalog <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Card>

        <Card
          onClick={() => setActiveNav('supply-chain')}
          variant="default"
          className="p-5 cursor-pointer group hover:border-sky-300 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Track My Orders</h3>
          <p className="text-xs text-slate-500 mb-4">Monitor live custody movements across suppliers.</p>
          <span className="text-xs font-bold text-sky-600 flex items-center gap-1 group-hover:underline">
            Track Order <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Card>

        <Card
          onClick={() => setActiveNav('verify-product')}
          variant="default"
          className="p-5 cursor-pointer group hover:border-emerald-300 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Verify Authenticity</h3>
          <p className="text-xs text-slate-500 mb-4">Check raw material & batch origin certificates.</p>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:underline">
            Verify Now <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Card>

        <Card
          onClick={() => setActiveNav('qr-scanner')}
          variant="default"
          className="p-5 cursor-pointer group hover:border-purple-300 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Scan QR Code</h3>
          <p className="text-xs text-slate-500 mb-4">Use device camera to scan packaging QR tags.</p>
          <span className="text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:underline">
            Launch Scanner <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Card>
      </div>

      {/* RECOMMENDED VERIFIED PRODUCTS SECTION */}
      <Card variant="default">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Featured Verified Products</CardTitle>
          <Button onClick={() => setActiveNav('products')} variant="ghost" size="sm">
            View All Catalog
          </Button>
        </CardHeader>
        <CardContent>
          {sampleRice ? (
            <div
              onClick={() => navigateToProductDetails(sampleRice.productId)}
              className="p-6 rounded-2xl border border-slate-200/80 hover:border-indigo-400/80 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    ✓ Blockchain Verified
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600">{sampleRice.productId}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{sampleRice.name}</h3>
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">{sampleRice.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                  <span>Origin: <strong className="text-slate-800">{sampleRice.origin}</strong></span>
                  <span>•</span>
                  <span>Batch: <strong className="font-mono text-slate-800">{sampleRice.batchId}</strong></span>
                  <span>•</span>
                  <span>Category: <strong className="text-slate-800">{sampleRice.category}</strong></span>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                <StatusBadge status={sampleRice.currentStatus} />
                <Button variant="primary" size="sm" icon={<ShieldCheck className="w-4 h-4" />}>
                  Inspect Journey
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No products available in catalog.</p>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
};
