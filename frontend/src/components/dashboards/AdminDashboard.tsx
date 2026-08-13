import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useProducts } from '../../context/ProductContext';
import { PageContainer } from '../layout/PageContainer';
import { PageHeader } from '../ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { WalletAddress } from '../ui/WalletAddress';
import {
  ShieldAlert,
  Users,
  Activity,
  Package,
  AlertTriangle,
  Server,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { setActiveNav } = useNavigation();
  const { products, historyEvents, counterfeitReports, recalledProducts, participants } = useProducts();

  return (
    <PageContainer>
      <PageHeader
        title="System Administration & Blockchain Network"
        description="Global governance dashboard for monitoring participants, auditing Algorand transactions, and managing security alerts."
        breadcrumbs={[{ label: 'Admin Workspace' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveNav('participants')}
              variant="primary"
              size="md"
              icon={<Users className="w-4 h-4" />}
            >
              Manage Participants
            </Button>
            <Button
              onClick={() => setActiveNav('blockchain-activity')}
              variant="outline"
              size="md"
              icon={<Activity className="w-4 h-4" />}
            >
              Ledger Logs
            </Button>
          </div>
        }
      />

      {/* 5 STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card variant="default">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{products.length}</h3>
              <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">Tracked On-Chain</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Nodes</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{participants.length}</h3>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Authorized Wallets</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transactions</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{historyEvents.length}</h3>
              <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Verified Blocks</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reports</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{counterfeitReports.length}</h3>
              <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Counterfeit Cases</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recalls</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{recalledProducts.length}</h3>
              <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Safety Actions</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NETWORK HEALTH & PARTICIPANTS OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="default">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Authorized Supply Chain Nodes
              </CardTitle>
              <Button onClick={() => setActiveNav('participants')} variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.map((p, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-slate-900">{p.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                          {p.role}
                        </span>
                      </div>
                      <WalletAddress address={p.address} />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      ✓ Authorized Node
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ALGORAND SMART CONTRACT HEALTH */}
        <div>
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-4 h-4 text-teal-600" />
                Algorand Network Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Node Status:</span>
                  <span className="text-emerald-400 font-bold">ONLINE (LocalNet)</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">ARC-4 Contract:</span>
                  <span className="text-indigo-400 font-bold">APP-100293</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Box Map Storage:</span>
                  <span className="text-teal-400 font-bold">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Avg Block Time:</span>
                  <span className="text-slate-200">2.8s</span>
                </div>
              </div>

              <Button
                onClick={() => setActiveNav('blockchain-activity')}
                variant="outline"
                size="md"
                className="w-full flex items-center justify-center gap-2"
              >
                Inspect Ledger Logs <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
