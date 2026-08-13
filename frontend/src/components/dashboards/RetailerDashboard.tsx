import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useProducts } from '../../context/ProductContext';
import { PageContainer } from '../layout/PageContainer';
import { PageHeader } from '../ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';
import {
  Store,
  ShoppingCart,
  CheckCircle2,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';

export const RetailerDashboard: React.FC = () => {
  const { setActiveNav } = useNavigation();
  const { products } = useProducts();

  // Retailer statistics
  const storeInventory = products.filter((p) => p.currentStatus === 'AT_RETAILER' || p.currentStatus === 'IN_TRANSIT');
  const availableForSale = products.filter((p) => p.currentStatus === 'AT_RETAILER');
  const productsSold = products.filter((p) => p.currentStatus === 'SOLD');
  const verifiedProducts = products.filter((p) => !p.recalled && !p.counterfeitReported);

  return (
    <PageContainer>
      <PageHeader
        title="Retail Store Operations"
        description="Receive stock from distributors, verify product authenticity at point of sale, and transfer ownership to consumers."
        breadcrumbs={[{ label: 'Retailer Workspace' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveNav('receive-product')}
              variant="primary"
              size="md"
              icon={<PackageCheck className="w-4 h-4" />}
            >
              Stock Check-In
            </Button>
            <Button
              onClick={() => setActiveNav('transfers')}
              variant="outline"
              size="md"
              icon={<ShoppingCart className="w-4 h-4" />}
            >
              Sell Product
            </Button>
          </div>
        }
      />

      {/* 4 STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Products in Store</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{storeInventory.length}</h3>
              <p className="text-[11px] text-indigo-600 font-semibold mt-1">Total Stock</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available for Sale</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{availableForSale.length}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Ready for Checkout</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Products Sold</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{productsSold.length}</h3>
              <p className="text-[11px] text-blue-600 font-semibold mt-1">Transferred to Customer</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Products</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{verifiedProducts.length}</h3>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">Guaranteed Authentic</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* STORE INVENTORY LIST */}
      <Card variant="default">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Retail Store Inventory</CardTitle>
          <Button onClick={() => setActiveNav('products')} variant="ghost" size="sm">
            View All Stock
          </Button>
        </CardHeader>
        <CardContent>
          {storeInventory.length > 0 ? (
            <div className="space-y-3">
              {storeInventory.map((item) => (
                <div
                  key={item.productId}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-indigo-600 font-mono">{item.productId}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-500">{item.category}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Batch: <span className="font-mono font-bold">{item.batchId}</span> | Origin: {item.origin}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.currentStatus} />
                    <Button
                      onClick={() => setActiveNav('transfers')}
                      variant="primary"
                      size="sm"
                      icon={<ShoppingCart className="w-4 h-4" />}
                    >
                      Sell Item
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products in store inventory"
              description="You currently have no active inventory items checked into your retail store."
              actionLabel="Check In Inbound Stock"
              onAction={() => setActiveNav('receive-product')}
            />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
};
