import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import type { CropJourneyStage } from '../types';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const DEFAULT_CROP_JOURNEY_STAGES: CropJourneyStage[] = [
  {
    stageNumber: 1,
    stageTitle: 'Farmer Harvesting & Registration',
    status: 'COMPLETED',
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Ravi Kumar (FRM-2026-001)',
    location: 'Guntur Organic Fields, Sector 4',
    txHash: 'TX-ALGO-FRM-8801-7712',
    details: 'Harvested 3,000kg Organic Basmati Rice. Organic soil certification verified.',
  },
  {
    stageNumber: 2,
    stageTitle: 'Crop Registered On-Chain',
    status: 'COMPLETED',
    timestamp: Date.now() - 1000 * 60 * 60 * 68,
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Ravi Kumar (FRM-2026-001)',
    location: 'Guntur Ag-Hub',
    txHash: 'TX-ALGO-REG-9902-1142',
    details: 'Immutable batch record generated on Algorand LocalNet ARC-4 Box Storage.',
  },
  {
    stageNumber: 3,
    stageTitle: 'Quality & Moisture Verified',
    status: 'COMPLETED',
    timestamp: Date.now() - 1000 * 60 * 60 * 60,
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'AgriQuality Inspector (INSP-04)',
    location: 'Guntur Testing Lab B',
    txHash: 'TX-ALGO-QUAL-3341-8890',
    details: 'Moisture content: 11.8% (Passed). Purity index: 99.2%. Grade A certified.',
  },
  {
    stageNumber: 4,
    stageTitle: 'Farmer Asking Price Recorded',
    status: 'COMPLETED',
    timestamp: Date.now() - 1000 * 60 * 60 * 54,
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Ravi Kumar (Farmer)',
    location: 'Guntur Price Portal',
    txHash: 'TX-ALGO-PRC-5512-0041',
    details: 'Farmer asking price set at ₹52.00/kg based on input cost & labor audit.',
  },
  {
    stageNumber: 5,
    stageTitle: 'Fair Price Intelligence Analysis',
    status: 'COMPLETED',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'BlocTrace Algorand Oracle',
    location: 'Market Reference Index Engine',
    txHash: 'TX-ALGO-FAIR-9901-2244',
    details: 'Market Ref: ₹55.00/kg. Final Agreed: ₹51.00/kg. Fair Price Score: 92.7% (EXCELLENT).',
  },
  {
    stageNumber: 6,
    stageTitle: 'Purchase Agreement & x402 Settlement',
    status: 'COMPLETED',
    timestamp: Date.now() - 1000 * 60 * 60 * 42,
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Apex Food Producers Ltd',
    location: 'x402 Micropayment Engine',
    txHash: 'TX-ALGO-X402-7711-4409',
    details: 'Instant settlement of ₹1,53,000 ($1,838.94 USDC) transferred directly to farmer wallet.',
  },
  {
    stageNumber: 7,
    stageTitle: 'Food Producer Receipt & Storage',
    status: 'COMPLETED',
    timestamp: Date.now() - 1000 * 60 * 60 * 36,
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Apex Food Processing Hub 1',
    location: 'Guntur Agriculture Processing Facility',
    txHash: 'TX-ALGO-REC-1102-3399',
    details: 'Raw crop received into clean storage silos. Batch ID locked.',
  },
  {
    stageNumber: 8,
    stageTitle: 'Crop Milling & Primary Processing',
    status: 'COMPLETED',
    timestamp: Date.now() - 1000 * 60 * 60 * 30,
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Milling Plant Operator',
    location: 'Guntur Unit 2',
    txHash: 'TX-ALGO-PROC-4491-0021',
    details: 'De-husked, polished, and moisture stabilized at 12.0%.',
  },
  {
    stageNumber: 9,
    stageTitle: 'Product Packaging & Manufacturing',
    status: 'COMPLETED',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Manufacturer Control Center',
    location: 'Guntur Manufacturing Plant',
    txHash: 'TX-ALGO-MFG-8822-1144',
    details: 'Packaged into 5kg consumer vacuum pouches with QR verification codes.',
  },
  {
    stageNumber: 10,
    stageTitle: 'GPS Monitored Transport Dispatch',
    status: 'IN_PROGRESS',
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Express Logistics Heavy Truck FLT-9901',
    location: '16.507310° N, 80.649187° E (En Route)',
    txHash: 'TX-ALGO-GPS-7714-8833',
    details: '5-second cellular IoT telemetry active. Speed: 64 km/h.',
  },
  {
    stageNumber: 11,
    stageTitle: 'Warehouse Facility Check-In',
    status: 'PENDING',
    timestamp: Date.now(),
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Central Warehouse Logistics Hub A',
    location: 'Zone W1, Rack 04, Shelf B, Bin 12',
    details: 'Awaiting truck arrival for high-density bin indexing.',
  },
  {
    stageNumber: 12,
    stageTitle: 'Cold Storage Thermal Verification',
    status: 'PENDING',
    timestamp: Date.now(),
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Cold Storage CS01 Sensor TEMP-IOT-0042',
    location: 'Cold Storage Zone 02, Rack 07, Shelf 03, Bin C12',
    details: 'Target temperature threshold: 2.0°C to 8.0°C.',
  },
  {
    stageNumber: 13,
    stageTitle: 'AVM Smart Contract Provenance Proof',
    status: 'PENDING',
    timestamp: Date.now(),
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Algorand LocalNet AVM State Engine',
    details: 'Cryptographic proof hash generation for batch authenticity.',
  },
  {
    stageNumber: 14,
    stageTitle: 'Consumer QR Verification Code Live',
    status: 'PENDING',
    timestamp: Date.now(),
    batchId: 'PROD-RICE-0001',
    responsibleParticipant: 'Retailer & Consumer Mobile Scanner',
    details: 'Scan QR code on packaging to inspect full end-to-end provenance.',
  },
];

interface VerifiedCropJourneyProps {
  stages?: CropJourneyStage[];
  batchId?: string;
  className?: string;
}

export const VerifiedCropJourney: React.FC<VerifiedCropJourneyProps> = ({
  stages = DEFAULT_CROP_JOURNEY_STAGES,
  batchId = 'PROD-RICE-0001',
  className = '',
}) => {
  const [selectedStage, setSelectedStage] = useState<CropJourneyStage>(stages[4]); // Default to Fair Price stage

  const completedCount = stages.filter((s) => s.status === 'COMPLETED').length;
  const progressPercent = Math.round((completedCount / stages.length) * 100);

  return (
    <Card variant="default" className={`border-teal-200 shadow-sm ${className}`}>
      <CardHeader className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-t-xl pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              Verified Crop Journey: End-to-End Provenance
            </CardTitle>
            <p className="text-xs text-teal-200/80 mt-1 font-mono">
              Batch: <strong className="text-white">{batchId}</strong> • 14 Lifecycle Provenance Checkpoints
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <span className="text-[10px] text-teal-300 uppercase block font-bold">Journey Completion</span>
              <span className="text-sm font-bold text-amber-300">{progressPercent}% Completed ({completedCount}/14)</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center font-bold text-xs">
              {progressPercent}%
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* TIMELINE PROGRESS BAR */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono font-bold">
            <span className="text-slate-600">Farmer Harvest</span>
            <span className="text-teal-700">Fair Price & Quality</span>
            <span className="text-sky-700">Processing & Transport</span>
            <span className="text-indigo-700">Warehouse & Cold Storage</span>
            <span className="text-emerald-700">Consumer QR</span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 14 STAGE HORIZONTAL / GRID STAGE CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {stages.map((stage) => {
            const isSelected = selectedStage.stageNumber === stage.stageNumber;
            const isDone = stage.status === 'COMPLETED';
            const isInProgress = stage.status === 'IN_PROGRESS';

            return (
              <button
                key={stage.stageNumber}
                type="button"
                onClick={() => setSelectedStage(stage)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500/30 shadow-xs'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300'
                    : isInProgress
                    ? 'border-amber-300 bg-amber-50/60 animate-pulse'
                    : 'border-slate-200 bg-white opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500">#{stage.stageNumber}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : isInProgress ? (
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>

                <p className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-tight">
                  {stage.stageTitle}
                </p>

                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded w-fit ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : isInProgress
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {stage.status}
                </span>
              </button>
            );
          })}
        </div>

        {/* SELECTED STAGE DETAILED INSPECTOR CARD */}
        {selectedStage && (
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4 font-mono text-xs shadow-md border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-teal-500/20 text-teal-300 font-bold text-xs rounded border border-teal-500/30">
                  STAGE #{selectedStage.stageNumber} OF 14
                </span>
                <h4 className="text-sm font-bold text-white font-sans">{selectedStage.stageTitle}</h4>
              </div>
              <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {new Date(selectedStage.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Responsible Participant</span>
                <span className="font-bold text-teal-300">{selectedStage.responsibleParticipant}</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Location / GPS</span>
                <span className="font-bold text-slate-200">{selectedStage.location || 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Algorand Transaction ID</span>
                {selectedStage.txHash ? (
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    {selectedStage.txHash} <ExternalLink className="w-3 h-3 text-amber-400" />
                  </span>
                ) : (
                  <span className="text-slate-500 italic">Pending Stage Execution</span>
                )}
              </div>
            </div>

            {selectedStage.details && (
              <div className="p-3 bg-teal-950/60 border border-teal-500/30 rounded-xl text-teal-200 font-sans text-xs">
                <strong>Provenance Details:</strong> {selectedStage.details}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
