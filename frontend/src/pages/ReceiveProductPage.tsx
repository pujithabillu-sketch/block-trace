import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { WalletAddress } from '../components/ui/WalletAddress';
import { Modal } from '../components/ui/Modal';
import {
  Inbox,
  CheckCircle2,
  Clock,
  Globe,
  Package,
  ShieldCheck,
} from 'lucide-react';

export const ReceiveProductPage: React.FC = () => {
  const { addToast } = useNavigation();
  const { account, network } = useAuth();
  const { products, receiveProductOnChain } = useProducts();

  const [txStep, setTxStep] = useState<'IDLE' | 'WAITING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [receivingProduct, setReceivingProduct] = useState<any>(null);
  const [confirmedTxId, setConfirmedTxId] = useState('');
  const [txErrorMsg, setTxErrorMsg] = useState('');

  // Find products that are pending transfer
  const pendingTransfers = products.filter(
    (p) => p.currentStatus === 'IN_TRANSIT' || !!p.pendingRecipient
  );

  const handleOpenConfirm = (prod: any) => {
    setReceivingProduct(prod);
    setTxStep('IDLE');
  };

  const handleExecuteReceipt = async () => {
    if (!receivingProduct) return;
    setTxStep('WAITING');
    setTxErrorMsg('');

    setTimeout(async () => {
      const result = await receiveProductOnChain(
        receivingProduct.productId,
        account?.address || 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8'
      );

      if (result.success) {
        setConfirmedTxId(result.txId);
        setTxStep('SUCCESS');
        addToast({
          type: 'success',
          title: 'Product Received',
          message: `Confirmed receipt for ${receivingProduct.productId} on Algorand`,
        });
      } else {
        setTxErrorMsg(result.error || 'Receipt confirmation rejected on-chain.');
        setTxStep('FAILED');
      }
    }, 1400);
  };

  const handleDone = () => {
    setTxStep('IDLE');
    setReceivingProduct(null);
    setConfirmedTxId('');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Receive Product"
        description="Dedicated product receipt confirmation page — execute receive_product() to finalize custody ownership."
        breadcrumbs={[{ label: 'Receive Product' }]}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-700">
              <Inbox className="w-5 h-5 text-teal-600" /> Pending Inbound Custody Transfers ({pendingTransfers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTransfers.length === 0 && (
              <div className="p-12 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">No Inbound Products Awaiting Receipt</p>
                <p className="text-slate-400 mt-1">Initiate a transfer from the Transfer Product page first.</p>
              </div>
            )}

            {pendingTransfers.map((p) => {
              const activeAddr = account?.address?.toUpperCase();
              const pendingRecipientAddr = p.pendingRecipient?.toUpperCase();
              const isDesignatedRecipient =
                !pendingRecipientAddr ||
                pendingRecipientAddr === activeAddr ||
                account?.role === 'ADMIN';

              return (
                <div
                  key={p.productId}
                  className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover-lift transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-slate-900 text-base">{p.productId}</span>
                      <StatusBadge status={p.currentStatus} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block font-semibold text-[10px] uppercase">Batch ID</span>
                        <span className="font-mono font-bold text-slate-800">{p.batchId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold text-[10px] uppercase">Sender / Prev Holder</span>
                        <WalletAddress address={p.currentHolder} />
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold text-[10px] uppercase">Designated Receiver</span>
                        <WalletAddress address={p.pendingRecipient || 'DST1P2Q3...'} />
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold text-[10px] uppercase">Quantity</span>
                        <span className="font-bold text-slate-800">100 Units</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Initiated: {new Date(p.lastUpdateTimestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <Button
                      variant="secondary"
                      size="md"
                      disabled={!isDesignatedRecipient}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      onClick={() => handleOpenConfirm(p)}
                    >
                      Confirm Product Receipt
                    </Button>
                    {!isDesignatedRecipient && (
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Recipient Mismatch
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* CONFIRMATION / DETAIL MODAL */}
      <Modal
        isOpen={!!receivingProduct && txStep === 'IDLE'}
        onClose={() => setReceivingProduct(null)}
        title="Confirm Product Receipt"
        subtitle="Review parameters before invoking receive_product() on Algorand"
      >
        {receivingProduct && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-xl space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Product ID:</span>
                <span className="font-mono font-extrabold text-slate-900">{receivingProduct.productId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch ID:</span>
                <span className="font-mono font-bold text-slate-900">{receivingProduct.batchId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sender / Holder:</span>
                <WalletAddress address={receivingProduct.currentHolder} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Receiver Wallet:</span>
                <WalletAddress address={account?.address || 'DST1P2Q3...'} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Network:</span>
                <span className="font-bold text-teal-700 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Algorand {network}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setReceivingProduct(null)}>
                Cancel
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<ShieldCheck className="w-4 h-4" />} onClick={handleExecuteReceipt}>
                Confirm Product Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* WAITING MODAL */}
      <Modal isOpen={txStep === 'WAITING'} onClose={() => {}} title="Processing Receipt" maxWidth="sm">
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-teal-600 animate-spin mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">Executing receive_product()...</h4>
            <p className="text-xs text-slate-500 mt-1">Committing state update to Algorand Box storage</p>
          </div>
        </div>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal isOpen={txStep === 'SUCCESS'} onClose={handleDone} title="✓ Product Received Successfully">
        <div className="p-4 space-y-4 text-xs">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-900">Custody Handover Complete</h4>
              <p className="text-emerald-800 mt-0.5">
                Product <span className="font-mono font-bold">{receivingProduct?.productId}</span> is now owned by your connected wallet on Algorand.
              </p>
            </div>
          </div>
          <div className="p-3 bg-slate-900 text-white rounded-xl font-mono">
            <span className="text-teal-400 font-bold block">Transaction Hash:</span>
            <p className="text-slate-300 break-all text-[11px] bg-slate-950 p-2 rounded border border-slate-800 mt-1">{confirmedTxId}</p>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={handleDone}>Done</Button>
          </div>
        </div>
      </Modal>

      {/* FAILED MODAL */}
      <Modal isOpen={txStep === 'FAILED'} onClose={handleDone} title="Transaction Failed">
        <div className="p-4 space-y-4 text-xs">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 font-mono">
            <p>{txErrorMsg || 'Transaction was rejected by Algorand smart contract.'}</p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleDone}>Close</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
