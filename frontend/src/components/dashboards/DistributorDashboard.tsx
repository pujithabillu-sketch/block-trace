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
  PackageCheck,
  Truck,
  Warehouse,
  ShoppingBag,
  Clock,
} from 'lucide-react';

export const DistributorDashboard: React.FC = () => {
  const { setActiveNav } = useNavigation();
  const { products } = useProducts();

  // Distributor specific filtering:
  // Incoming shipments: products where pendingRecipient is distributor OR status is IN_TRANSIT
  const incomingShipments = products.filter(
    (p) => p.currentStatus === 'IN_TRANSIT' || p.pendingRecipientRole === 'DISTRIBUTOR'
  );
  const receivedProducts = products.filter((p) => p.currentStatus === 'AT_DISTRIBUTOR');
  const inWarehouseCount = products.filter((p) => p.currentStatus === 'AT_WAREHOUSE' || p.currentStatus === 'AT_DISTRIBUTOR').length;
  const outgoingTransfers = products.filter((p) => p.currentStatus === 'IN_TRANSIT' && p.currentHolder !== p.manufacturer).length;

  return (
    <PageContainer>
      <PageHeader
        title="Distributor Logistics Hub"
        description="Monitor incoming manufacturer shipments, verify physical custody, and dispatch inventory to regional warehouses & retailers."
        breadcrumbs={[{ label: 'Distributor Workspace' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveNav('receive-product')}
              variant="primary"
              size="md"
              icon={<PackageCheck className="w-4 h-4" />}
            >
              Receive Product
            </Button>
            <Button
              onClick={() => setActiveNav('transfers')}
              variant="outline"
              size="md"
              icon={<Truck className="w-4 h-4" />}
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
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Incoming Shipments</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{incomingShipments.length}</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">Pending Receipt</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Received Products</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{receivedProducts.length}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Confirmed Custody</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PackageCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Warehouse</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{inWarehouseCount}</h3>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">Active Storage</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Warehouse className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outgoing Transfers</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{outgoingTransfers}</h3>
              <p className="text-[11px] text-sky-600 font-semibold mt-1">Dispatched to Retail</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* INBOUND SHIPMENTS SECTION */}
      <div className="space-y-6">
        <Card variant="default">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Inbound Manufacturer Shipments</CardTitle>
            <Button onClick={() => setActiveNav('receive-product')} variant="primary" size="sm">
              Receive Products
            </Button>
          </CardHeader>
          <CardContent>
            {incomingShipments.length > 0 ? (
              <div className="space-y-3">
                {incomingShipments.map((prod) => (
                  <div
                    key={prod.productId}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-600 font-mono">{prod.productId}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-500">{prod.category}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{prod.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Manufacturer: <span className="font-semibold text-slate-700">{prod.farmSource || prod.origin}</span> | Batch: <span className="font-mono font-bold">{prod.batchId}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={prod.currentStatus} />
                      <Button
                        onClick={() => setActiveNav('receive-product')}
                        variant="primary"
                        size="sm"
                        icon={<PackageCheck className="w-4 h-4" />}
                      >
                        Accept Custody
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No incoming shipments"
                description="There are currently no products waiting for receipt in your distribution queue."
                actionLabel="Refresh List"
                onAction={() => window.location.reload()}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
