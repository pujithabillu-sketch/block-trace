export type ProvenanceEventType =
  | 'BATCH_CREATION'
  | 'MANUFACTURING'
  | 'TEMPERATURE_VERIFICATION'
  | 'CUSTODY_TRANSFER'
  | 'WAREHOUSE_STORAGE'
  | 'COLD_STORAGE_VERIFICATION'
  | 'SHIPMENT_CHECKPOINT'
  | 'DELIVERY';

export interface StorageLocationSpec {
  zone: string;
  rack: string;
  shelf: string;
  bin: string;
}

export interface ProvenanceEventRecord {
  id: string;
  batchId: string;
  eventType: ProvenanceEventType;
  custodian: string;
  custodianRole: string;
  latitude: number;
  longitude: number;
  facility: string;
  storageLocation: StorageLocationSpec;
  sensorId?: string;
  temperature?: number;
  timestamp: number;
  transactionId: string;
  network: string;
  status: string;
}

export const INITIAL_PROVENANCE_EVENTS: ProvenanceEventRecord[] = [
  {
    id: 'EVT-1001',
    batchId: 'BATCH-2026-001',
    eventType: 'COLD_STORAGE_VERIFICATION',
    custodian: 'SubZero Cold Chain Storage',
    custodianRole: 'COLD_STORAGE',
    latitude: 16.5071,
    longitude: 80.6491,
    facility: 'Cold Storage Facility CS01',
    storageLocation: {
      zone: 'COLD-ZONE-02',
      rack: 'COLD-RACK-07',
      shelf: 'SHELF-03',
      bin: 'BIN-C12',
    },
    sensorId: 'TEMP-IOT-0042',
    temperature: 3.8,
    timestamp: Date.now() - 1000 * 60 * 30,
    transactionId: 'TX-ALGO-COLD-9901-4482',
    network: 'Algorand LocalNet ARC-4',
    status: 'VERIFIED',
  },
  {
    id: 'EVT-1002',
    batchId: 'PROD-RICE-0001',
    eventType: 'MANUFACTURING',
    custodian: 'Apex Global Agri & Manufacturing Ltd.',
    custodianRole: 'MANUFACTURER',
    latitude: 16.5062,
    longitude: 80.648,
    facility: 'Guntur Agriculture Processing Facility',
    storageLocation: {
      zone: 'ZONE-A1',
      rack: 'RACK-02',
      shelf: 'SHELF-01',
      bin: 'BIN-08',
    },
    sensorId: 'TEMP-IOT-8812',
    temperature: 24.5,
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    transactionId: 'TX-ALGO-MNF-1048-8821',
    network: 'Algorand LocalNet ARC-4',
    status: 'COMPLETED',
  },
  {
    id: 'EVT-1003',
    batchId: 'PROD-100001',
    eventType: 'WAREHOUSE_STORAGE',
    custodian: 'Central Storage & Logistics Hub A',
    custodianRole: 'WAREHOUSE',
    latitude: 16.5124,
    longitude: 80.6399,
    facility: 'Central Logistics Facility W01',
    storageLocation: {
      zone: 'ZONE-W1',
      rack: 'RACK-04',
      shelf: 'SHELF-B',
      bin: 'BIN-12',
    },
    sensorId: 'SENS-WHS-01',
    temperature: 18.5,
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    transactionId: 'TX-ALGO-WHS-8821-0012',
    network: 'Algorand LocalNet ARC-4',
    status: 'STORED',
  },
];

export const blockchainEventService = {
  recordEvent(eventData: Omit<ProvenanceEventRecord, 'id' | 'transactionId' | 'network'>): ProvenanceEventRecord {
    const txId =
      'TX-ALGO-' +
      eventData.eventType.substring(0, 4) +
      '-' +
      Math.random().toString(36).substring(2, 8).toUpperCase() +
      '-' +
      Math.floor(1000 + Math.random() * 9000);

    return {
      ...eventData,
      id: 'EVT-' + Math.floor(10000 + Math.random() * 90000),
      transactionId: txId,
      network: 'Algorand LocalNet ARC-4',
    };
  },
};
