import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { WalletAddress } from '../components/ui/WalletAddress';
import { VerifiedCropJourney } from '../components/VerifiedCropJourney';
import type { FarmerRecord, FarmerPriceIntelligenceRecord } from '../types';
import {
  Award,
  CheckCircle,
  MapPin,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Scale,
  PieChart,
  Wheat,
} from 'lucide-react';

// SAMPLE FARMER PRICE INTELLIGENCE DATASET
export const INITIAL_PRICE_HISTORY: FarmerPriceIntelligenceRecord[] = [
  {
    id: 'PRC-REC-001',
    batchId: 'PROD-RICE-0001',
    cropName: 'Basmati Rice',
    quantityKg: 3000,
    farmerAskingPriceInr: 52,
    marketReferencePriceInr: 55,
    buyerOfferPriceInr: 49,
    finalAgreedPriceInr: 51,
    priceDifferenceInr: -1,
    marketDifferenceInr: -4,
    fairPriceScore: 92.7,
    fairPriceRating: 'EXCELLENT',
    date: '2026-08-10',
    buyerName: 'Apex Food Processing Hub',
    txHash: 'TX-ALGO-PRC-9901-4412',
  },
  {
    id: 'PRC-REC-002',
    batchId: 'PROD-SONA-0042',
    cropName: 'Sona Masoori Rice',
    quantityKg: 5000,
    farmerAskingPriceInr: 56,
    marketReferencePriceInr: 58,
    buyerOfferPriceInr: 52,
    finalAgreedPriceInr: 55,
    priceDifferenceInr: -1,
    marketDifferenceInr: -3,
    fairPriceScore: 94.8,
    fairPriceRating: 'EXCELLENT',
    date: '2026-08-02',
    buyerName: 'National Agri Wholesalers',
    txHash: 'TX-ALGO-PRC-7721-0088',
  },
  {
    id: 'PRC-REC-003',
    batchId: 'PROD-CHILLI-108',
    cropName: 'Guntur Red Chilli',
    quantityKg: 1000,
    farmerAskingPriceInr: 175,
    marketReferencePriceInr: 185,
    buyerOfferPriceInr: 160,
    finalAgreedPriceInr: 170,
    priceDifferenceInr: -5,
    marketDifferenceInr: -15,
    fairPriceScore: 91.8,
    fairPriceRating: 'EXCELLENT',
    date: '2026-07-25',
    buyerName: 'Spices Global India',
    txHash: 'TX-ALGO-PRC-4411-9922',
  },
];

// SAMPLE VERIFIED FARMERS WITH DETAILED VALUE SCORE BREAKDOWN
export const INITIAL_FARMERS: FarmerRecord[] = [
  {
    id: 'FARM-001',
    farmerId: 'FRM-2026-001',
    name: 'Ravi Kumar',
    location: 'Guntur, Andhra Pradesh',
    verificationStatus: 'VERIFIED',
    crops: ['Sona Masoori Rice', 'Basmati Rice', 'Chilli'],
    totalBatches: 18,
    successfulDeliveries: 16,
    qualityScore: 94,
    experienceYears: 14,
    trustLevel: 'Tier 1 Accredited Producer',
    blockchainVerified: true,
    walletAddress: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    joinedDate: '2025-03-15',
    valueScoreBreakdown: {
      cropQuality: 25,
      sustainability: 18,
      priceTransparency: 20,
      supplyReliability: 14,
      traceability: 9,
      communityContribution: 8,
      totalScore: 94,
      badgeLabel: 'VERIFIED HIGH-VALUE FARMER',
    },
    availableCrops: [
      {
        id: 'CROP-RICE-500',
        cropName: 'Sona Masoori Rice',
        variety: 'Organic Long Grain',
        quantityAvailableKg: 500,
        pricePerKgInr: 58,
        harvestDate: 'August 2026',
        location: 'Guntur Organic Fields, Sector 4',
        certifications: ['FSSAI-ORGANIC', 'USDA-AGRI-PASSED'],
      },
      {
        id: 'CROP-BASMATI-300',
        cropName: 'Basmati Rice',
        variety: 'Export Grade Premium',
        quantityAvailableKg: 300,
        pricePerKgInr: 82,
        harvestDate: 'August 2026',
        location: 'Guntur Organic Fields, Sector 2',
        certifications: ['FSSAI-EXPORT-CERT'],
      },
    ],
  },
  {
    id: 'FARM-002',
    farmerId: 'FRM-2026-002',
    name: 'Anil Patel',
    location: 'Anand, Gujarat',
    verificationStatus: 'VERIFIED',
    crops: ['Organic Hass Avocados', 'Wheat Grains'],
    totalBatches: 12,
    successfulDeliveries: 12,
    qualityScore: 98,
    experienceYears: 18,
    trustLevel: 'Gold Standard Supplier',
    blockchainVerified: true,
    walletAddress: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    joinedDate: '2025-06-20',
    valueScoreBreakdown: {
      cropQuality: 25,
      sustainability: 19,
      priceTransparency: 20,
      supplyReliability: 15,
      traceability: 10,
      communityContribution: 9,
      totalScore: 98,
      badgeLabel: 'VERIFIED HIGH-VALUE FARMER',
    },
    availableCrops: [
      {
        id: 'CROP-AVO-400',
        cropName: 'Organic Hass Avocados',
        variety: 'Premium Hass Harvest',
        quantityAvailableKg: 400,
        pricePerKgInr: 140,
        harvestDate: 'August 2026',
        location: 'Anand Organic Orchards',
        certifications: ['USDA-ORGANIC'],
      },
    ],
  },
];

export const FarmerRecognitionPage: React.FC = () => {
  const { setActiveNav } = useNavigation();
  const [farmers] = useState<FarmerRecord[]>(INITIAL_FARMERS);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRecord | null>(INITIAL_FARMERS[0]);
  const [priceHistory] = useState<FarmerPriceIntelligenceRecord[]>(INITIAL_PRICE_HISTORY);

  return (
    <PageContainer>
      <PageHeader
        title="Farmer Value & Price Intelligence Hub"
        description="Inspect farmer value scores, fair price evidence analytics, historical crop price intelligence, and 14-stage verified crop provenance."
        breadcrumbs={[{ label: 'Food Producer Workspace' }, { label: 'Farmer Value & Recognition' }]}
        actions={
          <Button
            onClick={() => setActiveNav('available-crops')}
            variant="outline"
            size="sm"
            leftIcon={<Wheat className="w-4 h-4 text-emerald-600" />}
          >
            Browse Available Crops
          </Button>
        }
      />

      {/* 1. FARMER VALUE & RECOGNITION CARDS */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Farmer Value & Recognition Metrics
          </h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Measurable Value + Blockchain Accreditation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {farmers.map((farmer) => {
            const isSelected = selectedFarmer?.id === farmer.id;
            const score = farmer.valueScoreBreakdown;

            return (
              <Card
                key={farmer.id}
                variant="default"
                className={`transition-all duration-200 border-2 ${
                  isSelected ? 'border-teal-500 bg-teal-50/10 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-bold text-slate-900">{farmer.name}</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          {score?.badgeLabel || 'VERIFIED HIGH-VALUE FARMER'}
                        </span>
                      </div>
                      <p className="text-xs font-mono font-bold text-teal-700">Farmer ID: {farmer.farmerId}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {farmer.location} • {farmer.experienceYears} Years Experience
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="p-3 bg-amber-50 text-amber-900 rounded-2xl border border-amber-200 text-center">
                        <span className="text-[10px] text-amber-700 font-bold uppercase block">Farmer Value Score</span>
                        <span className="text-2xl font-bold text-amber-600">{score?.totalScore || farmer.qualityScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* SCORE BREAKDOWN METRICS GRID REQUIRED BY USER SPECIFICATION */}
                  {score && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <PieChart className="w-3.5 h-3.5 text-teal-600" />
                        Measurable Value Breakdown
                      </h5>
                      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[9px] text-slate-400 block uppercase">Crop Quality</span>
                          <span className="font-bold text-emerald-700">{score.cropQuality}/25</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[9px] text-slate-400 block uppercase">Sustainability</span>
                          <span className="font-bold text-teal-700">{score.sustainability}/20</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[9px] text-slate-400 block uppercase">Price Transparency</span>
                          <span className="font-bold text-indigo-700">{score.priceTransparency}/20</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[9px] text-slate-400 block uppercase">Supply Reliability</span>
                          <span className="font-bold text-slate-800">{score.supplyReliability}/15</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[9px] text-slate-400 block uppercase">Traceability</span>
                          <span className="font-bold text-sky-700">{score.traceability}/10</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[9px] text-slate-400 block uppercase">Community</span>
                          <span className="font-bold text-amber-700">{score.communityContribution}/10</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <WalletAddress address={farmer.walletAddress} showLink={true} />
                    <Button
                      onClick={() => setSelectedFarmer(farmer)}
                      variant={isSelected ? 'primary' : 'outline'}
                      size="sm"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Inspect Profile & Crops
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 2. FARMER PRICE INTELLIGENCE & FAIR PRICE SCORE CARD */}
      <div className="space-y-6 mb-10">
        <Card variant="default" className="border-teal-300 shadow-sm bg-gradient-to-br from-teal-50/40 via-white to-sky-50/30">
          <CardHeader className="flex items-center justify-between border-b border-teal-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
              <Scale className="w-5 h-5 text-teal-600" />
              Farmer Price Intelligence & Fair Price Score Analysis
            </CardTitle>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold font-mono rounded-lg border border-emerald-300">
              Formula: (Final Price / Ref Price) × 100
            </span>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* PRICE CARD EXAMPLE REQUIRED BY USER */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 font-sans">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Basmati Rice (Batch: PROD-RICE-0001)</h4>
                  <p className="text-xs text-slate-500">Procured Quantity: 3,000 kg • Producer: Ravi Kumar</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                    FAIR PRICE SCORE: 92.7% (EXCELLENT)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Farmer Asking Price</span>
                  <span className="font-bold text-slate-900 text-sm">₹52.00 / kg</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Market Reference Price</span>
                  <span className="font-bold text-slate-900 text-sm">₹55.00 / kg</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Buyer Offer Price</span>
                  <span className="font-bold text-amber-700 text-sm">₹49.00 / kg</span>
                </div>
                <div className="p-3 bg-teal-900 text-white rounded-xl space-y-0.5">
                  <span className="text-[10px] text-teal-300 font-bold uppercase block">Final Agreed Price</span>
                  <span className="font-bold text-base text-teal-300">₹51.00 / kg</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 flex justify-between items-center">
                  <span className="text-slate-600 font-sans text-xs">Price Difference (Final - Asking):</span>
                  <span className="font-bold text-indigo-700">-₹1.00 / kg</span>
                </div>
                <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200 flex justify-between items-center">
                  <span className="text-slate-600 font-sans text-xs">Market Difference (Final - Ref):</span>
                  <span className="font-bold text-sky-700">-₹4.00 / kg</span>
                </div>
              </div>

              {/* PRICE SCORE RATING RANGES DISPLAY */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-[11px] font-sans">
                <span className="font-bold text-teal-300 uppercase tracking-wider block">Fair Price Score Compliance Rules:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  <div className="p-2 bg-emerald-950 border border-emerald-500/40 rounded text-emerald-300">
                    <strong>92 – 100%:</strong> EXCELLENT
                  </div>
                  <div className="p-2 bg-teal-950 border border-teal-500/40 rounded text-teal-300">
                    <strong>80 – 91%:</strong> FAIR
                  </div>
                  <div className="p-2 bg-amber-950 border border-amber-500/40 rounded text-amber-300">
                    <strong>60 – 79%:</strong> BELOW MARKET
                  </div>
                  <div className="p-2 bg-rose-950 border border-rose-500/40 rounded text-rose-300">
                    <strong>&lt; 60%:</strong> PRICE ALERT
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. FARMER PRICE HISTORY TABLE */}
      <div className="space-y-4 mb-10">
        <Card variant="default">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Farmer Price Intelligence History Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Crop & Batch ID</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Asking Price</th>
                    <th className="py-3 px-4">Market Ref</th>
                    <th className="py-3 px-4">Buyer Offer</th>
                    <th className="py-3 px-4">Final Price</th>
                    <th className="py-3 px-4">Fair Price Score</th>
                    <th className="py-3 px-4 text-right">Blockchain Tx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {priceHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-sans text-slate-600">{item.date}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 font-sans block">{item.cropName}</span>
                        <span className="text-[10px] text-teal-700 font-mono">{item.batchId}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{item.quantityKg.toLocaleString()} kg</td>
                      <td className="py-3 px-4 text-slate-700">₹{item.farmerAskingPriceInr}/kg</td>
                      <td className="py-3 px-4 text-slate-700">₹{item.marketReferencePriceInr}/kg</td>
                      <td className="py-3 px-4 text-amber-700">₹{item.buyerOfferPriceInr}/kg</td>
                      <td className="py-3 px-4 font-bold text-teal-700 text-sm">₹{item.finalAgreedPriceInr}/kg</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {item.fairPriceScore}% ({item.fairPriceRating})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`https://lora.algokit.io/localnet/tx/${item.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-600 hover:text-teal-700 font-bold flex items-center justify-end gap-1"
                        >
                          {item.txHash.substring(0, 14)}... <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. VERIFIED CROP JOURNEY (14 STAGES) */}
      <div className="space-y-4 mb-10">
        <VerifiedCropJourney batchId="PROD-RICE-0001" />
      </div>
    </PageContainer>
  );
};
