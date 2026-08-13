import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { WalletAddress } from '../components/ui/WalletAddress';
import {
  CheckCircle2,
  FileText,
  Globe,
  AlertCircle,
  ShieldCheck,
  Eye,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Box,
  Layers,
  Building2,
  Cpu,
} from 'lucide-react';

export const RegisterProductPage: React.FC = () => {
  const { setActiveNav, setGlobalSearch } = useNavigation();
  const { account, network } = useAuth();
  const { registerProductOnChain, getProductById } = useProducts();

  // Wizard Step: 1 | 2 | 3 | 4 | 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Product Information
  const [productId, setProductId] = useState('PROD-10000' + Math.floor(6 + Math.random() * 90));
  const [productName, setProductName] = useState('Ethiopian Yirgacheffe Organic Coffee');
  const [category, setCategory] = useState('Organic Food & Agriculture');
  const [description, setDescription] = useState('Certified organic single-origin specialty coffee beans from Sidama Region, Ethiopia');

  // Step 2: Batch Information
  const [batchId, setBatchId] = useState('BATCH-2026-00' + Math.floor(6 + Math.random() * 90));
  const [quantity, setQuantity] = useState('5000 Units');
  const [mfgDate, setMfgDate] = useState('2026-01-15');
  const [expDate, setExpDate] = useState('2028-01-15');

  // Step 3: Metadata Hash
  const [metadataHash, setMetadataHash] = useState('sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

  // Errors & Tx status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [confirmedTxId, setConfirmedTxId] = useState('');
  const [txErrorMsg, setTxErrorMsg] = useState('');

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!productId.trim()) {
      e.productId = 'Product ID is required.';
    } else if (getProductById(productId.trim())) {
      e.productId = `Product ID "${productId.trim()}" already registered.`;
    }
    if (!productName.trim()) e.productName = 'Product name is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!batchId.trim()) e.batchId = 'Batch ID is required.';
    if (!quantity.trim()) e.quantity = 'Quantity is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!metadataHash.trim() || !metadataHash.toLowerCase().startsWith('sha256:')) {
      e.metadataHash = 'Valid SHA-256 hash required with sha256: prefix.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleExecuteRegistration = async () => {
    setIsRegistering(true);
    setTxErrorMsg('');

    setTimeout(async () => {
      const manufacturerAddr = account?.address || 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4';
      const result = await registerProductOnChain(
        productId.trim(),
        batchId.trim(),
        metadataHash.trim(),
        manufacturerAddr
      );

      setIsRegistering(false);
      if (result.success) {
        setConfirmedTxId(result.txId);
        setCurrentStep(5);
      } else {
        setTxErrorMsg(result.error || 'Smart contract registration rejected.');
      }
    }, 1400);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setProductId('PROD-10000' + Math.floor(10 + Math.random() * 80));
    setBatchId('BATCH-2026-00' + Math.floor(10 + Math.random() * 80));
    setConfirmedTxId('');
    setTxErrorMsg('');
    setErrors({});
  };

  const steps = [
    { num: 1, label: 'Product Info', icon: <Box className="w-4 h-4" /> },
    { num: 2, label: 'Batch Info', icon: <Layers className="w-4 h-4" /> },
    { num: 3, label: 'Manufacturer', icon: <Building2 className="w-4 h-4" /> },
    { num: 4, label: 'Blockchain', icon: <Cpu className="w-4 h-4" /> },
    { num: 5, label: 'Confirmation', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Register Product"
        description="Dedicated step-by-step product registration wizard on the Algorand blockchain."
        breadcrumbs={[{ label: 'Register Product' }]}
      />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Step Wizard Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
          {steps.map((s, idx) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;

            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isActive
                        ? 'bg-teal-600 text-white shadow-md ring-4 ring-teal-500/20'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-xs font-bold ${isActive ? 'text-teal-700' : isCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {s.label}
                    </p>
                    <p className="text-[10px] text-slate-400">Step {s.num} of 5</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 min-w-[20px] rounded-full ${currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* STEP 1: PRODUCT INFO */}
        {currentStep === 1 && (
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <Box className="w-5 h-5 text-teal-600" /> Step 1 — Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Product ID"
                placeholder="e.g. PROD-100001"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                error={errors.productId}
                helperText="Unique identifier stored in Algorand Box map"
                required
              />
              <Input
                label="Product Name"
                placeholder="e.g. Ethiopian Yirgacheffe Organic Coffee / Amoxicillin 500mg"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                error={errors.productName}
                required
              />
              <Select
                label="Category & Industry Domain"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'Organic Food & Agriculture', label: '🌾 Organic Agriculture & Produce' },
                  { value: 'Fine Coffee & Spices', label: '☕ Fine Coffee, Tea & Spices' },
                  { value: 'Seafood & Livestock', label: '🥩 Fresh Seafood & Livestock' },
                  { value: 'Luxury Goods & Watches', label: '💎 Luxury Goods, Watches & Jewelry' },
                  { value: 'Electronics & Chips', label: '⚡ Electronics & Semiconductors' },
                  { value: 'Pharmaceuticals', label: '💊 Pharmaceuticals & Biotech' },
                  { value: 'Medical Supplies', label: '🩺 Medical Supplies & Devices' },
                  { value: 'Industrial & Chemical', label: '🏭 Industrial & Chemical Components' },
                ]}
              />
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description & Origin Details</label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe product origin (e.g. Harvest Farm location, Batch origin certificate, Manufacturer facility)..."
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={handleNext}>
                  Next: Batch Information
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: BATCH INFO */}
        {currentStep === 2 && (
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <Layers className="w-5 h-5 text-teal-600" /> Step 2 — Batch Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Batch / Lot ID"
                placeholder="e.g. BATCH-2026-001"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                error={errors.batchId}
                required
              />
              <Input
                label="Quantity / Lot Volume"
                placeholder="e.g. 5000 Units"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={errors.quantity}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Manufacturing Date" type="date" value={mfgDate} onChange={(e) => setMfgDate(e.target.value)} />
                <Input label="Expiry Date" type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} />
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-100">
                <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={handleBack}>
                  Back
                </Button>
                <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={handleNext}>
                  Next: Manufacturer Info
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: MANUFACTURER INFO */}
        {currentStep === 3 && (
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <Building2 className="w-5 h-5 text-teal-600" /> Step 3 — Manufacturer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div>
                  <span className="text-slate-500 block mb-1">Manufacturer Wallet Address:</span>
                  <WalletAddress address={account?.address || 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4'} />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Connected Role:</span>
                  <span className="font-bold text-slate-900">{account?.role || 'MANUFACTURER'}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Target Blockchain Network:</span>
                  <span className="font-bold text-teal-700 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Algorand {network}
                  </span>
                </div>
              </div>

              <Input
                label="Metadata SHA-256 Hash"
                placeholder="sha256:hash..."
                value={metadataHash}
                onChange={(e) => setMetadataHash(e.target.value)}
                error={errors.metadataHash}
                leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
                required
              />

              <div className="flex justify-between pt-3 border-t border-slate-100">
                <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={handleBack}>
                  Back
                </Button>
                <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={handleNext}>
                  Next: Review & Register
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: BLOCKCHAIN REGISTRATION */}
        {currentStep === 4 && (
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <Cpu className="w-5 h-5 text-teal-600" /> Step 4 — Blockchain Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Product ID:</span>
                  <span className="font-mono font-extrabold text-slate-900">{productId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Product Name:</span>
                  <span className="font-bold text-slate-900">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Batch ID:</span>
                  <span className="font-mono font-bold text-slate-900">{batchId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quantity:</span>
                  <span className="font-semibold text-slate-800">{quantity}</span>
                </div>
                <div className="pt-2 border-t border-teal-200">
                  <span className="text-slate-500 block mb-1">Metadata Hash:</span>
                  <p className="font-mono text-[11px] bg-white p-2 rounded border border-teal-200 text-teal-900 break-all">{metadataHash}</p>
                </div>
              </div>

              {txErrorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <p className="font-mono text-xs">{txErrorMsg}</p>
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-slate-100">
                <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  disabled={isRegistering}
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                  onClick={handleExecuteRegistration}
                >
                  {isRegistering ? 'Registering on Blockchain...' : 'Register Product on Blockchain'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 5: CONFIRMATION */}
        {currentStep === 5 && (
          <Card variant="default" className="p-8 text-center space-y-6 border-emerald-200 bg-emerald-50/20">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Product Successfully Registered
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-3">{productId}</h2>
              <p className="text-xs text-slate-500 mt-1">Written to Algorand Box Storage Map</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 text-left space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Product Name:</span>
                <span className="font-bold text-slate-900">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch ID:</span>
                <span className="font-mono font-bold text-slate-800">{batchId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-semibold text-slate-800">{quantity}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block mb-1">Transaction Hash:</span>
                <span className="font-mono text-teal-700 font-bold break-all bg-slate-50 p-2 rounded border border-slate-200 block">
                  {confirmedTxId}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                leftIcon={<Eye className="w-4 h-4" />}
                onClick={() => {
                  setGlobalSearch(productId);
                  setActiveNav('verify-product');
                }}
              >
                View on Blockchain
              </Button>
              <Button variant="secondary" size="md" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={handleReset}>
                Register Another Product
              </Button>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
