import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useProducts } from '../../context/ProductContext';
import { PageContainer } from '../layout/PageContainer';
import { PageHeader } from '../ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { GpsLocationTracker } from '../ui/GpsLocationTracker';
import { WorkspaceProofCard } from '../ui/WorkspaceProofCard';
import { VerifiedCropJourney } from '../VerifiedCropJourney';
import { ProductRecallIntelligence } from '../ProductRecallIntelligence';
import {
  Utensils,
  PlusCircle,
  Activity,
  Award,
  Wheat,
  Users,
  Zap,
  FileCheck,
  ShoppingBag,
  Clock,
  Scale,
  Thermometer,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const FoodProducerDashboard: React.FC = () => {
  const { setActiveNav, navigateToProductDetails } = useNavigation();
  const { products, historyEvents } = useProducts();
  const [showJourney, setShowJourney] = useState<boolean>(true);
  const [showRecallConsole, setShowRecallConsole] = useState<boolean>(false);

  const featuredRice = products.find((p) => p.productId === 'PROD-RICE-0001') || products[0];

  return (
    <PageContainer>
      <PageHeader
        title="Food Producer Agriculture & Procurement Hub"
        description="Manage accredited farmer value scores, inspect fair price evidence analytics, monitor farm-to-fork batch processing, and verify Algorand LocalNet provenance records."
        breadcrumbs={[{ label: 'Food Producer Workspace' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveNav('farmer-recognition')}
              variant="primary"
              size="md"
              leftIcon={<Award className="w-4 h-4 text-amber-300" />}
            >
              Farmer Value & Recognition
            </Button>
            <Button
              onClick={() => setActiveNav('register-product')}
              variant="outline"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Register Food Batch
            </Button>
          </div>
        }
      />

      {/* 1. KEY VALUE & PRICE INTELLIGENCE HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* FARMER VALUE SCORE CARD */}
        <Card onClick={() => setActiveNav('farmer-recognition')} className="cursor-pointer border-amber-300 bg-gradient-to-br from-amber-50 to-white hover:border-amber-400 transition-all">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Farmer Value Score</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-amber-900">94 / 100</h3>
              <span className="text-xs font-bold text-emerald-700">VERIFIED</span>
            </div>
            <p className="text-[11px] font-bold text-amber-800">Accredited: Ravi Kumar (FRM-2026-001)</p>
          </CardContent>
        </Card>

        {/* FAIR PRICE SCORE CARD */}
        <Card onClick={() => setActiveNav('farmer-recognition')} className="cursor-pointer border-teal-300 bg-gradient-to-br from-teal-50 to-white hover:border-teal-400 transition-all">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">Fair Price Score</span>
              <Scale className="w-5 h-5 text-teal-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-teal-900">92.7%</h3>
              <span className="text-xs font-bold text-emerald-700">EXCELLENT</span>
            </div>
            <p className="text-[11px] font-bold text-teal-800">Final Agreed: ₹51/kg (Ref: ₹55/kg)</p>
          </CardContent>
        </Card>

        {/* GPS & TELEMETRY STATUS */}
        <Card className="border-sky-300 bg-gradient-to-br from-sky-50 to-white">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">Live GPS Telemetry</span>
              <MapPin className="w-5 h-5 text-sky-600 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-bold text-sky-900">16.5073° N, 80.6491° E</h3>
            </div>
            <p className="text-[11px] font-bold text-sky-700">Vehicle FLT-9901 • 64 km/h (5s Polling)</p>
          </CardContent>
        </Card>

        {/* COLD CHAIN & THERMAL STATUS */}
        <Card className="border-indigo-300 bg-gradient-to-br from-indigo-50 to-white">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Thermal Monitoring</span>
              <Thermometer className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-indigo-900">-1.1°C</h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">SAFE</span>
            </div>
            <p className="text-[11px] font-bold text-indigo-700">Sensor TEMP-IOT-8812 (Range 2-8°C)</p>
          </CardContent>
        </Card>
      </div>

      {/* 8 DEDICATED AGRICULTURE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card onClick={() => setActiveNav('farmer-recognition')} className="cursor-pointer border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 to-white hover:border-emerald-400 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Registered Farmers</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">2 Verified</h3>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">Guntur & Anand Co-ops</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card onClick={() => setActiveNav('farmer-recognition')} className="cursor-pointer border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-white hover:border-amber-400 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Available Crops</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">5 Listings</h3>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">1,900 kg Total Yield</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Wheat className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-200/80 bg-gradient-to-br from-indigo-50/60 to-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">Pending Purchase Requests</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">1 Request</h3>
              <p className="text-[11px] text-indigo-600 font-semibold mt-1">Basmati Rice (300kg)</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200/80 bg-gradient-to-br from-teal-50/60 to-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Purchased Crops</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">3 Batches</h3>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">Sona Masoori Rice 500kg</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Processing Batches</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">2 Batches</h3>
              <p className="text-[11px] text-slate-600 font-semibold mt-1">Milling & Packaging</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Payments</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">1 Pending</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">Awaiting Authorization</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-300 bg-gradient-to-br from-teal-50 to-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-teal-900 uppercase tracking-wider">Completed x402 Payments</p>
              <h3 className="text-2xl font-bold text-teal-700 mt-1">₹29,000</h3>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">348.50 USDC On-Chain</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Blockchain Transactions</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{historyEvents.length + 8} Verified</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Algorand LocalNet ARC-4</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VERIFIED CROP JOURNEY EXPANDABLE SECTION */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setShowJourney(!showJourney)}
            variant="outline"
            size="sm"
            className="border-teal-300 text-teal-900 font-bold"
            rightIcon={showJourney ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          >
            {showJourney ? 'Hide 14-Stage Verified Crop Journey' : 'Inspect 14-Stage Verified Crop Journey'}
          </Button>

          <Button
            onClick={() => setShowRecallConsole(!showRecallConsole)}
            variant="outline"
            size="sm"
            className="border-rose-300 text-rose-900 font-bold"
          >
            {showRecallConsole ? 'Hide Product Recall Console' : 'Product Recall Intelligence'}
          </Button>
        </div>

        {showJourney && <VerifiedCropJourney batchId="PROD-RICE-0001" />}
        {showRecallConsole && <ProductRecallIntelligence />}
      </div>

      {/* FEATURED RICE SUPPLY CHAIN SAMPLE RECORD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card variant="default">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-emerald-600" />
                Featured Rice Supply-Chain Record (Demonstration Dataset)
              </CardTitle>
              <StatusBadge status={featuredRice.currentStatus} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onClick={() => navigateToProductDetails(featuredRice.productId)}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-700">{featuredRice.productId}</span>
                  <span className="text-xs text-slate-500">Batch: <strong className="font-mono">{featuredRice.batchId}</strong></span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">{featuredRice.name}</h4>
                <p className="text-xs text-slate-600">{featuredRice.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Farmer Source</span>
                    <span className="font-bold text-slate-800">{featuredRice.farmerName || 'Ravi Kumar'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Origin</span>
                    <span className="font-bold text-slate-800">{featuredRice.origin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Quality Cert</span>
                    <span className="font-bold text-emerald-700">{featuredRice.qualityCert}</span>
                  </div>
                </div>
              </div>

              {/* FARM TO FORK 5 STAGE JOURNEY SUMMARY */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
                <span className="text-xs font-bold text-emerald-900 block uppercase tracking-wider">
                  🌾 Verified 5-Stage Custody Flow:
                </span>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 overflow-x-auto pb-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold shrink-0">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                    Farmer (Ravi Kumar)
                  </div>
                  <span className="text-slate-400">→</span>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold shrink-0">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                    Food Producer
                  </div>
                  <span className="text-slate-400">→</span>
                  <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[10px]">3</span>
                    Distributor
                  </div>
                  <span className="text-slate-400">→</span>
                  <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[10px]">4</span>
                    Retailer
                  </div>
                  <span className="text-slate-400">→</span>
                  <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[10px]">5</span>
                    Customer
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* WORKSPACE PROOF & TELEMETRY */}
        <div className="space-y-6">
          <WorkspaceProofCard role="FOOD_PRODUCER" />
          <GpsLocationTracker product={featuredRice} />
        </div>
      </div>
    </PageContainer>
  );
};
