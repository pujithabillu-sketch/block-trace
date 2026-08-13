import React from 'react';
import { Navigation, MapPin, Radio, ShieldCheck, Compass, Gauge, ExternalLink } from 'lucide-react';
import type { ProductRecord } from '../../types';

interface GpsLocationTrackerProps {
  product?: ProductRecord;
  compact?: boolean;
  className?: string;
}

export const GpsLocationTracker: React.FC<GpsLocationTrackerProps> = ({
  product,
  compact = false,
  className = '',
}) => {
  const defaultGps = {
    lat: 16.5062,
    lng: 80.648,
    locationName: product?.origin || 'Green Valley Farm Harvest Sector, AP',
    speedKmH: 64,
    heading: 'NE 45°',
  };

  const gps = product?.gpsCoordinates || defaultGps;

  if (compact) {
    return (
      <div className={`p-3 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <Navigation className="w-4 h-4 text-teal-400" />
          <span className="text-slate-300 truncate max-w-[200px]">{gps.locationName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-teal-300 font-bold">{gps.lat.toFixed(4)}° N, {gps.lng.toFixed(4)}° E</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
            GPS LOCKED
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 ${className}`}>
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold shrink-0 shadow-xs">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">Live GPS Satellite Location Telemetry</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                Active Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Real-time IoT waypoint tracking & Algorand box storage loggers</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white flex items-center gap-2 border border-slate-800">
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-bold text-teal-300">{gps.lat.toFixed(4)}° N, {gps.lng.toFixed(4)}° E</span>
          </div>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-teal-600" /> Current Geo Location
          </span>
          <span className="font-bold text-slate-900 block truncate">{gps.locationName}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
            <Gauge className="w-3 h-3 text-sky-600" /> Vehicle Speed & Heading
          </span>
          <span className="font-bold text-slate-900 block">{gps.speedKmH || 64} km/h • {gps.heading || 'NE 45°'}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Proof Signature Status
          </span>
          <span className="font-bold text-emerald-700 block flex items-center gap-1">
            VERIFIED ON-CHAIN
          </span>
        </div>
      </div>

      {/* SIMULATED GPS ROUTE WAYPOINT MAP VISUALIZER */}
      <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5 text-teal-400 font-bold">
            <Navigation className="w-4 h-4" /> Live Multi-Hop GPS Corridor Route Map
          </span>
          <span className="text-[10px]">Refresh: 1 Sec • Satellites: 14 Connected</span>
        </div>

        {/* VISUAL ROUTE LINE */}
        <div className="relative pt-3 pb-2 px-2">
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2" />
          <div className="absolute top-1/2 left-4 w-2/3 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 -translate-y-1/2" />

          <div className="relative flex justify-between items-center z-10 text-[10px]">
            {/* WAYPOINT 1 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-900 font-extrabold flex items-center justify-center border-2 border-slate-900">
                1
              </div>
              <span className="text-emerald-400 font-bold">Farm Origin</span>
            </div>

            {/* WAYPOINT 2 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-teal-400 text-slate-900 font-extrabold flex items-center justify-center border-2 border-slate-900">
                2
              </div>
              <span className="text-teal-300 font-bold">Freight Transit</span>
            </div>

            {/* WAYPOINT 3 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-sky-400 text-slate-900 font-extrabold flex items-center justify-center border-2 border-slate-900 animate-bounce">
                3
              </div>
              <span className="text-sky-300 font-bold">Cold Storage Hub</span>
            </div>

            {/* WAYPOINT 4 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 font-extrabold flex items-center justify-center border-2 border-slate-900">
                4
              </div>
              <span className="text-slate-400">Storefront</span>
            </div>

            {/* WAYPOINT 5 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 font-extrabold flex items-center justify-center border-2 border-slate-900">
                5
              </div>
              <span className="text-slate-400">Customer Delivery</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
          <span className="text-slate-300">
            Current Target: <strong className="text-white">{product?.name || 'Organic Produce Batch'}</strong>
          </span>
          <a
            href={`https://testnet.algoexplorer.io/tx/${product?.metadataHash || 'BOX_MAP_0x99'}`}
            target="_blank"
            rel="noreferrer"
            className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
          >
            Proof Signature <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
