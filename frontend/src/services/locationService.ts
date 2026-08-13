import { useState, useEffect } from 'react';

export interface LocationTelemetry {
  batchId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: string;
  timestamp: number;
  locationName: string;
  status: string;
  facilityLatitude: number;
  facilityLongitude: number;
  facilityName: string;
}

const DEFAULT_LOCATIONS: Record<string, LocationTelemetry> = {
  'PROD-RICE-0001': {
    batchId: 'PROD-RICE-0001',
    latitude: 16.5071,
    longitude: 80.6491,
    speed: 64,
    heading: 'NE 45°',
    timestamp: Date.now(),
    locationName: 'Andhra Agro Organic Rice Corridor, Vijayawada Bypass',
    status: 'IN_TRANSIT',
    facilityLatitude: 16.5062,
    facilityLongitude: 80.648,
    facilityName: 'Guntur Agriculture Processing Facility',
  },
  'PROD-100001': {
    batchId: 'PROD-100001',
    latitude: 37.7749,
    longitude: -122.4194,
    speed: 72,
    heading: 'NW 30°',
    timestamp: Date.now(),
    locationName: 'California Highway 101 Cold Freight Corridor',
    status: 'IN_TRANSIT',
    facilityLatitude: 37.773,
    facilityLongitude: -122.415,
    facilityName: 'California Organic Packing House',
  },
  'PROD-PHARM-301': {
    batchId: 'PROD-PHARM-301',
    latitude: 49.9929,
    longitude: 8.2473,
    speed: 0,
    heading: 'STATIONARY',
    timestamp: Date.now(),
    locationName: 'SubZero Thermal Cold Storage Hub, Frankfurt Zone 2',
    status: 'AT_WAREHOUSE',
    facilityLatitude: 49.9929,
    facilityLongitude: 8.2473,
    facilityName: 'SubZero Thermal Storage Facility CS01',
  },
};

export const locationService = {
  getLiveLocation(batchId: string): LocationTelemetry {
    const base = DEFAULT_LOCATIONS[batchId] || {
      batchId,
      latitude: 16.5071,
      longitude: 80.6491,
      speed: 58,
      heading: 'E 90°',
      timestamp: Date.now(),
      locationName: 'National Highway Freight Corridor',
      status: 'IN_TRANSIT',
      facilityLatitude: 16.5062,
      facilityLongitude: 80.648,
      facilityName: 'Central Logistics Hub A',
    };

    // Simulate subtle micro-telemetry drift every 5 seconds for realistic live tracking
    const driftLat = (Math.random() - 0.5) * 0.0012;
    const driftLng = (Math.random() - 0.5) * 0.0012;

    return {
      ...base,
      latitude: base.latitude + driftLat,
      longitude: base.longitude + driftLng,
      timestamp: Date.now(),
    };
  },
};

export function useLiveLocation(batchId: string, refreshIntervalMs: number = 5000) {
  const [telemetry, setTelemetry] = useState<LocationTelemetry>(() =>
    locationService.getLiveLocation(batchId)
  );

  useEffect(() => {
    setTelemetry(locationService.getLiveLocation(batchId));

    const interval = setInterval(() => {
      setTelemetry(locationService.getLiveLocation(batchId));
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [batchId, refreshIntervalMs]);

  return telemetry;
}
