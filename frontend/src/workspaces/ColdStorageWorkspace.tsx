import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { temperatureService, type TemperatureVerificationRecord } from '../services/temperatureService';
import {
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Layers,
  MapPin,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

export const ColdStorageWorkspace: React.FC = () => {
  const { navigateToProductDetails, addToast } = useNavigation();
  const { products } = useProducts();

  const [inputTemp, setInputTemp] = useState<number>(3.8);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('BATCH-2026-001');

  const [verificationResult, setVerificationResult] = useState<TemperatureVerificationRecord>(() =>
    temperatureService.verifyTemperature({
      batchId: 'BATCH-2026-001',
      sensorId: 'TEMP-IOT-0042',
      temperature: 3.8,
      minimumAllowed: 2.0,
      maximumAllowed: 8.0,
      facility: 'Cold Storage Facility CS01',
      zone: 'COLD-ZONE-02',
      rack: 'COLD-RACK-07',
      shelf: 'SHELF-03',
      bin: 'BIN-C12',
      latitude: 16.5071,
      longitude: 80.6491,
    })
  );

  const handleRunVerification = () => {
    const record = temperatureService.verifyTemperature({
      batchId: selectedBatchId,
      sensorId: 'TEMP-IOT-0042',
      temperature: inputTemp,
      minimumAllowed: 2.0,
      maximumAllowed: 8.0,
      facility: 'Cold Storage Facility CS01',
      zone: 'COLD-ZONE-02',
      rack: 'COLD-RACK-07',
      shelf: 'SHELF-03',
      bin: 'BIN-C12',
      latitude: 16.5071,
      longitude: 80.6491,
    });

    setVerificationResult(record);

    addToast({
      type: record.status === 'CRITICAL' ? 'error' : record.status === 'WARNING' ? 'warning' : 'success',
      title: `Thermal Verification: ${record.status}`,
      message: `${record.statusMessage} (Tx: ${record.blockchainTransactionId})`,
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Cold Chain Monitoring Center"
        description="Monitor real-time thermal telemetry sensors, perform automated AVM temperature compliance verifications, and record immutable cold chain certificates."
        breadcrumbs={[{ label: 'Cold Storage Workspace' }]}
        actions={
          <Button
            onClick={handleRunVerification}
            variant="primary"
            size="md"
            leftIcon={<Thermometer className="w-4 h-4" />}
          >
            Verify Thermal Telemetry
          </Button>
        }
      />

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card variant="default" className="border-cyan-200 bg-gradient-to-br from-cyan-50/50 to-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-cyan-900 uppercase tracking-wider">Current Thermal Telemetry</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{verificationResult.temperature}°C</h3>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">Target Range: 2.0°C – 8.0°C</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Thermometer className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verification Status</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <span
                  className={`text-sm px-3 py-0.5 rounded-full font-bold ${
                    verificationResult.status === 'SAFE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : verificationResult.status === 'WARNING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {verificationResult.status}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Sensor: {verificationResult.sensorId}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cold Facility Location</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">CS01 Facility</h3>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">GPS: 16.507100, 80.649100</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Violation Alerts</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {verificationResult.status === 'CRITICAL' ? '1 CRITICAL ALERT' : '0 Violation Alerts'}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Real-time Compliance</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TEMPERATURE VERIFICATION CONSOLE & EXACT STORAGE LOCATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* LEFT 2 COLS: VERIFICATION DISPLAY */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="default" className="border-indigo-300 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verified Cold Storage Location & Temperature Record
                </CardTitle>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-400/30 uppercase font-bold">
                  Status: {verificationResult.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-xs font-mono">
              {/* EXACT STORAGE LOCATION SPECIFICATION REQUIRED BY USER */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm font-sans flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-600" />
                  Exact Storage Location Tag Specification
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Batch</span>
                    <span className="font-bold text-slate-900 text-xs">{verificationResult.batchId}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Facility</span>
                    <span className="font-bold text-slate-900 text-xs font-sans">{verificationResult.facility}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">GPS Coordinates</span>
                    <span className="font-bold text-teal-700 text-xs">{verificationResult.latitude.toFixed(6)}, {verificationResult.longitude.toFixed(6)}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Sensor ID</span>
                    <span className="font-bold text-indigo-700 text-xs">{verificationResult.sensorId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-indigo-900 text-indigo-100 rounded-xl space-y-0.5">
                    <span className="text-[10px] text-indigo-300 uppercase font-bold block">Zone</span>
                    <span className="font-bold text-sm text-white">{verificationResult.zone}</span>
                  </div>
                  <div className="p-3 bg-indigo-900 text-indigo-100 rounded-xl space-y-0.5">
                    <span className="text-[10px] text-indigo-300 uppercase font-bold block">Rack</span>
                    <span className="font-bold text-sm text-white">{verificationResult.rack}</span>
                  </div>
                  <div className="p-3 bg-indigo-900 text-indigo-100 rounded-xl space-y-0.5">
                    <span className="text-[10px] text-indigo-300 uppercase font-bold block">Shelf</span>
                    <span className="font-bold text-sm text-white">{verificationResult.shelf}</span>
                  </div>
                  <div className="p-3 bg-indigo-900 text-indigo-100 rounded-xl space-y-0.5">
                    <span className="text-[10px] text-indigo-300 uppercase font-bold block">Bin</span>
                    <span className="font-bold text-sm text-white">{verificationResult.bin}</span>
                  </div>
                </div>
              </div>

              {/* BLOCKCHAIN PROOF TRANSACTION CARD */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-teal-400 font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Algorand LocalNet Smart Contract Record
                  </span>
                  <span className="text-slate-400 text-[10px]">{verificationResult.network}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Verified Temperature</span>
                    <span className="font-bold text-teal-300 text-sm">{verificationResult.temperature}°C (Allowed: 2.0°C – 8.0°C)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Verification Timestamp</span>
                    <span className="font-bold text-slate-200">{new Date(verificationResult.verificationTimestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">Transaction ID:</span>
                    <span className="text-amber-300 font-bold text-xs">{verificationResult.blockchainTransactionId}</span>
                  </div>
                  <a
                    href={`https://lora.algokit.io/localnet/tx/${verificationResult.blockchainTransactionId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-400 hover:text-teal-300 text-xs font-bold flex items-center gap-1"
                  >
                    View Tx <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COL: SIMULATION / SENSOR CONTROL */}
        <div className="space-y-4">
          <Card variant="default">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Sensor Reading Simulator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Select Batch:</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 rounded-lg text-xs font-mono font-bold bg-white"
                >
                  <option value="BATCH-2026-001">BATCH-2026-001 (Cold Storage CS01)</option>
                  <option value="PROD-RICE-0001">PROD-RICE-0001 (Basmati Batch)</option>
                  <option value="PROD-100001">PROD-100001 (Avocado Cold Chain)</option>
                  <option value="PROD-PHARM-301">PROD-PHARM-301 (Vaccine Ultra-Cold)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Adjust Sensor Temperature (°C):</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={-5}
                    max={15}
                    step={0.1}
                    value={inputTemp}
                    onChange={(e) => setInputTemp(parseFloat(e.target.value))}
                    className="flex-1 accent-cyan-600"
                  />
                  <span className="font-mono font-bold text-sm text-slate-900 w-14 text-right">{inputTemp}°C</span>
                </div>
              </div>

              <Button onClick={handleRunVerification} variant="primary" size="md" className="w-full" leftIcon={<ShieldCheck className="w-4 h-4" />}>
                Execute On-Chain Verification
              </Button>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-600">
                <p className="font-bold text-slate-800">Compliance Rules:</p>
                <p>• <strong>SAFE</strong>: 2.0°C to 8.0°C</p>
                <p>• <strong>WARNING</strong>: Within 1.0°C of limit</p>
                <p>• <strong>CRITICAL</strong>: Below 2.0°C or above 8.0°C</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* COLD CHAIN PRODUCTS LIST TABLE */}
      <Card variant="default">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Cold Chain Monitored Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Storage Temp</th>
                  <th className="py-3 px-4">Thermal Status</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.productId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-teal-700">{p.productId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{p.storageTemp || '3.8°C'}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{p.coldChainStatus || 'OPTIMAL'}</td>
                    <td className="py-3 px-4"><StatusBadge status={p.currentStatus} /></td>
                    <td className="py-3 px-4 text-right">
                      <Button onClick={() => navigateToProductDetails(p.productId)} variant="outline" size="sm">
                        Inspect Telemetry
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
