import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { CategoryProductSelector } from '../components/ui/CategoryProductSelector';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/StatusBadge';
import { WalletAddress } from '../components/ui/WalletAddress';
import {
  ArrowLeftRight,
  CheckCircle2,
  Send,
  AlertTriangle,
  FileText,
  Globe,
  AlertCircle,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import type { UserRole } from '../types';

export const TransfersPage: React.FC = () => {
  const { setActiveNav, selectedProductId } = useNavigation();
  const { account, network } = useAuth();
  const { products, transferProductOnChain, getProductById } = useProducts();

  // Step state: 1 (Form) | 2 (Review) | 3 (Waiting) | 4 (Success)
  const [step, setStep] = useState<number>(1);

  // Transfer Fields
  const [productId, setProductId] = useState(selectedProductId || products[0]?.productId || 'PROD-100001');
  const [recipientAddress, setRecipientAddress] = useState('DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8');
  const [recipientRole, setRecipientRole] = useState<UserRole>('DISTRIBUTOR');
  const [quantity, setQuantity] = useState('100 Units');
  const [transferMetadataHash, setTransferMetadataHash] = useState('sha256:manifest-hash-884930219482');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedTxId, setConfirmedTxId] = useState('');
  const [txErrorMsg, setTxErrorMsg] = useState('');

  const selectedProductRecord = getProductById(productId) || products[0];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!productId.trim()) {
      e.productId = 'Select a valid product to transfer.';
    } else if (!selectedProductRecord) {
      e.productId = `Product "${productId}" not found.`;
    } else if (selectedProductRecord.recalled) {
      e.productId = 'Cannot transfer RECALLED product.';
    } else if (selectedProductRecord.counterfeitReported) {
      e.productId = 'Cannot transfer COUNTERFEIT REPORTED product.';
    }

    if (!recipientAddress.trim()) {
      e.recipientAddress = 'Recipient wallet address is required.';
    } else if (recipientAddress.length < 10) {
      e.recipientAddress = 'Invalid Algorand address format.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setStep(2);
  };

  const handleExecuteTransfer = async () => {
    setStep(3);
    setTxErrorMsg('');

    setTimeout(async () => {
      const result = await transferProductOnChain(
        productId.trim(),
        recipientAddress.trim(),
        recipientRole,
        transferMetadataHash.trim() || undefined
      );

      if (result.success) {
        setConfirmedTxId(result.txId);
        setStep(4);
      } else {
        setTxErrorMsg(result.error || 'Transfer transaction rejected by AVM smart contract.');
        setStep(1);
      }
    }, 1400);
  };

  const handleReset = () => {
    setStep(1);
    setConfirmedTxId('');
    setTxErrorMsg('');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Transfer Product Custody"
        description="Dedicated product transfer workflow — initiate custody handoff on the Algorand blockchain."
        breadcrumbs={[{ label: 'Transfer Product' }]}
      />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Step Flow Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2 text-xs">
          <div className={`flex items-center gap-2 font-bold ${step >= 1 ? 'text-teal-700' : 'text-slate-400'}`}>
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px]">1</span>
            <span>Select & Enter Details</span>
          </div>
          <div className="h-0.5 flex-1 bg-slate-200 mx-2" />
          <div className={`flex items-center gap-2 font-bold ${step >= 2 ? 'text-teal-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
            <span>Review Custody Transfer</span>
          </div>
          <div className="h-0.5 flex-1 bg-slate-200 mx-2" />
          <div className={`flex items-center gap-2 font-bold ${step === 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</span>
            <span>Blockchain Confirmed</span>
          </div>
        </div>

        {/* STEP 1: FORM */}
        {step === 1 && (
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <ArrowLeftRight className="w-5 h-5 text-teal-600" /> Initiate Product Custody Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOpenReview} className="space-y-4">
                {/* 1. Select Category & Product */}
                <CategoryProductSelector
                  selectedProductId={productId}
                  onSelectProduct={(id) => {
                    setProductId(id);
                    if (errors.productId) setErrors({ ...errors, productId: '' });
                  }}
                />
                {errors.productId && <p className="text-xs text-rose-600">{errors.productId}</p>}

                {/* 2. Current Owner Info */}
                {selectedProductRecord && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Current Owner / Sender:</span>
                      <WalletAddress address={selectedProductRecord.currentHolder} />
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Batch ID:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedProductRecord.batchId}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Status:</span>
                      <StatusBadge status={selectedProductRecord.currentStatus} />
                    </div>
                  </div>
                )}

                {/* 3. Transfer To (Recipient Address & Role) */}
                <Input
                  label="Transfer To (Recipient Algorand Address)"
                  placeholder="Full Algorand wallet address..."
                  value={recipientAddress}
                  onChange={(e) => {
                    setRecipientAddress(e.target.value);
                    if (errors.recipientAddress) setErrors({ ...errors, recipientAddress: '' });
                  }}
                  error={errors.recipientAddress}
                  required
                />

                <Select
                  label="Recipient Participant Role"
                  value={recipientRole}
                  onChange={(e) => setRecipientRole(e.target.value as UserRole)}
                  options={[
                    { value: 'DISTRIBUTOR', label: 'DISTRIBUTOR' },
                    { value: 'WAREHOUSE', label: 'WAREHOUSE' },
                    { value: 'RETAILER', label: 'RETAILER' },
                  ]}
                />

                {/* 4. Quantity */}
                <Input
                  label="Quantity / Handoff Unit Count"
                  placeholder="e.g. 100 Units"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  leftIcon={<Layers className="w-4 h-4 text-slate-400" />}
                />

                {/* Optional Metadata Hash */}
                <Input
                  label="Shipping Manifest Metadata Hash (Optional)"
                  placeholder="sha256:manifest-hash..."
                  value={transferMetadataHash}
                  onChange={(e) => setTransferMetadataHash(e.target.value)}
                  leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
                />

                {txErrorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-900 font-mono">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{txErrorMsg}</span>
                  </div>
                )}

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <Button variant="secondary" type="submit" size="md" leftIcon={<Send className="w-4 h-4" />}>
                    Review Transfer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: REVIEW */}
        {step === 2 && (
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <ShieldCheck className="w-5 h-5 text-teal-600" /> Review Custody Transfer Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Product ID:</span>
                  <span className="font-mono font-extrabold text-slate-900">{productId}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-teal-200">
                  <span className="text-slate-500">Current Owner:</span>
                  <WalletAddress address={account?.address || 'MNF4K8L9M0N1P2Q3...'} />
                </div>
                <div className="flex justify-between pt-1 border-t border-teal-200">
                  <span className="text-slate-500">Designated Recipient:</span>
                  <WalletAddress address={recipientAddress} />
                </div>
                <div className="flex justify-between pt-1 border-t border-teal-200">
                  <span className="text-slate-500">Recipient Role:</span>
                  <span className="font-bold text-teal-900">{recipientRole}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-teal-200">
                  <span className="text-slate-500">Quantity:</span>
                  <span className="font-semibold text-slate-900">{quantity}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-teal-200">
                  <span className="text-slate-500">Network:</span>
                  <span className="font-bold text-teal-700 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Algorand {network}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Invoking ARC-4 <strong>transfer_product</strong> on-chain. Recipient must accept receipt to finalize custody transition.
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-100">
                <Button variant="outline" size="md" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="secondary" size="md" leftIcon={<Send className="w-4 h-4" />} onClick={handleExecuteTransfer}>
                  Confirm Blockchain Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: WAITING MODAL */}
        <Modal isOpen={step === 3} onClose={() => {}} title="Processing Transfer" maxWidth="sm">
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-teal-600 animate-spin mx-auto" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Executing transfer_product()...</h4>
              <p className="text-xs text-slate-500 mt-1">Updating pending recipient state on Algorand {network}</p>
            </div>
          </div>
        </Modal>

        {/* STEP 4: SUCCESS */}
        {step === 4 && (
          <Card variant="default" className="p-8 text-center space-y-6 border-emerald-200 bg-emerald-50/20">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Transfer Initiated On-Chain
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-3">{productId}</h2>
              <p className="text-xs text-slate-500 mt-1">Pending recipient receipt confirmation</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 text-left space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Designated Recipient:</span>
                <WalletAddress address={recipientAddress} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient Role:</span>
                <span className="font-bold text-slate-900">{recipientRole}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block mb-1">Confirmed Transaction Hash:</span>
                <span className="font-mono text-teal-700 font-bold break-all bg-slate-50 p-2 rounded border border-slate-200 block">
                  {confirmedTxId}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" size="md" onClick={() => setActiveNav('receive-product')}>
                Go to Receive Product Page
              </Button>
              <Button variant="secondary" size="md" onClick={handleReset}>
                Transfer Another Product
              </Button>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
