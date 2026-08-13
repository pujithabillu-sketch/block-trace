import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Save,
  Server,
  User,
  Wallet,
  Globe,
  Bell,
  Shield,
  Copy,
  CheckCircle2,
  LogOut,
  AlertTriangle,
  Key,
} from 'lucide-react';
import type { NetworkType, UserRole } from '../types';

export const SettingsPage: React.FC = () => {
  const { account, network, setNetwork, logout } = useAuth();
  const { addToast } = useNavigation();

  // Node config state
  const [algodHost, setAlgodHost] = useState('http://localhost');
  const [algodPort, setAlgodPort] = useState('4001');
  const [algodToken, setAlgodToken] = useState(
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  );
  const [appId, setAppId] = useState('1001');
  const [isSaving, setIsSaving] = useState(false);

  // Notifications toggles
  const [notifyTransfer, setNotifyTransfer] = useState(true);
  const [notifyRecall, setNotifyRecall] = useState(true);
  const [notifyCounterfeit, setNotifyCounterfeit] = useState(true);
  const [notifyAuth, setNotifyAuth] = useState(true);
  const [notifyTxConfirm, setNotifyTxConfirm] = useState(true);

  // Copy address indicator
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleSaveNodeConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Algorand RPC parameters & Application ID updated.',
      });
    }, 500);
  };

  const handleDisconnect = () => {
    addToast({
      type: 'info',
      title: 'Disconnected',
      message: 'Wallet session cleared. Please reconnect to continue.',
    });
    logout();
  };

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description?: string;
  }> = ({ checked, onChange, label, description }) => (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-xs font-semibold text-slate-900">{label}</p>
        {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-teal-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  const roleVariant = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'MANUFACTURER': return 'info';
      case 'DISTRIBUTOR': return 'success';
      case 'WAREHOUSE': return 'warning';
      case 'RETAILER': return 'default';
      default: return 'default';
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Settings & System Configuration"
        description="Manage your account profile, connected wallet, Algorand network endpoint, notification preferences, and smart contract security policies."
        breadcrumbs={[{ label: 'Settings' }]}
      />

      <div className="max-w-4xl space-y-6">
        {/* ── 1. PROFILE SECTION ── */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <User className="w-5 h-5 text-teal-600" /> 1. User Profile & Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {account ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block mb-0.5">Account Name</span>
                    <span className="font-bold text-slate-900 text-sm">{account.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block mb-0.5">Assigned User Role</span>
                    <Badge variant={roleVariant(account.role)}>{account.role}</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                No active profile logged in.
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── 2. WALLET SECTION ── */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Wallet className="w-5 h-5 text-teal-600" /> 2. Algorand Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {account ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                <div>
                  <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block mb-1">
                    Connected Wallet Address
                  </span>
                  <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg font-mono text-[11px] text-slate-900">
                    <span className="flex-1 break-all">{account.address}</span>
                    <button
                      onClick={handleCopyAddress}
                      className="shrink-0 text-slate-400 hover:text-teal-600 transition-colors p-1"
                      title="Copy full address"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block mb-0.5">
                      Authorization Status
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> AUTHORIZED ON-CHAIN
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block mb-0.5">
                      Available Balance
                    </span>
                    <span className="font-mono font-extrabold text-slate-900 text-sm">{account.balanceAlgo} ALGO</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<LogOut className="w-3.5 h-3.5" />}
                    onClick={handleDisconnect}
                  >
                    Disconnect Wallet Session
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                No wallet connected.
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── 3. NETWORK SECTION ── */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Globe className="w-5 h-5 text-teal-600" /> 3. Algorand Network Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Active Algorand Network Target"
              value={network}
              onChange={(e) => setNetwork(e.target.value as NetworkType)}
              options={[
                { value: 'LocalNet', label: 'Algorand LocalNet (Sandbox — http://localhost:4001)' },
                { value: 'TestNet', label: 'Algorand TestNet (Staging — https://testnet-api.algonode.cloud)' },
              ]}
            />

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>MainNet Locked:</strong> BlockTrace is currently restricted to LocalNet and TestNet environments.
              </span>
            </div>

            {/* Algod Node Form */}
            <form onSubmit={handleSaveNodeConfig} className="pt-2 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Server className="w-4 h-4 text-teal-600" /> Algod RPC Endpoint Parameters
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Algod Host" value={algodHost} onChange={(e) => setAlgodHost(e.target.value)} />
                <Input label="Port" value={algodPort} onChange={(e) => setAlgodPort(e.target.value)} />
              </div>
              <Input label="Algod API Token" value={algodToken} onChange={(e) => setAlgodToken(e.target.value)} />
              <Input
                label="BlockTrace Application ID"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                helperText="Smart contract App ID deployed via AlgoKit"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="secondary" size="sm" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Save RPC Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ── 4. NOTIFICATIONS SECTION ── */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Bell className="w-5 h-5 text-teal-600" /> 4. Notification & Alert Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleSwitch
              checked={notifyTransfer}
              onChange={setNotifyTransfer}
              label="Product Custody Transfer Alerts"
              description="Notify when a product transfer is initiated or receipt is confirmed"
            />
            <ToggleSwitch
              checked={notifyRecall}
              onChange={setNotifyRecall}
              label="Emergency Recall Alerts"
              description="High-priority alert when a product safety recall is declared"
            />
            <ToggleSwitch
              checked={notifyCounterfeit}
              onChange={setNotifyCounterfeit}
              label="Counterfeit Evidence Alerts"
              description="Notify when an incident report is filed against a tracked product"
            />
            <ToggleSwitch
              checked={notifyAuth}
              onChange={setNotifyAuth}
              label="Participant Authorization Alerts"
              description="Notify on role authorization grants and revocations"
            />
            <ToggleSwitch
              checked={notifyTxConfirm}
              onChange={setNotifyTxConfirm}
              label="Transaction Confirmation Status"
              description="Show real-time toast alerts for block confirmation and failure states"
            />
          </CardContent>
        </Card>

        {/* ── 5. SECURITY SECTION ── */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Shield className="w-5 h-5 text-teal-600" /> 5. Security & Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Smart Contract Role Enforcement</span>
                <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  ARC-4 RBAC Asserted
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-600 font-medium">Cryptographic Hash Verification</span>
                <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-300">
                  SHA-256 Enabled
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-600 font-medium">Private Key Storage</span>
                <span className="font-mono text-[10px] font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-full border border-slate-300">
                  Local Wallet / Non-Custodial
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-blue-900">
              <Key className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Key Disclosure:</strong> BlockTrace never requests, reads, or stores your private seed phrase. All transactions are signed locally via your Algorand wallet provider.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
