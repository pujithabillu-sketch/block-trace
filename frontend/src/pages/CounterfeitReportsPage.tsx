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
  AlertTriangle,
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Lock,
  Info,
} from 'lucide-react';

type TxStep = 'FORM' | 'CONFIRM' | 'WAITING' | 'SUCCESS' | 'FAILED';

export const CounterfeitReportsPage: React.FC = () => {
  const { account, network } = useAuth();
  const { getProductById, reportCounterfeitOnChain, counterfeitReports } = useProducts();

  const [productId, setProductId] = useState('');
  const [reportHash, setReportHash] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [txStep, setTxStep] = useState<TxStep>('FORM');
  const [confirmedTxId, setConfirmedTxId] = useState('');
  const [txErrorMsg, setTxErrorMsg] = useState('');

  const canReport = !!account; // Any authenticated user can submit counterfeit report

  const validate = () => {
    const e: Record<string, string> = {};
    if (!productId.trim()) {
      e.productId = 'Product ID is required.';
    } else {
      const prod = getProductById(productId.trim().toUpperCase());
      if (!prod) {
        e.productId = `Product "${productId.trim()}" not found in Algorand registry.`;
      }
    }
    if (!reportHash.trim()) {
      e.reportHash = 'Evidence hash is required. Hash your document off-chain.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOpenConfirm = (evt: React.FormEvent) => {
    evt.preventDefault();
    if (validate()) setTxStep('CONFIRM');
  };

  const handleExecute = async () => {
    setTxStep('WAITING');
    try {
      // Simulate real network execution latency
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const res = await reportCounterfeitOnChain(
        productId.trim().toUpperCase(),
        reportHash.trim(),
        details.trim(),
        account?.address || ''
      );

      if (res.success) {
        setConfirmedTxId(res.txId);
        setTxStep('SUCCESS');
      } else {
        setTxErrorMsg(res.error || 'Smart contract transaction failed.');
        setTxStep('FAILED');
      }
    } catch (err) {
      setTxErrorMsg(err instanceof Error ? err.message : String(err));
      setTxStep('FAILED');
    }
  };

  const handleReset = () => {
    setTxStep('FORM');
    setProductId('');
    setReportHash('');
    setDetails('');
    setConfirmedTxId('');
    setTxErrorMsg('');
    setErrors({});
  };

  const previewProduct = productId.trim() ? getProductById(productId.trim().toUpperCase()) : null;

  return (
    <PageContainer>
      <PageHeader
        title="Report Suspicious Product"
        description="File counterfeit evidence on Algorand via report_counterfeit(product_id, report_hash). Only cryptographic reference hash is stored on-chain."
        breadcrumbs={[{ label: 'Counterfeit Reports' }]}
      />

      {/* Permission Guard */}
      {!canReport && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-900">
          <Lock className="w-4 h-4 text-rose-600 shrink-0" />
          <span>You must be logged in to submit a counterfeit report.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FORM COLUMN */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> File Counterfeit Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOpenConfirm} className="space-y-4">
                <Input
                  label="Target Product ID"
                  placeholder="e.g. PROD-100003"
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    if (errors.productId) setErrors({ ...errors, productId: '' });
                  }}
                  error={errors.productId}
                  required
                />

                {/* Live product preview */}
                {previewProduct && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Product Found:</span>
                      <span className="font-bold text-slate-900">{previewProduct.name}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Current Status:</span>
                      <StatusBadge status={previewProduct.currentStatus} showIcon={false} />
                    </div>
                  </div>
                )}

                <Input
                  label="Evidence SHA-256 Report Hash"
                  placeholder="sha256:evidence-document-hash..."
                  value={reportHash}
                  onChange={(e) => {
                    setReportHash(e.target.value);
                    if (errors.reportHash) setErrors({ ...errors, reportHash: '' });
                  }}
                  error={errors.reportHash}
                  leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Reason / Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Describe packaging print anomaly, missing holographic seal, or lab test mismatch..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>

                {/* Off-chain notice */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2 text-xs text-blue-900">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    Large evidence documents remain <strong>off-chain</strong>. The SHA-256 hash is permanently committed to Algorand state.
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="danger"
                  size="md"
                  disabled={!canReport}
                  className="w-full"
                  leftIcon={<ShieldAlert className="w-4 h-4" />}
                >
                  Submit Counterfeit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* REPORTS LOG COLUMN */}
        <div className="lg:col-span-7">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                Logged Incident Reports ({counterfeitReports.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {counterfeitReports.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                  No counterfeit reports filed yet.
                </div>
              )}
              {counterfeitReports.map((r) => (
                <div key={r.id} className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2 hover-lift transition-all duration-200">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-mono font-extrabold text-slate-900">{r.productId}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      r.status === 'CONFIRMED_COUNTERFEIT'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : r.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {r.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{r.details}</p>
                  <div className="pt-2 text-[11px] font-mono bg-amber-100/60 rounded-lg p-2 border border-amber-200 text-amber-900 break-all">
                    Evidence Hash: {r.reportHash}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <WalletAddress address={r.reporterAddress} />
                    <span>{new Date(r.timestamp).toLocaleString()}</span>
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
        onClose={() => setTxStep('FORM')}
        title="Confirm Counterfeit Report Submission"
        subtitle="Review before signing transaction on Algorand"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Product ID:</span>
              <span className="font-mono font-bold text-slate-900">{productId.toUpperCase()}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-amber-100">
              <span className="text-slate-500">Reporter Address:</span>
              <WalletAddress address={account?.address || ''} />
            </div>
            <div className="flex justify-between pt-1 border-t border-amber-100">
              <span className="text-slate-500">Target Network:</span>
              <span className="font-bold text-teal-700 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Algorand {network}
              </span>
            </div>
            <div className="pt-1 border-t border-amber-100">
              <span className="text-slate-500 block mb-1">Evidence SHA-256 Hash:</span>
              <p className="font-mono text-[11px] text-slate-800 bg-amber-100 p-2 rounded break-all">{reportHash}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setTxStep('FORM')}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleExecute}>
              Submit Report On-Chain
            </Button>
          </div>
        </div>
      </Modal>

      {/* WAITING MODAL */}
      <Modal isOpen={txStep === 'WAITING'} onClose={() => {}} title="Processing Report" maxWidth="sm">
        <div className="p-6 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">Executing report_counterfeit()...</h4>
            <p className="text-xs text-slate-500 mt-1">Submitting state mutation to Algorand {network}</p>
          </div>
        </div>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal isOpen={txStep === 'SUCCESS'} onClose={handleReset} title="✓ Counterfeit Report Submitted">
        <div className="p-4 space-y-4 text-xs">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900">Report Committed On-Chain</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Product <span className="font-mono font-bold">{productId.toUpperCase()}</span> marked as COUNTERFEIT_REPORTED. Evidence hash committed to Algorand Box storage.
              </p>
            </div>
          </div>
          <div className="p-3 bg-slate-900 text-white rounded-xl font-mono">
            <span className="text-teal-400 font-bold block">Transaction ID:</span>
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
      <Modal isOpen={txStep === 'FAILED'} onClose={() => setTxStep('FORM')} title="Submission Failed" maxWidth="md">
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
            <Button variant="outline" size="sm" onClick={() => setTxStep('FORM')}>Back to Form</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
