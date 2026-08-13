import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/StatusBadge';
import { WalletAddress } from '../components/ui/WalletAddress';
import {
  XCircle,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Lock,
  Calendar,
  User,
} from 'lucide-react';

type TxStep = 'IDLE' | 'CONFIRM' | 'WAITING' | 'SUCCESS' | 'FAILED';

export const RecalledProductsPage: React.FC = () => {
  const { account, network } = useAuth();
  const { recalledProducts, getProductById, recallProductOnChain } = useProducts();

  const [targetProductId, setTargetProductId] = useState('');
  const [recallReason, setRecallReason] = useState('');
  const [idError, setIdError] = useState('');
  const [txStep, setTxStep] = useState<TxStep>('IDLE');
  const [confirmedTxId, setConfirmedTxId] = useState('');
  const [txErrorMsg, setTxErrorMsg] = useState('');

  const isAuthorized = account?.role === 'ADMIN' || account?.role === 'MANUFACTURER';

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProductId.trim()) {
      setIdError('Product ID is required.');
      return;
    }
    const p = getProductById(targetProductId.trim().toUpperCase());
    if (!p) {
      setIdError(`Product ID "${targetProductId}" not found in Algorand registry.`);
      return;
    }
    if (p.recalled) {
      setIdError(`Product "${targetProductId}" is already recalled.`);
      return;
    }
    setIdError('');
    setTxStep('CONFIRM');
  };

  const handleExecuteRecall = async () => {
    setTxStep('WAITING');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const res = await recallProductOnChain(
        targetProductId.trim().toUpperCase(),
        recallReason,
        account?.address || '',
        account?.role || 'UNAUTHORIZED'
      );

      if (res.success) {
        setConfirmedTxId(res.txId);
        setTxStep('SUCCESS');
      } else {
        setTxErrorMsg(res.error || 'Smart contract recall transaction failed.');
        setTxStep('FAILED');
      }
    } catch (err) {
      setTxErrorMsg(err instanceof Error ? err.message : String(err));
      setTxStep('FAILED');
    }
  };

  const handleReset = () => {
    setTxStep('IDLE');
    setTargetProductId('');
    setRecallReason('');
    setConfirmedTxId('');
    setTxErrorMsg('');
    setIdError('');
  };

  const previewProduct = targetProductId.trim()
    ? getProductById(targetProductId.trim().toUpperCase())
    : null;

  return (
    <PageContainer>
      <PageHeader
        title="Recalled Products"
        description="Emergency recall management via recall_product() on Algorand — permanently locks all subsequent custody transfers."
        breadcrumbs={[{ label: 'Recalled Products' }]}
      />

      {/* Permission Guard Banner */}
      {!isAuthorized && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-3 text-xs text-rose-900">
          <Lock className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold">You are not authorized to issue product recalls.</p>
            <p className="text-rose-700 mt-0.5">
              Only <strong>ADMIN</strong> or <strong>MANUFACTURER</strong> accounts have smart contract permission to invoke recall_product().
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recall Form (Admin / Manufacturer Only) */}
        <div className="lg:col-span-5">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-700">
                <XCircle className="w-5 h-5 text-rose-600" /> Issue Emergency Recall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOpenConfirm} className="space-y-4">
                <Input
                  label="Target Product ID to Recall"
                  value={targetProductId}
                  onChange={(e) => {
                    setTargetProductId(e.target.value);
                    if (idError) setIdError('');
                  }}
                  placeholder="e.g. PROD-100004"
                  error={idError}
                  required
                />

                {/* Product preview */}
                {previewProduct && !previewProduct.recalled && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Product:</span>
                      <span className="font-bold text-slate-900">{previewProduct.name}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Status:</span>
                      <StatusBadge status={previewProduct.currentStatus} showIcon={false} />
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <span className="text-slate-500 block mb-1">Current Holder:</span>
                      <WalletAddress address={previewProduct.currentHolder} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Recall Reason / Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    placeholder="Describe safety risk, batch contamination, packaging failure or component defect..."
                    value={recallReason}
                    onChange={(e) => setRecallReason(e.target.value)}
                  />
                </div>

                {/* Danger warning */}
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    PERMANENT BLOCKCHAIN LOCK
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-800">
                    A recalled product cannot be transferred through the supply chain. The smart contract will permanently reject all future transfer_product() calls.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="danger"
                  size="md"
                  disabled={!isAuthorized}
                  className="w-full"
                  leftIcon={<ShieldAlert className="w-4 h-4" />}
                >
                  Recall Product
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recalled Products List */}
        <div className="lg:col-span-7">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-700">
                <XCircle className="w-5 h-5 text-rose-600" />
                Active Recalled Products ({recalledProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recalledProducts.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                  No recalled products in the registry.
                </div>
              )}
              {recalledProducts.map((r) => (
                <div
                  key={r.productId}
                  className="p-5 bg-rose-50/90 border-2 border-rose-300 rounded-2xl space-y-3 shadow-xs hover-lift transition-all duration-200"
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                        <XCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-mono font-black text-slate-900 text-base">{r.productId}</p>
                        <p className="text-xs text-slate-600 font-semibold">{r.batchId}</p>
                      </div>
                    </div>
                    {/* RED WARNING STATUS BADGE */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white border border-rose-700 shadow-xs animate-pulse">
                      <XCircle className="w-4 h-4" />
                      <span>RECALLED — RED ALERT</span>
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Manufacturer:</span>
                      <WalletAddress address={r.manufacturer} />
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Current Holder:</span>
                      <WalletAddress address={r.currentHolder} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-rose-200">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-rose-600" />
                      <span>Recall Date: <span className="font-bold">{new Date(r.recalledAt).toLocaleDateString()}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="w-3.5 h-3.5 text-rose-600" />
                      <span>Recalled by: <WalletAddress address={r.recalledBy} /></span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-rose-100 border border-rose-300 rounded-xl text-xs text-rose-900 font-medium">
                    <strong className="block text-rose-950 font-bold mb-0.5">Recall Reason:</strong>
                    {r.reason}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <Modal
        isOpen={txStep === 'CONFIRM'}
        onClose={() => setTxStep('IDLE')}
        title="⚠ Confirm Product Recall"
        subtitle="This action permanently locks product custody transfers"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Target Product ID:</span>
              <span className="font-mono font-black text-rose-950 text-sm">{targetProductId.toUpperCase()}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-rose-200">
              <span className="text-slate-500">Caller Address:</span>
              <WalletAddress address={account?.address || ''} />
            </div>
            <div className="flex justify-between pt-1 border-t border-rose-200">
              <span className="text-slate-500">Target Network:</span>
              <span className="font-bold text-teal-700 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Algorand {network}
              </span>
            </div>
            {recallReason && (
              <div className="pt-1 border-t border-rose-200">
                <span className="text-slate-500 block mb-1">Reason:</span>
                <p className="text-rose-900 bg-rose-100 p-2 rounded border border-rose-200 leading-relaxed">{recallReason}</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-xs text-rose-900 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
            Are you sure you want to recall this product on-chain?
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setTxStep('IDLE')}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleExecuteRecall}>
              Confirm Recall
            </Button>
          </div>
        </div>
      </Modal>

      {/* WAITING MODAL */}
      <Modal isOpen={txStep === 'WAITING'} onClose={() => {}} title="Processing Recall" maxWidth="sm">
        <div className="p-6 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-rose-600 animate-spin mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">Executing recall_product()...</h4>
            <p className="text-xs text-slate-500 mt-1">Committing permanent status lock to Algorand {network}</p>
          </div>
        </div>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal isOpen={txStep === 'SUCCESS'} onClose={handleReset} title="✓ Product Recalled">
        <div className="p-4 space-y-4 text-xs">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900">Recall Executed On-Chain</h4>
              <p className="text-rose-800 mt-0.5">
                Product <span className="font-mono font-bold">{targetProductId.toUpperCase()}</span> status set to RECALLED. Transfers permanently rejected.
              </p>
            </div>
          </div>
          <div className="p-3 bg-slate-900 text-white rounded-xl font-mono">
            <span className="text-teal-400 font-bold block">Confirmed Transaction ID:</span>
            <p className="text-slate-300 break-all text-[11px] bg-slate-950 p-2 rounded border border-slate-800 mt-1">
              {confirmedTxId}
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={handleReset}>Done</Button>
          </div>
        </div>
      </Modal>

      {/* FAILED MODAL */}
      <Modal isOpen={txStep === 'FAILED'} onClose={() => setTxStep('IDLE')} title="Recall Failed" maxWidth="md">
        <div className="p-4 space-y-4 text-xs">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900">Transaction Rejected</h4>
              <p className="font-mono text-xs mt-1 leading-relaxed bg-rose-100 p-2 rounded border border-rose-200">
                {txErrorMsg}
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setTxStep('IDLE')}>Back</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
