import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import {
  PackageCheck,
  Box,
  MapPin,
  Layers,
  Thermometer,
  Activity,
  ExternalLink,
} from 'lucide-react';

export const WarehouseWorkspace: React.FC = () => {
  const { setActiveNav, navigateToProductDetails } = useNavigation();
  const { products } = useProducts();

  const warehouseProducts = products.filter(
    (p) => p.currentStatus === 'AT_WAREHOUSE' || p.currentStatus === 'IN_TRANSIT'
  );

  const sampleWarehouseRecord = {
    facility: 'Central Storage & Logistics Hub A',
    facilityGps: '16.512400° N, 80.639900° E',
    latitude: 16.5124,
    longitude: 80.6399,
    zone: 'ZONE-W1',
    rack: 'RACK-04',
    shelf: 'SHELF-B',
    bin: 'BIN-12',
    temperature: 18.5,
    sensorId: 'SENS-WHS-01',
    storageTimestamp: Date.now() - 1000 * 60 * 60 * 2,
    blockchainTxId: 'TX-ALGO-WHS-8821-0012',
  };

  return (
    <PageContainer>
      <PageHeader
        title="Warehouse Storage Center"
        description="Inspect inbound logistics receipts, verify exact rack/shelf/bin storage coordinates, and record AVM storage proof keys."
        breadcrumbs={[{ label: 'Warehouse Workspace' }]}
        actions={
          <Button
            onClick={() => setActiveNav('receive-product')}
            variant="primary"
            size="md"
            leftIcon={<PackageCheck className="w-4 h-4" />}
          >
            Receive Product to Warehouse
          </Button>
        }
      />

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stored Products</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{warehouseProducts.length} Batches</h3>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">Shelved & Verified</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Box className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Facility Hub</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Hub A (Central)</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">GPS: 16.5124, 80.6399</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ambient Temperature</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{sampleWarehouseRecord.temperature}°C</h3>
              <p className="text-[11px] text-slate-500 mt-1">Sensor: {sampleWarehouseRecord.sensorId}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Thermometer className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On-Chain Storage Keys</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{products.length + 4} Keys</h3>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">ARC-4 Box Storage</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EXACT STORAGE LOCATION SPECIFICATION & BLOCKCHAIN PROOF CARD */}
      <Card variant="default" className="border-teal-200 mb-8 bg-gradient-to-br from-teal-50/30 to-white">
        <CardHeader className="flex items-center justify-between border-b border-teal-100 pb-3">
          <CardTitle className="text-sm text-teal-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            Exact Warehouse Storage Location & Telemetry Verification
          </CardTitle>
          <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
            STATUS: STORED & VERIFIED
          </span>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Facility</span>
              <span className="font-bold text-slate-900 text-xs font-sans">{sampleWarehouseRecord.facility}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">GPS Coordinates</span>
              <span className="font-bold text-teal-700 text-xs">{sampleWarehouseRecord.facilityGps}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Ambient Temperature</span>
              <span className="font-bold text-slate-900 text-xs">{sampleWarehouseRecord.temperature}°C</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Sensor ID</span>
              <span className="font-bold text-indigo-700 text-xs">{sampleWarehouseRecord.sensorId}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-teal-900 text-teal-100 rounded-xl space-y-0.5">
              <span className="text-[10px] text-teal-300 uppercase font-bold block">Zone</span>
              <span className="font-bold text-sm text-white">{sampleWarehouseRecord.zone}</span>
            </div>
            <div className="p-3 bg-teal-900 text-teal-100 rounded-xl space-y-0.5">
              <span className="text-[10px] text-teal-300 uppercase font-bold block">Rack</span>
              <span className="font-bold text-sm text-white">{sampleWarehouseRecord.rack}</span>
            </div>
            <div className="p-3 bg-teal-900 text-teal-100 rounded-xl space-y-0.5">
              <span className="text-[10px] text-teal-300 uppercase font-bold block">Shelf</span>
              <span className="font-bold text-sm text-white">{sampleWarehouseRecord.shelf}</span>
            </div>
            <div className="p-3 bg-teal-900 text-teal-100 rounded-xl space-y-0.5">
              <span className="text-[10px] text-teal-300 uppercase font-bold block">Bin</span>
              <span className="font-bold text-sm text-white">{sampleWarehouseRecord.bin}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Storage Timestamp:</span>
                <span className="text-slate-200">{new Date(sampleWarehouseRecord.storageTimestamp).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Algorand Transaction ID:</span>
                <span className="text-teal-400 font-bold">{sampleWarehouseRecord.blockchainTxId}</span>
              </div>
            </div>
            <a
              href={`https://lora.algokit.io/localnet/tx/${sampleWarehouseRecord.blockchainTxId}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg font-bold flex items-center gap-1.5 text-xs transition-colors shrink-0"
            >
              Verify On-Chain <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* STORED PRODUCTS TABLE */}
      <Card variant="default">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Products Stored at Facility</CardTitle>
          <Button onClick={() => setActiveNav('products')} variant="outline" size="sm">
            View All Products
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.productId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-teal-700">{p.productId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.category}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{p.quantity} {p.unit}</td>
                    <td className="py-3 px-4"><StatusBadge status={p.currentStatus} /></td>
                    <td className="py-3 px-4 text-right">
                      <Button onClick={() => navigateToProductDetails(p.productId)} variant="outline" size="sm">
                        Inspect Bin
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
