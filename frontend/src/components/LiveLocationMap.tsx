import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Navigation, Compass, Gauge, AlertCircle, RefreshCw, Layers, MapPin } from 'lucide-react';

interface LiveLocationMapProps {
  latitude: number;
  longitude: number;
  facilityLatitude?: number;
  facilityLongitude?: number;
  facilityName?: string;
  batchId?: string;
  speedKmH?: number;
  heading?: string;
  statusText?: string;
  className?: string;
}

export const LiveLocationMap: React.FC<LiveLocationMapProps> = ({
  latitude,
  longitude,
  facilityLatitude = 16.5062,
  facilityLongitude = 80.6480,
  facilityName = 'Main Manufacturing & Processing Facility',
  batchId = 'PROD-RICE-0001',
  speedKmH = 64,
  heading = 'NE 45°',
  statusText = 'IN_TRANSIT',
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const googleMapInstanceRef = useRef<any>(null);
  const shipmentMarkerRef = useRef<any>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (!apiKey) {
      setLoadError('VITE_GOOGLE_MAPS_API_KEY not configured. Displaying interactive GIS location radar.');
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'marker'],
    });

    (loader as any)
      .load()
      .then(async (google: any) => {
        if (!mapRef.current) return;

        const center = { lat: latitude, lng: longitude };
        const map = new google.maps.Map(mapRef.current, {
          center: center,
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControl: true,
          fullscreenControl: true,
          streetViewControl: true,
          mapTypeControl: true,
        });

        googleMapInstanceRef.current = map;

        // Try AdvancedMarkerElement if available
        try {
          const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as any;
          if (AdvancedMarkerElement) {
            const shipmentMarker = new AdvancedMarkerElement({
              map: map,
              position: center,
              title: `Shipment Batch ${batchId}`,
            });
            shipmentMarkerRef.current = shipmentMarker;

            new AdvancedMarkerElement({
              map: map,
              position: { lat: facilityLatitude, lng: facilityLongitude },
              title: facilityName,
            });
          } else {
            createStandardMarkers(google, map);
          }
        } catch (e) {
          createStandardMarkers(google, map);
        }

        setMapLoaded(true);
      })
      .catch((err: any) => {
        console.warn('Google Maps Loader Notice:', err?.message || err);
        setLoadError('Google Maps API key unverified or restricted. Rendering fallback GIS location canvas.');
      });

    function createStandardMarkers(googleObj: any, mapObj: any) {
      const shipmentMarker = new googleObj.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: mapObj,
        title: `Shipment Batch ${batchId}`,
        animation: googleObj.maps.Animation.DROP,
      });
      shipmentMarkerRef.current = shipmentMarker;

      const infoWindow = new googleObj.maps.InfoWindow({
        content: `
          <div style="font-family: sans-serif; padding: 6px;">
            <strong style="color: #0f172a;">Batch: ${batchId}</strong><br/>
            <span style="font-size: 11px; color: #0d9488;">Speed: ${speedKmH} km/h • ${heading}</span><br/>
            <span style="font-size: 10px; color: #64748b;">GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</span>
          </div>
        `,
      });

      shipmentMarker.addListener('click', () => {
        infoWindow.open(mapObj, shipmentMarker);
      });

      new googleObj.maps.Marker({
        position: { lat: facilityLatitude, lng: facilityLongitude },
        map: mapObj,
        title: facilityName,
      });
    }
  }, [apiKey]);

  useEffect(() => {
    if (googleMapInstanceRef.current && shipmentMarkerRef.current) {
      const newPos = { lat: latitude, lng: longitude };
      if (typeof shipmentMarkerRef.current.setPosition === 'function') {
        shipmentMarkerRef.current.setPosition(newPos);
      } else if ('position' in shipmentMarkerRef.current) {
        shipmentMarkerRef.current.position = newPos;
      }
      googleMapInstanceRef.current.panTo(newPos);
    }
  }, [latitude, longitude]);

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm space-y-0 ${className}`}>
      {/* MAP CONTROLS & STATUS BAR */}
      <div className="p-3.5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
          <Navigation className="w-4 h-4 text-teal-400" />
          <span className="font-bold text-slate-200">Google Maps Live GPS Satellite Tracking</span>
          <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30 uppercase">
            {statusText}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <strong className="text-teal-300">{latitude.toFixed(6)}° N, {longitude.toFixed(6)}° E</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            {speedKmH} km/h ({heading})
          </span>
        </div>
      </div>

      {/* MAP CANVAS / CONTAINER */}
      <div className="relative w-full h-[360px] bg-slate-900">
        <div ref={mapRef} className="w-full h-full" />

        {/* FALLBACK / INTERACTIVE DEMO GIS MAP CANVAS WHEN API KEY IS NOT LOADED */}
        {!mapLoaded && (
          <div className="absolute inset-0 bg-slate-950 p-6 flex flex-col justify-between text-slate-200 font-mono">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-white">Interactive GIS Route Radar</span>
              </div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin text-teal-400" /> Live 5s Polling
              </span>
            </div>

            {/* RADAR & ROUTE VISUALIZATION */}
            <div className="relative my-auto py-8 px-4 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between gap-4">
                {/* FACILITY MARKER */}
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs">
                    <MapPin className="w-4 h-4" /> Facility Location
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">{facilityName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{facilityLatitude.toFixed(4)}° N, {facilityLongitude.toFixed(4)}° E</p>
                </div>

                {/* ANIMATED ROUTE LINE */}
                <div className="flex-1 relative flex items-center justify-center">
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-teal-500 via-sky-400 to-amber-400 animate-pulse" />
                  </div>
                  <div className="absolute px-3 py-1 bg-teal-900/90 text-teal-200 border border-teal-500/40 rounded-full text-[10px] font-bold shadow-lg">
                    ⚡ {speedKmH} km/h • En Route
                  </div>
                </div>

                {/* SHIPMENT MARKER */}
                <div className="p-3 bg-teal-950/80 rounded-xl border border-teal-500/50 space-y-1 shadow-md shadow-teal-500/10">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Navigation className="w-4 h-4 animate-bounce text-amber-400" /> Active Vehicle
                  </div>
                  <p className="text-[11px] text-white font-bold">{batchId}</p>
                  <p className="text-[10px] text-teal-300 font-mono">{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</p>
                </div>
              </div>
            </div>

            {/* NOTICE FOOTER */}
            {loadError && (
              <div className="flex items-center gap-2 text-[11px] text-amber-400/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loadError}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER INFO BAR */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-600">
        <div>
          <span>Target Batch: <strong className="text-slate-900">{batchId}</strong></span>
          <span className="mx-2">•</span>
          <span>Facility: <strong className="text-slate-900">{facilityName}</strong></span>
        </div>
        <div className="text-teal-700 font-bold flex items-center gap-1">
          ✓ Google Maps Satellite Sync Active
        </div>
      </div>
    </div>
  );
};
