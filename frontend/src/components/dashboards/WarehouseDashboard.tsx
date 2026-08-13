import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useProducts } from '../../context/ProductContext';
import { PageContainer } from '../layout/PageContainer';
import { PageHeader } from '../ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Warehouse,
  PackageCheck,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Activity,
  Boxes,
  Layers,
} from 'lucide-react';

export const WarehouseDashboard: React.FC = () => {
  const { setActiveNav, navigateToProductDetails } = useNavigation();
  const { products, historyEvents } = useProducts();

  const warehouseProducts = products.filter(
    (p) => p.currentStatus === 'AT_WAREHOUSE' || p.currentHolder.includes('WHS') || p.currentStatus === 'IN_TRANSIT'
  );
  const totalStock = products.length;
  const inWarehouseCount = products.filter((p) => p.currentStatus === 'AT_WAREHOUSE').length;
  const inboundPending = products.filter((p) => p.currentStatus === 'IN_TRANSIT').length;
  const verifiedCount = products.filter((p) => !p.recalled && !p.counterfeitReported).length;

  const sampleStock = warehouseProducts[0] || products[0];

  return (
    <PageContainer>
      <PageHeader
        title="Warehouse Stock & Fulfillment Hub"
        description="Manage high-volume inventory storage, audit pallet racks, and execute inbound receipt / outbound fulfillment."
        breadcrumbs={[{ label: 'Warehouse Workspace' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveNav('receive-product')}
              variant="primary"
              size="md"
              icon={<PackageCheck className="w-4 h-4" />}
            >
              Receive Inbound Pallet
            </Button>
            <Button
              onClick={() => setActiveNav('transfers')}
              variant="outline"
              size="md"
              icon={<ShoppingBag className="w-4 h-4" />}
            >
              Fulfill Outbound Order
            </Button>
          </div>
        }
      />

      {/* 4 STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card variant="default" className="border-purple-200/80 bg-gradient-to-br from-purple-50/40 to-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-800 uppercase tracking-wider">Total Warehouse Items</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalStock}</h3>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">Shelved & Tracked</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Boxes className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stored In Warehouse</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{inWarehouseCount}</h3>
              <p className="text-[11px] text-indigo-600 font-semibold mt-1">Pallet Racks Occupied</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Warehouse className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inbound Shipments</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{inboundPending}</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">En Route Handoff</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <PackageCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Authentic Products</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{verifiedCount}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Cryptographically Sealed</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setActiveNav('receive-product')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Receive Inbound</p>
              <p className="text-[11px] text-slate-400">Confirm custody receipt</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
        </button>

        <button
          onClick={() => setActiveNav('transfers')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Dispatch Order</p>
              <p className="text-[11px] text-slate-400">Transfer to retailer</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>

        <button
          onClick={() => setActiveNav('verify-product')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Audit Stock Tag</p>
              <p className="text-[11px] text-slate-400">Verify on-chain seal</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </button>

        <button
          onClick={() => setActiveNav('supply-chain')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Multi-Hop Timeline</p>
              <p className="text-[11px] text-slate-400">Track box map route</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
        </button>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="default">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Warehouse className="w-5 h-5 text-purple-600" />
                Current Warehouse Shelved Inventory
              </CardTitle>
              <Button onClick={() => setActiveNav('products')} variant="ghost" size="sm">
                View Stock List
              </Button>
            </CardHeader>
            <CardContent>
              {sampleStock ? (
                <div
                  onClick={() => navigateToProductDetails(sampleStock.productId)}
                  className="p-5 rounded-2xl border border-purple-200 bg-purple-50/30 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-700">{sampleStock.productId}</span>
                    <StatusBadge status={sampleStock.currentStatus} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{sampleStock.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Category: <span className="font-semibold text-slate-700">{sampleStock.category}</span> | Batch: {sampleStock.batchId}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No inventory shelved.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Warehouse Log
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {historyEvents.slice(0, 4).map((evt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-700">{evt.productId}</span>
                    <span className="text-[10px] text-slate-400">{new Date(evt.timestamp).toLocaleTimeString()}</span>
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
