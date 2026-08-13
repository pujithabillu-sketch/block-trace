import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LiveLocationMap } from '../components/LiveLocationMap';
import { useLiveLocation } from '../services/locationService';
import { temperatureService, type TemperatureVerificationRecord } from '../services/temperatureService';
import {
  Factory,
  PlusCircle,
  Truck,
  ShieldCheck,
  Activity,
  Thermometer,
  MapPin,
  Send,
} from 'lucide-react';

export const ManufacturerWorkspace: React.FC = () => {
  const { setActiveNav, navigateToProductDetails, addToast } = useNavigation();
  const { products, historyEvents } = useProducts();

  const selectedBatchId = 'PROD-RICE-0001';
  const liveGps = useLiveLocation(selectedBatchId, 5000);

  // Temperature verification state
  const [testTemp, setTestTemp] = useState<number>(3.8);
  const [verifiedRecord, setVerifiedRecord] = useState<TemperatureVerificationRecord | null>(() =>
    temperatureService.verifyTemperature({
      batchId: selectedBatchId,
      sensorId: 'TEMP-IOT-8812',
      temperature: 3.8,
      minimumAllowed: 2.0,
      maximumAllowed: 8.0,
      facility: 'Guntur Agriculture Processing Facility',
      zone: 'ZONE-A1',
      rack: 'RACK-02',
      shelf: 'SHELF-01',
      bin: 'BIN-08',
      latitude: 16.5062,
      longitude: 80.648,
    })
  );

  const handleVerifyTemp = () => {
    const record = temperatureService.verifyTemperature({
      batchId: selectedBatchId,
      sensorId: 'TEMP-IOT-8812',
      temperature: testTemp,
      minimumAllowed: 2.0,
      maximumAllowed: 8.0,
      facility: 'Guntur Agriculture Processing Facility',
      zone: 'ZONE-A1',
      rack: 'RACK-02',
      shelf: 'SHELF-01',
      bin: 'BIN-08',
      latitude: liveGps.latitude,
      longitude: liveGps.longitude,
    });
    setVerifiedRecord(record);
    addToast({
      type: record.status === 'CRITICAL' ? 'error' : record.status === 'WARNING' ? 'warning' : 'success',
      title: `Temperature Verification: ${record.status}`,
      message: `${record.statusMessage} (Tx: ${record.blockchainTransactionId})`,
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Manufacturer Control Center"
        description="Monitor registered production batches, verify IoT sensor telemetry, track manufacturing facility GPS, and issue ARC-4 provenance records."
        breadcrumbs={[{ label: 'Manufacturer Workspace' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveNav('register-product')}
              variant="primary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Register Batch
            </Button>
            <Button
              onClick={() => setActiveNav('transfers')}
              variant="outline"
              size="md"
              leftIcon={<Truck className="w-4 h-4" />}
            >
              Transfer to Distributor
            </Button>
          </div>
        }
      />

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Production Batches</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{products.length} Batches</h3>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">ARC-4 Verified</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Factory className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Products</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{products.filter((p) => p.currentStatus === 'REGISTERED').length + 1} Active</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Ready for Transfer</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sensor Temperature Status</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                {testTemp}°C
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    verifiedRecord?.status === 'SAFE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : verifiedRecord?.status === 'WARNING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {verifiedRecord?.status}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Sensor: TEMP-IOT-8812</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Thermometer className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blockchain Activity</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{historyEvents.length + 5} Tx</h3>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">Algorand LocalNet</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LIVE GOOGLE MAP & MANUFACTURING LOCATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            Manufacturing Facility & Live Batch GPS Location
          </h3>
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

        {/* TEMPERATURE SENSOR VERIFICATION MODULE */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-indigo-600" />
            Sensor Temperature Verification
          </h3>

          <Card variant="default" className="border-indigo-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Batch Sensor Verification Console</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Batch ID:</span>
                  <span className="font-bold text-slate-900">{selectedBatchId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sensor ID:</span>
                  <span className="font-bold text-indigo-700">TEMP-IOT-8812</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Allowed Range:</span>
                  <span className="font-bold text-slate-800">2.0°C – 8.0°C</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase block">
                  Simulate Sensor Reading (°C):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={-2}
                    max={14}
                    step={0.1}
                    value={testTemp}
                    onChange={(e) => setTestTemp(parseFloat(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="font-mono font-bold text-sm w-16 text-right text-slate-900">{testTemp}°C</span>
                </div>
              </div>

              <Button onClick={handleVerifyTemp} variant="primary" size="sm" className="w-full" leftIcon={<ShieldCheck className="w-4 h-4" />}>
                Verify Temperature On-Chain
              </Button>

              {verifiedRecord && (
                <div className={`p-3.5 rounded-xl border space-y-2 font-mono text-[11px] ${
                  verifiedRecord.status === 'SAFE'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : verifiedRecord.status === 'WARNING'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>Status: {verifiedRecord.status}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-current">VERIFIED</span>
                  </div>
                  <p className="font-sans leading-relaxed">{verifiedRecord.statusMessage}</p>
                  <div className="pt-2 border-t border-current/20 space-y-1">
                    <div className="flex justify-between">
                      <span className="opacity-70">Location Tag:</span>
                      <span>{verifiedRecord.facility}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Zone/Rack/Bin:</span>
                      <span>{verifiedRecord.zone} / {verifiedRecord.rack} / {verifiedRecord.bin}</span>
                    </div>
                    <div className="flex justify-between font-bold text-teal-700 truncate">
                      <span className="opacity-70 text-slate-600">Blockchain Tx:</span>
                      <span className="truncate max-w-[150px]">{verifiedRecord.blockchainTransactionId}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* REGISTERED PRODUCTION BATCHES & TRANSFER ACTION */}
      <Card variant="default">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Registered Production Batches</CardTitle>
          <Button onClick={() => setActiveNav('transfers')} variant="outline" size="sm" rightIcon={<Send className="w-4 h-4" />}>
            Batch Custody Transfer
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Product / Batch ID</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Mfg Date</th>
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
                    <td className="py-3 px-4 text-slate-600">{p.mfgDate}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{p.quantity} {p.unit}</td>
                    <td className="py-3 px-4"><StatusBadge status={p.currentStatus} /></td>
                    <td className="py-3 px-4 text-right">
                      <Button onClick={() => navigateToProductDetails(p.productId)} variant="outline" size="sm">
                        Inspect
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
