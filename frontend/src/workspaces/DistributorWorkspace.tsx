import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LiveLocationMap } from '../components/LiveLocationMap';
import { useLiveLocation } from '../services/locationService';
import {
  Truck,
  Activity,
  ShieldCheck,
  Navigation,
  User,
  Radio,
  ArrowRight,
} from 'lucide-react';

export const DistributorWorkspace: React.FC = () => {
  const { setActiveNav, navigateToProductDetails } = useNavigation();
  const { products, historyEvents } = useProducts();

  const selectedBatchId = 'PROD-RICE-0001';
  const liveGps = useLiveLocation(selectedBatchId, 5000);

  const activeShipments = products.filter((p) => p.currentStatus === 'IN_TRANSIT');
  const incomingShipments = products.filter((p) => p.currentStatus === 'REGISTERED' || p.currentStatus === 'IN_TRANSIT');

  return (
    <PageContainer>
      <PageHeader
        title="Distributor Logistics Hub"
        description="Monitor active freight transit corridors, view live Google Maps 5-second GPS telemetry, inspect vehicle telemetry, and execute custody handoffs."
        breadcrumbs={[{ label: 'Distributor Workspace' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveNav('receive-product')}
              variant="primary"
              size="md"
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Confirm Receipt
            </Button>
            <Button
              onClick={() => setActiveNav('transfers')}
              variant="outline"
              size="md"
              leftIcon={<Truck className="w-4 h-4" />}
            >
              Dispatch Shipment
            </Button>
          </div>
        }
      />

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Shipments</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeShipments.length} En Route</h3>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">Live GPS Tracked</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Incoming Deliveries</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{incomingShipments.length} Pending</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Awaiting Receipt</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Fleet Vehicles</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">3 Heavy Trucks</h3>
              <p className="text-[11px] text-sky-600 font-semibold mt-1">Cellular IoT Connected</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Custody Handshakes</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{historyEvents.length + 3} Verified</h3>
              <p className="text-[11px] text-indigo-600 font-semibold mt-1">Algorand AVM Proof</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LIVE GOOGLE MAPS GPS TRACKER & VEHICLE TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-teal-600" />
              Live Google Maps Vehicle Fleet GPS Telemetry
            </h3>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              5s Refresh Active
            </span>
          </div>
          <LiveLocationMap
            latitude={liveGps.latitude}
            longitude={liveGps.longitude}
            facilityLatitude={liveGps.facilityLatitude}
            facilityLongitude={liveGps.facilityLongitude}
            facilityName={liveGps.facilityName}
            batchId={selectedBatchId}
            speedKmH={liveGps.speed}
            heading={liveGps.heading}
            statusText={liveGps.status}
          />
        </div>

        {/* VEHICLE DETAILS & FLEET CARD */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-slate-700" />
            Assigned Transport Vehicle Details
          </h3>

          <Card variant="default" className="border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Vehicle: FLT-AGRI-9901</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">ONLINE</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs font-mono">
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">License Plate:</span>
                  <span className="font-bold text-slate-900">AP-16-TV-4482</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Driver Name:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-teal-600" /> Ramesh Verma
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Payload Capacity:</span>
                  <span className="font-bold text-slate-900">12.5 Metric Tons</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Modem Sensor ID:</span>
                  <span className="font-bold text-indigo-700">GPS-IOT-MODEM-770</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Speed:</span>
                  <span className="text-teal-300 font-bold">{liveGps.speed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Compass Heading:</span>
                  <span className="text-slate-200">{liveGps.heading}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="text-teal-400">{liveGps.latitude.toFixed(6)}, {liveGps.longitude.toFixed(6)}</span>
                </div>
              </div>

              <Button
                onClick={() => setActiveNav('transfers')}
                variant="primary"
                size="sm"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Handshake Custody Transfer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ACTIVE & INCOMING SHIPMENTS TABLE */}
      <Card variant="default">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Logistics Active Shipments</CardTitle>
          <Button onClick={() => setActiveNav('receive-product')} variant="outline" size="sm">
            Receive Incoming Shipment
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Current Holder</th>
                  <th className="py-3 px-4">Pending Recipient</th>
                  <th className="py-3 px-4">Shipment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.productId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-teal-700">{p.productId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 truncate max-w-[120px]">{p.currentHolder}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 truncate max-w-[120px]">{p.pendingRecipient || 'N/A'}</td>
                    <td className="py-3 px-4"><StatusBadge status={p.currentStatus} /></td>
                    <td className="py-3 px-4 text-right">
                      <Button onClick={() => navigateToProductDetails(p.productId)} variant="outline" size="sm">
                        Track Custody
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
