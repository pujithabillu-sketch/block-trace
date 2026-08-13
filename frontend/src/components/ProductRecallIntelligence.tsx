import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { useNavigation } from '../context/NavigationContext';
import type { RecallIntelligenceRecord, RecallActionState } from '../types';
import {
  AlertTriangle,
  ExternalLink,
  Flame,
} from 'lucide-react';

export const INITIAL_RECALL_INCIDENTS: RecallIntelligenceRecord[] = [
  {
    id: 'INCIDENT-2026-001',
    batchId: 'PROD-100002',
    sensorId: 'TEMP-IOT-9921',
    detectedTemperature: 14.8,
    allowedRange: '2.0°C – 8.0°C',
    durationMinutes: 45,
    currentLocation: 'Refrigerated Bay 04, Central Logistics Hub A',
    affectedUnits: 1200,
    affectedDistributor: 'Global Freight Lines Ltd',
    affectedStorageFacility: 'Central Storage Hub A',
    incidentTimestamp: Date.now() - 1000 * 60 * 120,
    actionState: 'TEMPERATURE_VIOLATION',
    txHash: 'TX-ALGO-ALERT-8801-4411',
  },
  {
    id: 'INCIDENT-2026-002',
    batchId: 'BATCH-MILK-9902',
    sensorId: 'TEMP-COLD-0042',
    detectedTemperature: 11.2,
    allowedRange: '1.0°C – 4.0°C',
    durationMinutes: 90,
    currentLocation: 'Cold Storage CS01, Zone COLD-02',
    affectedUnits: 2500,
    affectedDistributor: 'Metro Cold Chain Express',
    affectedStorageFacility: 'Cold Storage Facility CS01',
    incidentTimestamp: Date.now() - 1000 * 60 * 360,
    actionState: 'QUARANTINED',
    txHash: 'TX-ALGO-QUAR-5521-0099',
  },
];

interface ProductRecallIntelligenceProps {
  className?: string;
}

export const ProductRecallIntelligence: React.FC<ProductRecallIntelligenceProps> = ({ className = '' }) => {
  const { addToast } = useNavigation();
  const [incidents, setIncidents] = useState<RecallIntelligenceRecord[]>(INITIAL_RECALL_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<RecallIntelligenceRecord>(INITIAL_RECALL_INCIDENTS[0]);

  const handleUpdateStatus = (incidentId: string, newState: RecallActionState) => {
    const updatedTx = 'TX-ALGO-INCIDENT-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            actionState: newState,
            txHash: updatedTx,
          };
        }
        return inc;
      })
    );

    if (selectedIncident.id === incidentId) {
      setSelectedIncident((prev) => ({ ...prev, actionState: newState, txHash: updatedTx }));
    }

    addToast({
      type: newState === 'RECALLED' ? 'error' : newState === 'QUARANTINED' ? 'warning' : 'success',
      title: `Recall Intelligence Action: ${newState}`,
      message: `Batch ${selectedIncident.batchId} updated to ${newState}. On-chain Tx: ${updatedTx}`,
    });
  };

  return (
    <Card variant="default" className={`border-rose-300 shadow-sm ${className}`}>
      <CardHeader className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white rounded-t-xl pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-white text-base">Product Recall Intelligence & Thermal Breach Incident Console</CardTitle>
              <p className="text-xs text-rose-200/80 font-mono mt-0.5">
                Automated thermal excursion detection, containment mapping & Algorand AVM quarantine proof keys
              </p>
            </div>
          </div>

          <span className="px-3 py-1 bg-rose-500/20 text-rose-300 font-mono text-xs font-bold rounded-lg border border-rose-500/30 shrink-0">
            {incidents.filter((i) => i.actionState !== 'RELEASED').length} Active Alerts
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* INCIDENT LIST & CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incidents.map((incident) => {
            const isSelected = selectedIncident.id === incident.id;
            return (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-white hover:border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                      TEMPERATURE VIOLATION DETECTED
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">Batch: {incident.batchId}</h4>
                    <p className="text-xs text-slate-500 font-mono">Sensor: {incident.sensorId}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      incident.actionState === 'RECALLED'
                        ? 'bg-rose-900 text-white'
                        : incident.actionState === 'QUARANTINED'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : incident.actionState === 'RELEASED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {incident.actionState}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Detected Temp</span>
                    <span className="font-bold text-rose-600 text-sm">{incident.detectedTemperature}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Allowed Range</span>
                    <span className="font-bold text-slate-700">{incident.allowedRange}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAILED INCIDENT CONTAINMENT & ADMIN/PRODUCER ACTIONS */}
        {selectedIncident && (
          <Card variant="default" className="border-rose-200 bg-gradient-to-br from-rose-50/20 to-white">
            <CardHeader className="border-b border-rose-100 pb-3">
              <CardTitle className="text-sm text-rose-950 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600" />
                  Incident Containment & Affected Scope Analysis: {selectedIncident.batchId}
                </span>
                <span className="font-mono text-xs text-slate-500 font-normal">
                  Detected: {new Date(selectedIncident.incidentTimestamp).toLocaleString()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5 text-xs font-mono">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Affected Batch ID</span>
                  <span className="font-bold text-rose-700 text-sm">{selectedIncident.batchId}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Affected Units</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedIncident.affectedUnits.toLocaleString()} Units</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Affected Distributor</span>
                  <span className="font-bold text-slate-800 text-xs font-sans">{selectedIncident.affectedDistributor}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Storage Facility</span>
                  <span className="font-bold text-slate-800 text-xs font-sans">{selectedIncident.affectedStorageFacility}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-teal-400 font-bold">Algorand Incident Provenance Record</span>
                  <span className="text-rose-400 font-bold">State: {selectedIncident.actionState}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Current Incident Tx ID: </span>
                    <span className="text-amber-300 font-bold">{selectedIncident.txHash}</span>
                  </div>
                  <a
                    href={`https://lora.algokit.io/localnet/tx/${selectedIncident.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-bold"
                  >
                    Inspect AVM Box <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* ACTION BUTTONS: QUARANTINED | RELEASED | RECALLED */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Execute Incident Action (Records on Algorand):
                </span>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'QUARANTINED')}
                    variant={selectedIncident.actionState === 'QUARANTINED' ? 'primary' : 'outline'}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
                  >
                    Mark QUARANTINED
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'RECALLED')}
                    variant={selectedIncident.actionState === 'RECALLED' ? 'primary' : 'outline'}
                    size="sm"
                    className="bg-rose-700 hover:bg-rose-800 text-white border-rose-700"
                  >
                    Mark RECALLED
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedIncident.id, 'RELEASED')}
                    variant={selectedIncident.actionState === 'RELEASED' ? 'primary' : 'outline'}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                  >
                    Mark RELEASED
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
