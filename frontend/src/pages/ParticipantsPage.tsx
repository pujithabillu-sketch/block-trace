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
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { WalletAddress } from '../components/ui/WalletAddress';
import {
  UserPlus,
  UserX,
  ShieldCheck,
  Copy,
  CheckCircle2,
  AlertCircle,
  Lock,
  Loader2,
  Globe,
  Eye,
  Users,
} from 'lucide-react';
import type { UserRole, ParticipantInfo } from '../types';

type TxStep = 'IDLE' | 'WAITING' | 'SUCCESS' | 'FAILED';

const roleBadgeVariant = (role: UserRole): 'info' | 'warning' | 'success' | 'danger' | 'default' => {
  switch (role) {
    case 'ADMIN': return 'danger';
    case 'MANUFACTURER': return 'info';
    case 'DISTRIBUTOR': return 'success';
    case 'WAREHOUSE': return 'warning';
    case 'RETAILER': return 'default';
    default: return 'default';
  }
};

export const ParticipantsPage: React.FC = () => {
  const { addToast } = useNavigation();
  const { account, network } = useAuth();
  const { participants, authorizeParticipantOnChain, revokeParticipantOnChain } = useProducts();

  // Authorize form
  const [newAddress, setNewAddress] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('DISTRIBUTOR');
  const [addrError, setAddrError] = useState('');

  // Authorize tx state
  const [authTxStep, setAuthTxStep] = useState<TxStep>('IDLE');
  const [authTxId, setAuthTxId] = useState('');
  const [authTxError, setAuthTxError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Revoke modal & tx state
  const [revokeTarget, setRevokeTarget] = useState<ParticipantInfo | null>(null);
  const [revokeTxStep, setRevokeTxStep] = useState<TxStep>('IDLE');
  const [revokeTxId, setRevokeTxId] = useState('');
  const [revokeTxError, setRevokeTxError] = useState('');

  // View detail modal
  const [viewTarget, setViewTarget] = useState<ParticipantInfo | null>(null);

  // Copy address indicator
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);

  const isAdmin = account?.role === 'ADMIN';

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr).then(() => {
      setCopiedAddr(addr);
      setTimeout(() => setCopiedAddr(null), 2000);
    });
  };

  /* ---------- AUTHORIZE PARTICIPANT ---------- */
  const validateAuth = (): boolean => {
    if (!newAddress.trim()) {
      setAddrError('Wallet address is required.');
      return false;
    }
    if (newAddress.trim().length < 10) {
      setAddrError('Invalid Algorand address format.');
      return false;
    }
    if (participants.find((p) => p.address.toLowerCase() === newAddress.trim().toLowerCase() && p.isAuthorized)) {
      setAddrError('This address is already an active authorized participant.');
      return false;
    }
    setAddrError('');
    return true;
  };

  const handleOpenAuthModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAuth()) setShowAuthModal(true);
  };

  const handleExecuteAuthorize = async () => {
    setAuthTxStep('WAITING');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const res = await authorizeParticipantOnChain(
        newAddress.trim(),
        newName.trim(),
        newRole,
        account?.role || 'UNAUTHORIZED'
      );

      if (res.success) {
        setAuthTxId(res.txId);
        setAuthTxStep('SUCCESS');
        addToast({
          type: 'success',
          title: 'Participant Authorized',
          message: `authorize_participant() executed for ${newAddress.substring(0, 8)}... Role: ${newRole}`,
        });
      } else {
        setAuthTxError(res.error || 'Smart contract authorization rejected.');
        setAuthTxStep('FAILED');
      }
    } catch (err) {
      setAuthTxError(err instanceof Error ? err.message : String(err));
      setAuthTxStep('FAILED');
    }
  };

  const handleAuthReset = () => {
    setShowAuthModal(false);
    setAuthTxStep('IDLE');
    setAuthTxId('');
    setAuthTxError('');
    setNewAddress('');
    setNewName('');
    setNewRole('DISTRIBUTOR');
  };

  /* ---------- REVOKE PARTICIPANT ---------- */
  const handleOpenRevoke = (p: ParticipantInfo) => {
    setRevokeTarget(p);
    setRevokeTxStep('IDLE');
    setRevokeTxId('');
    setRevokeTxError('');
  };

  const handleExecuteRevoke = async () => {
    if (!revokeTarget) return;
    setRevokeTxStep('WAITING');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const res = await revokeParticipantOnChain(
        revokeTarget.address,
        account?.role || 'UNAUTHORIZED'
      );

      if (res.success) {
        setRevokeTxId(res.txId);
        setRevokeTxStep('SUCCESS');
        addToast({
          type: 'warning',
          title: 'Participant Access Revoked',
          message: `revoke_participant() committed on-chain for ${revokeTarget.name}`,
        });
      } else {
        setRevokeTxError(res.error || 'Smart contract revocation rejected.');
        setRevokeTxStep('FAILED');
      }
    } catch (err) {
      setRevokeTxError(err instanceof Error ? err.message : String(err));
      setRevokeTxStep('FAILED');
    }
  };

  const handleRevokeReset = () => {
    setRevokeTarget(null);
    setRevokeTxStep('IDLE');
    setRevokeTxId('');
    setRevokeTxError('');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Supply Chain Participants"
        description="Manage participant accounts and roles via authorize_participant and revoke_participant ARC-4 smart contract methods."
        breadcrumbs={[{ label: 'Participants' }]}
        actions={
          isAdmin ? (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={() => setShowAuthModal(true)}
            >
              Authorize Participant
            </Button>
          ) : undefined
        }
      />

      {/* Permission Guard Banner */}
      {!isAdmin && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-3 text-xs text-amber-900">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>View-only mode:</strong> Non-admin users cannot authorize or revoke participants. Smart contract security requires <strong>ADMIN</strong> account status.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Authorize Form (Left Column — Admin Only) */}
        {isAdmin && (
          <div className="lg:col-span-4">
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-teal-600" /> Authorize Participant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOpenAuthModal} className="space-y-4">
                  <Input
                    label="Wallet Address"
                    placeholder="Full Algorand address..."
                    value={newAddress}
                    onChange={(e) => {
                      setNewAddress(e.target.value);
                      if (addrError) setAddrError('');
                    }}
                    error={addrError}
                    required
                  />
                  <Input
                    label="Organization / Name"
                    placeholder="e.g. Apex Logistics Ltd"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <Select
                    label="Assigned Role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    options={[
                      { value: 'MANUFACTURER', label: '1 — MANUFACTURER' },
                      { value: 'DISTRIBUTOR', label: '2 — DISTRIBUTOR' },
                      { value: 'WAREHOUSE', label: '3 — WAREHOUSE' },
                      { value: 'RETAILER', label: '4 — RETAILER' },
                      { value: 'ADMIN', label: '5 — ADMIN' },
                    ]}
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="md"
                    className="w-full"
                    leftIcon={<ShieldCheck className="w-4 h-4" />}
                  >
                    Authorize Participant
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Participants Table */}
        <div className={isAdmin ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                Participant Registry ({participants.filter((p) => p.isAuthorized).length} Active)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Desktop Table */}
              <div className="hidden md:block table-responsive">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Participant</th>
                      <th className="py-3.5 px-5">Wallet Address</th>
                      <th className="py-3.5 px-5">Role</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5">Authorized Date</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {participants.map((p) => (
                      <tr key={p.address} className={`hover:bg-slate-50/60 transition-colors table-row-animate ${!p.isAuthorized ? 'opacity-50 bg-slate-50/50' : ''}`}>
                        <td className="py-3.5 px-5 font-semibold text-slate-900">{p.name}</td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-700">
                              {p.address.substring(0, 6)}...{p.address.substring(p.address.length - 6)}
                            </span>
                            <button
                              onClick={() => handleCopyAddress(p.address)}
                              className="text-slate-400 hover:text-teal-600 transition-colors"
                              title="Copy full address"
                            >
                              {copiedAddr === p.address
                                ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                : <Copy className="w-3.5 h-3.5" />
                              }
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <Badge variant={roleBadgeVariant(p.role)}>{p.role}</Badge>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            p.isAuthorized
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}>
                            {p.isAuthorized ? 'AUTHORIZED' : 'REVOKED'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-mono text-slate-500">
                          {new Date(p.joinedTimestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              leftIcon={<Eye className="w-3 h-3" />}
                              onClick={() => setViewTarget(p)}
                            >
                              View
                            </Button>
                            {p.isAuthorized && p.role !== 'ADMIN' && isAdmin && (
                              <Button
                                size="sm"
                                variant="danger"
                                leftIcon={<UserX className="w-3 h-3" />}
                                onClick={() => handleOpenRevoke(p)}
                              >
                                Revoke
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 space-y-3">
                {participants.map((p) => (
                  <div
                    key={p.address}
                    className={`p-4 border rounded-xl space-y-3 ${
                      p.isAuthorized ? 'border-slate-200 bg-slate-50' : 'border-rose-200 bg-rose-50/40 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                          {p.address.substring(0, 8)}...{p.address.substring(p.address.length - 6)}
                        </p>
                      </div>
                      <Badge variant={roleBadgeVariant(p.role)}>{p.role}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Authorized: {new Date(p.joinedTimestamp).toLocaleDateString()}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        p.isAuthorized
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}>
                        {p.isAuthorized ? 'AUTHORIZED' : 'REVOKED'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      <Button size="sm" variant="ghost" leftIcon={<Copy className="w-3 h-3" />} onClick={() => handleCopyAddress(p.address)}>
                        {copiedAddr === p.address ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button size="sm" variant="ghost" leftIcon={<Eye className="w-3 h-3" />} onClick={() => setViewTarget(p)}>
                        View
                      </Button>
                      {p.isAuthorized && p.role !== 'ADMIN' && isAdmin && (
                        <Button size="sm" variant="danger" leftIcon={<UserX className="w-3 h-3" />} onClick={() => handleOpenRevoke(p)}>
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AUTHORIZE MODAL */}
      <Modal
        isOpen={showAuthModal && authTxStep === 'IDLE'}
        onClose={handleAuthReset}
        title="Authorize Participant"
        subtitle="Grant supply-chain role via authorize_participant() on Algorand"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Wallet Address:</span>
              <span className="font-mono font-bold text-slate-900 break-all max-w-[220px] text-right">{newAddress}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-100">
              <span className="text-slate-500">Organization:</span>
              <span className="font-bold text-slate-900">{newName || '—'}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-100">
              <span className="text-slate-500">Assigned Role:</span>
              <Badge variant={roleBadgeVariant(newRole)}>{newRole}</Badge>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-100">
              <span className="text-slate-500">Network:</span>
              <span className="font-bold text-teal-700 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Algorand {network}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleAuthReset}>Cancel</Button>
            <Button variant="secondary" size="sm" leftIcon={<ShieldCheck className="w-4 h-4" />} onClick={handleExecuteAuthorize}>
              Confirm Authorize
            </Button>
          </div>
        </div>
      </Modal>

      {/* AUTHORIZE WAITING */}
      <Modal isOpen={showAuthModal && authTxStep === 'WAITING'} onClose={() => {}} title="Processing Authorization" maxWidth="sm">
        <div className="p-6 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">Executing authorize_participant()...</h4>
            <p className="text-xs text-slate-500 mt-1">Mutating participant registry state on Algorand {network}</p>
          </div>
        </div>
      </Modal>

      {/* AUTHORIZE SUCCESS */}
      <Modal isOpen={showAuthModal && authTxStep === 'SUCCESS'} onClose={handleAuthReset} title="✓ Participant Authorized">
        <div className="p-4 space-y-4 text-xs">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-900">Role Granted On-Chain</h4>
              <p className="text-emerald-800 mt-0.5">
                Address <span className="font-mono">{newAddress.substring(0, 8)}...</span> assigned role{' '}
                <strong>{newRole}</strong> in Algorand Box storage.
              </p>
            </div>
          </div>
          <div className="p-3 bg-slate-900 text-white rounded-xl font-mono">
            <span className="text-teal-400 font-bold block">Transaction ID:</span>
            <p className="text-slate-300 break-all text-[11px] bg-slate-950 p-2 rounded border border-slate-800 mt-1">{authTxId}</p>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={handleAuthReset}>Done</Button>
          </div>
        </div>
      </Modal>

      {/* AUTHORIZE FAILED */}
      <Modal isOpen={showAuthModal && authTxStep === 'FAILED'} onClose={handleAuthReset} title="Authorization Failed">
        <div className="p-4 space-y-4 text-xs">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="font-mono text-xs">{authTxError}</p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleAuthReset}>Back</Button>
          </div>
        </div>
      </Modal>

      {/* REVOKE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!revokeTarget && revokeTxStep === 'IDLE'}
        onClose={handleRevokeReset}
        title="Revoke Participant Access"
        subtitle="Confirm before executing revoke_participant() on Algorand"
      >
        {revokeTarget && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Participant Name:</span>
                <span className="font-bold text-rose-900">{revokeTarget.name}</span>
              </div>
              <div className="pt-1 border-t border-rose-100">
                <span className="text-slate-500 block mb-1">Wallet Address:</span>
                <WalletAddress address={revokeTarget.address} />
              </div>
              <div className="flex justify-between pt-1 border-t border-rose-100">
                <span className="text-slate-500">Current Role to Revoke:</span>
                <Badge variant={roleBadgeVariant(revokeTarget.role)}>{revokeTarget.role}</Badge>
              </div>
              <div className="flex justify-between pt-1 border-t border-rose-100">
                <span className="text-slate-500">Target Network:</span>
                <span className="font-bold text-teal-700 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Algorand {network}
                </span>
              </div>
            </div>

            <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-rose-900 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              Are you sure you want to revoke authorization for this wallet?
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleRevokeReset}>Cancel</Button>
              <Button variant="danger" size="sm" leftIcon={<UserX className="w-3.5 h-3.5" />} onClick={handleExecuteRevoke}>
                Confirm Revoke
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* REVOKE WAITING */}
      <Modal isOpen={!!revokeTarget && revokeTxStep === 'WAITING'} onClose={() => {}} title="Processing Revocation" maxWidth="sm">
        <div className="p-6 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-rose-600 animate-spin mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">Executing revoke_participant()...</h4>
            <p className="text-xs text-slate-500 mt-1">Clearing participant role in Algorand Box storage</p>
          </div>
        </div>
      </Modal>

      {/* REVOKE SUCCESS */}
      <Modal isOpen={!!revokeTarget && revokeTxStep === 'SUCCESS'} onClose={handleRevokeReset} title="✓ Participant Revoked">
        <div className="p-4 space-y-4 text-xs">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-rose-900">Access Revoked On-Chain</h4>
              <p className="text-rose-800 mt-0.5">
                Participant <span className="font-bold">{revokeTarget?.name}</span> role cleared on Algorand.
              </p>
            </div>
          </div>
          <div className="p-3 bg-slate-900 text-white rounded-xl font-mono">
            <span className="text-teal-400 font-bold block">Transaction ID:</span>
            <p className="text-slate-300 break-all text-[11px] bg-slate-950 p-2 rounded border border-slate-800 mt-1">{revokeTxId}</p>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={handleRevokeReset}>Done</Button>
          </div>
        </div>
      </Modal>

      {/* REVOKE FAILED */}
      <Modal isOpen={!!revokeTarget && revokeTxStep === 'FAILED'} onClose={handleRevokeReset} title="Revocation Failed">
        <div className="p-4 space-y-4 text-xs">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="font-mono text-xs">{revokeTxError}</p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleRevokeReset}>Back</Button>
          </div>
        </div>
      </Modal>

      {/* VIEW PARTICIPANT DETAIL MODAL */}
      <Modal
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Participant Details"
        subtitle="On-chain account record from Algorand participant registry"
      >
        {viewTarget && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-slate-900">{viewTarget.name}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block mb-1">Wallet Address:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-900 break-all">{viewTarget.address}</span>
                  <button
                    onClick={() => handleCopyAddress(viewTarget.address)}
                    className="text-slate-400 hover:text-teal-600 shrink-0"
                  >
                    {copiedAddr === viewTarget.address
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      : <Copy className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500">Assigned Role:</span>
                <Badge variant={roleBadgeVariant(viewTarget.role)}>{viewTarget.role}</Badge>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  viewTarget.isAuthorized
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}>
                  {viewTarget.isAuthorized ? 'AUTHORIZED' : 'REVOKED'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500">Authorized Date:</span>
                <span className="font-mono text-slate-900">{new Date(viewTarget.joinedTimestamp).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewTarget(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};
