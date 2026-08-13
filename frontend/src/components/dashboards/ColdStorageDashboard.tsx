import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useProducts } from '../../context/ProductContext';
import { PageContainer } from '../layout/PageContainer';
import { PageHeader } from '../ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import {
  ThermometerSnowflake,
  Snowflake,
  PackageCheck,
  Truck,
  ArrowRight,
  Activity,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export const ColdStorageDashboard: React.FC = () => {
  const { setActiveNav, navigateToProductDetails } = useNavigation();
  const { products, historyEvents } = useProducts();

  const coldProducts = products.filter((p) => p.coldChainStatus || (p.category || '').toLowerCase().includes('food') || (p.category || '').toLowerCase().includes('pharm'));
  const totalPerishables = coldProducts.length || products.length;
  const optimalSensors = coldProducts.filter((p) => p.coldChainStatus !== 'BREACHED').length;
  const breachedSensors = products.filter((p) => p.coldChainStatus === 'BREACHED' || p.recalled).length;
  const inTransitPerishables = coldProducts.filter((p) => p.currentStatus === 'IN_TRANSIT').length;

  const samplePerishable = coldProducts[0] || products[0];

  return (
    <PageContainer>
      <PageHeader
        title="Cold Chain & Perishable Monitoring"
        description="Real-time thermal telemetry, automated temperature breach detection, and ultra-cold storage vault audit."
        breadcrumbs={[{ label: 'Cold Storage Workspace' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveNav('verify-product')}
              variant="primary"
              size="md"
              icon={<ThermometerSnowflake className="w-4 h-4" />}
            >
              Verify Temp Sensor
            </Button>
            <Button
              onClick={() => setActiveNav('receive-product')}
              variant="outline"
              size="md"
              icon={<PackageCheck className="w-4 h-4" />}
            >
              Receive Cold Shipment
            </Button>
          </div>
        }
      />

      {/* 4 STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card variant="default" className="border-cyan-200/80 bg-gradient-to-br from-cyan-50/50 via-sky-50/30 to-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">Perishable Batches</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalPerishables}</h3>
              <p className="text-[11px] text-cyan-600 font-semibold mt-1">Thermal Monitored</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Snowflake className="w-6 h-6 animate-spin-slow" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Optimal Sensors</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{optimalSensors}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Target Temp (2°C - 6°C)</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Thermal Breaches</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">{breachedSensors}</h3>
              <p className="text-[11px] text-rose-600 font-semibold mt-1">
                {breachedSensors > 0 ? 'Action Required' : 'Zero Breaches'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Refrigerated Transit</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{inTransitPerishables}</h3>
              <p className="text-[11px] text-sky-600 font-semibold mt-1">Cold Truck Fleet</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setActiveNav('verify-product')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/30 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Check Temp Sensor</p>
              <p className="text-[11px] text-slate-400">Read live telemetry</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
        </button>

        <button
          onClick={() => setActiveNav('receive-product')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/30 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Receive Cold Shipment</p>
              <p className="text-[11px] text-slate-400">Audit thermal log</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
        </button>

        <button
          onClick={() => setActiveNav('transfers')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/30 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Cold Dispatch</p>
              <p className="text-[11px] text-slate-400">Transfer in cold truck</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </button>

        <button
          onClick={() => setActiveNav('recalled-products')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/30 transition-all text-left group flex items-center justify-between cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Breach Incident Log</p>
              <p className="text-[11px] text-slate-400">View temperature fails</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
        </button>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="default">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-cyan-900">
                <ThermometerSnowflake className="w-5 h-5 text-cyan-600" />
                Live Thermal Vault Telemetry
              </CardTitle>
              <Button onClick={() => setActiveNav('products')} variant="ghost" size="sm">
                View All Storage
              </Button>
            </CardHeader>
            <CardContent>
              {samplePerishable ? (
                <div
                  onClick={() => navigateToProductDetails(samplePerishable.productId)}
                  className="p-5 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50/70 to-sky-50/30 hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-800">{samplePerishable.productId}</span>
                    <StatusBadge status={samplePerishable.currentStatus} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{samplePerishable.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Current Holder: <span className="font-mono text-slate-800 font-bold">{samplePerishable.currentHolder.substring(0, 10)}...</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-cyan-200/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Live Temp</span>
                      <span className="font-bold text-cyan-700">{samplePerishable.storageTemp || '4.2°C'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sensor Status</span>
                      <span className="font-bold text-emerald-600">{samplePerishable.coldChainStatus || 'OPTIMAL'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Category</span>
                      <span className="font-bold text-slate-800">{samplePerishable.category}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No thermal telemetry logs.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                Thermal Log Stream
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {historyEvents.slice(0, 4).map((evt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-cyan-700">{evt.productId}</span>
                    <span className="text-[10px] text-slate-400">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="font-semibold text-slate-800">{evt.eventType}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
