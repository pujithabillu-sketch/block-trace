import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { CategoryProductSelector } from '../components/ui/CategoryProductSelector';
import { StatusBadge } from '../components/ui/StatusBadge';
import { WalletAddress } from '../components/ui/WalletAddress';
import { GpsLocationTracker } from '../components/ui/GpsLocationTracker';
import { WorkspaceProofCard } from '../components/ui/WorkspaceProofCard';
import { Button } from '../components/ui/Button';
import {
  Truck,
  Warehouse,
  Store,
  UserCheck,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Wheat,
} from 'lucide-react';
import type { UserRole, ProductStatus } from '../types';

interface StageConfig {
  role: UserRole;
  title: string;
  defaultName: string;
  icon: React.ReactNode;
  address: string;
  colorClass: string;
  gpsLocation: { lat: number; lng: number; locationName: string };
}

const STAGE_CONFIGS: StageConfig[] = [
  {
    role: 'MANUFACTURER',
    title: 'Farmer / Origin',
    defaultName: 'Green Valley Organic Orchards',
    icon: <Wheat className="w-5 h-5 text-emerald-600" />,
    address: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    colorClass: 'border-emerald-300 bg-emerald-50/50',
    gpsLocation: { lat: 16.5062, lng: 80.648, locationName: 'Andhra Agro Harvest Sector 4' },
  },
  {
    role: 'DISTRIBUTOR',
    title: 'Freight Distributor',
    defaultName: 'Global Logistics Express',
    icon: <Truck className="w-5 h-5 text-sky-600" />,
    address: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    colorClass: 'border-sky-300 bg-sky-50/50',
    gpsLocation: { lat: 16.785, lng: 80.8492, locationName: 'NH-16 Transit Fleet Corridor' },
  },
  {
    role: 'WAREHOUSE',
    title: 'Cold Hub Warehouse',
    defaultName: 'Central Regional Storage Hub A',
    icon: <Warehouse className="w-5 h-5 text-purple-600" />,
    address: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    colorClass: 'border-purple-300 bg-purple-50/50',
    gpsLocation: { lat: 17.385, lng: 78.4867, locationName: 'Central Logistics Vault B' },
  },
  {
    role: 'RETAILER',
    title: 'Retail Storefront',
    defaultName: 'MediCare & Bio Organics Store',
    icon: <Store className="w-5 h-5 text-rose-600" />,
    address: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    colorClass: 'border-rose-300 bg-rose-50/50',
    gpsLocation: { lat: 13.0827, lng: 80.2707, locationName: 'Metro Storefront Rack 12' },
  },
  {
    role: 'CONSUMER',
    title: 'Customer Purchase',
    defaultName: 'Verified Consumer Checkout',
    icon: <UserCheck className="w-5 h-5 text-amber-600" />,
    address: 'CST3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9',
    colorClass: 'border-amber-300 bg-amber-50/50',
    gpsLocation: { lat: 13.0418, lng: 80.2341, locationName: 'Consumer Delivery Location' },
  },
];

export const SupplyChainPage: React.FC = () => {
  const { selectedProductId, setSelectedProductId } = useNavigation();
  const { products, getProductById, getProductHistory, updateStatus } = useProducts();

  const [activeProductId, setActiveProductId] = useState<string>(selectedProductId || 'PROD-100001');
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);

  const product = getProductById(activeProductId) || products[0];
  const history = getProductHistory(activeProductId);

  // Map product status to current active stage index (0 to 4)
  const getActiveStageIndex = (status: ProductStatus): number => {
    switch (status) {
      case 'REGISTERED':
      case 'MANUFACTURED':
        return 0;
      case 'IN_TRANSIT':
      case 'AT_DISTRIBUTOR':
        return 1;
      case 'AT_WAREHOUSE':
        return 2;
      case 'AT_RETAILER':
        return 3;
      case 'SOLD':
        return 4;
      default:
        return 1;
    }
  };

  const currentActiveIndex = getActiveStageIndex(product.currentStatus);

  // Handle stage advancement simulation
  const handleAdvanceStage = () => {
    const stageOrder: ProductStatus[] = [
      'REGISTERED',
      'AT_DISTRIBUTOR',
      'AT_WAREHOUSE',
      'AT_RETAILER',
      'SOLD',
    ];
    const nextIndex = Math.min(currentActiveIndex + 1, stageOrder.length - 1);
    const nextStatus = stageOrder[nextIndex];
    updateStatus(product.productId, nextStatus);
    setSelectedStageIndex(nextIndex);
  };

  // Map history events to stage details
  const getStageInfo = (role: UserRole, index: number) => {
    const isPassed = index <= currentActiveIndex;
    const isCurrent = index === currentActiveIndex;

    const matchingEvent = history.find((evt) => {
      if (role === 'MANUFACTURER' && (evt.eventType.includes('REGISTER') || evt.status === 'REGISTERED')) return true;
      if (role === 'DISTRIBUTOR' && (evt.status === 'AT_DISTRIBUTOR' || evt.eventType.includes('DISTRIBUTOR') || evt.status === 'IN_TRANSIT')) return true;
      if (role === 'WAREHOUSE' && (evt.status === 'AT_WAREHOUSE' || evt.eventType.includes('WAREHOUSE'))) return true;
      if (role === 'RETAILER' && (evt.status === 'AT_RETAILER' || evt.eventType.includes('RETAILER'))) return true;
      if (role === 'CONSUMER' && (evt.status === 'SOLD' || evt.eventType.includes('SOLD'))) return true;
      return false;
    });

    let status: ProductStatus = 'REGISTERED';
    if (index === 0) status = 'REGISTERED';
    else if (index === 1) status = 'AT_DISTRIBUTOR';
    else if (index === 2) status = 'AT_WAREHOUSE';
    else if (index === 3) status = 'AT_RETAILER';
    else if (index === 4) status = 'SOLD';

    const timestamp = matchingEvent
      ? new Date(matchingEvent.timestamp).toLocaleString()
      : isPassed
      ? new Date(product.creationTimestamp + index * 1000 * 60 * 60 * 8).toLocaleString()
      : `Estimated: ${new Date(product.creationTimestamp + (index + 1) * 1000 * 60 * 60 * 24).toLocaleDateString()}`;

    const eventType = matchingEvent
      ? matchingEvent.eventType
      : isCurrent
      ? 'CURRENT_CUSTODY'
      : isPassed
      ? 'STAGE_VERIFIED'
      : 'EXPECTED_HANDOFF';

    const txId = matchingEvent?.txId || `TX${activeProductId.replace(/[^0-9]/g, '')}0${index + 1}8K9L`;

    return {
      status,
      isPassed,
      isCurrent,
      timestamp,
      eventType,
      txId,
    };
  };

  const selectedStageConfig = STAGE_CONFIGS[selectedStageIndex] || STAGE_CONFIGS[0];

  return (
    <PageContainer>
      <PageHeader
        title="Supply Chain Multi-Hop Timeline & Live GPS"
        description="Visual audit trail of custody progression across all 5 supply-chain stages with real-time GPS telemetry."
        breadcrumbs={[{ label: 'Supply Chain' }]}
        actions={
          <CategoryProductSelector
            selectedProductId={activeProductId}
            onSelectProduct={(id) => {
              setActiveProductId(id);
              setSelectedProductId(id);
              const p = getProductById(id);
              if (p) setSelectedStageIndex(getActiveStageIndex(p.currentStatus));
            }}
            showLabels={false}
          />
        }
      />

      {/* ADVANCE CUSTODY BAR */}
      <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-700 font-bold shrink-0">
            <Sparkles className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Interactive 5-Stage Custody Simulation</h3>
            <p className="text-xs text-slate-600 font-medium">
              Current Active Stage: <strong className="text-teal-700 font-mono">{STAGE_CONFIGS[currentActiveIndex].title}</strong> (Stage {currentActiveIndex + 1} of 5)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentActiveIndex < 4 ? (
            <Button
              onClick={handleAdvanceStage}
              variant="primary"
              size="md"
              leftIcon={<ArrowRight className="w-4 h-4" />}
            >
              Advance Custody ({STAGE_CONFIGS[currentActiveIndex].title} → {STAGE_CONFIGS[currentActiveIndex + 1].title})
            </Button>
          ) : (
            <span className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Product Journey Fully Completed (Stage 5 Sold)
            </span>
          )}
        </div>
      </div>

      {/* 5-STAGE TIMELINE CARDS (ALL 5 STAGES ACTIVE & CLICKABLE) */}
      <Card variant="default" className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-slate-900 font-bold">Traceability Journey: {product.name || product.productId}</CardTitle>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Product ID: <span className="font-mono font-bold text-slate-900">{product.productId}</span> | Batch: <span className="font-mono font-bold text-slate-900">{product.batchId}</span> | Category: {product.category || 'Food & Perishables'}
              </p>
            </div>
            <StatusBadge status={product.currentStatus} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {STAGE_CONFIGS.map((stage, idx) => {
              const info = getStageInfo(stage.role, idx);
              const isSelected = selectedStageIndex === idx;

              return (
                <div
                  key={stage.role}
                  onClick={() => setSelectedStageIndex(idx)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between hover-lift ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/90 shadow-md ring-2 ring-teal-400/30'
                      : info.isCurrent
                      ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                      : info.isPassed
                      ? `${stage.colorClass} border-slate-300`
                      : 'border-slate-200 bg-slate-50 text-slate-700 opacity-90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center ${
                          info.isCurrent || isSelected
                            ? 'bg-teal-700 text-white shadow-xs'
                            : info.isPassed
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <StatusBadge status={info.status} showIcon={false} />
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      {stage.icon}
                      <h4 className="text-xs font-bold text-slate-900">{stage.title}</h4>
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 truncate">{stage.defaultName}</p>

                    <div className="mt-3 pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                        Wallet Address
                      </span>
                      <WalletAddress address={stage.address} />
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-mono space-y-1">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-bold text-slate-900">{info.eventType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tx Hash:</span>
                      <span className="font-bold text-teal-700 flex items-center gap-0.5">
                        {info.txId.substring(0, 8)}... <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-teal-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified On-Chain State: Algorand Box Storage Contract APP-1048201</span>
            </div>
            <span className="text-slate-300">Viewing Stage {selectedStageIndex + 1}: <strong className="text-white">{selectedStageConfig.title}</strong></span>
          </div>
        </CardContent>
      </Card>

      {/* LIVE GPS LOCATION TELEMETRY & PROOF OF AUTHENTICATION CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GpsLocationTracker
          product={{
            ...product,
            gpsCoordinates: {
              ...selectedStageConfig.gpsLocation,
              speedKmH: selectedStageIndex === 1 ? 72 : 0,
              heading: selectedStageIndex === 1 ? 'E-NE 65°' : 'STATIONARY',
            },
          }}
        />
        <WorkspaceProofCard
          role={selectedStageConfig.role}
          title={`Stage ${selectedStageIndex + 1} (${selectedStageConfig.title}) Cryptographic Proof`}
          address={selectedStageConfig.address}
        />
      </div>
    </PageContainer>
  );
};
