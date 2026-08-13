export const INITIAL_USERS = [
  {
    id: 'USR-001',
    address: 'ADMIN7X9K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8',
    name: 'BlockTrace System Admin',
    email: 'admin@blocktrace.io',
    role: 'ADMIN',
    balanceAlgo: 1450.5
  },
  {
    id: 'USR-002',
    address: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    name: 'Apex Pharma Manufacturing Ltd.',
    email: 'manufacturer@apexpharma.com',
    role: 'MANUFACTURER',
    balanceAlgo: 820.0
  },
  {
    id: 'USR-003',
    address: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    name: 'Global Freight Distributors',
    email: 'logistics@globalfreight.com',
    role: 'DISTRIBUTOR',
    balanceAlgo: 340.2
  },
  {
    id: 'USR-004',
    address: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    name: 'Central Logistics Hub A',
    email: 'warehouse@centralhub.com',
    role: 'WAREHOUSE',
    balanceAlgo: 190.8
  },
  {
    id: 'USR-005',
    address: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    name: 'MediCare Retail Pharmacy',
    email: 'retail@medicare.com',
    role: 'RETAILER',
    balanceAlgo: 115.4
  }
];

export const INITIAL_PRODUCTS = [
  {
    productId: 'PROD-100001',
    name: 'Apex Vaccine Dose Pack A',
    sku: 'SKU-VAC-101',
    batchId: 'BATCH-2026-001',
    category: 'Pharmaceuticals',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    pendingRecipient: '',
    mfgDate: '2026-01-10',
    expiryDate: '2027-01-10',
    quantity: 500,
    unit: 'Boxes',
    description: 'High-purity cold chain temperature verified vaccine doses.',
    metadataHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    assetId: 50912401,
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 2,
    currentStatus: 'AT_DISTRIBUTOR',
    recalled: false,
    counterfeitReported: false
  },
  {
    productId: 'PROD-100002',
    name: 'Cardiac Stent Kit Rev3',
    sku: 'SKU-MED-202',
    batchId: 'BATCH-2026-002',
    category: 'Medical Devices',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'ADMIN7X9K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8',
    pendingRecipient: '',
    mfgDate: '2026-02-01',
    expiryDate: '2028-02-01',
    quantity: 100,
    unit: 'Kits',
    description: 'Precision cardiovascular surgical implant kit.',
    metadataHash: 'sha256:a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
    assetId: 50912402,
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 12,
    currentStatus: 'RECALLED',
    recalled: true,
    counterfeitReported: false
  },
  {
    productId: 'PROD-100003',
    name: 'Antibiotic Injection 500mg',
    sku: 'SKU-ANT-303',
    batchId: 'BATCH-2026-003',
    category: 'Pharmaceuticals',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    pendingRecipient: '',
    mfgDate: '2026-01-20',
    expiryDate: '2027-06-20',
    quantity: 1000,
    unit: 'Vials',
    description: 'Sterile injectable antibiotic 500mg vial pack.',
    metadataHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284add200146d909cb',
    assetId: 50912403,
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 45,
    currentStatus: 'COUNTERFEIT_REPORTED',
    recalled: false,
    counterfeitReported: true
  },
  {
    productId: 'PROD-100004',
    name: 'Surgical Gloves Box 100x',
    sku: 'SKU-SUP-404',
    batchId: 'BATCH-2026-004',
    category: 'Medical Supplies',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    pendingRecipient: '',
    mfgDate: '2025-12-15',
    expiryDate: '2028-12-15',
    quantity: 2500,
    unit: 'Boxes',
    description: 'Powder-free sterile latex medical examination gloves.',
    metadataHash: 'sha256:6037847c21626c85a1764b623846c9b22e39f4560815a516645a748997a0668d',
    assetId: 50912404,
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 12,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 4,
    currentStatus: 'AT_RETAILER',
    recalled: false,
    counterfeitReported: false
  },
  {
    productId: 'PROD-100005',
    name: 'Insulin Pen Injector 3ml',
    sku: 'SKU-INS-505',
    batchId: 'BATCH-2026-005',
    category: 'Pharmaceuticals',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    pendingRecipient: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    mfgDate: '2026-02-05',
    expiryDate: '2027-08-05',
    quantity: 300,
    unit: 'Units',
    description: 'Pre-filled insulin cartridge delivery pen.',
    metadataHash: 'sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    assetId: 50912405,
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 1,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 1,
    currentStatus: 'IN_TRANSIT',
    recalled: false,
    counterfeitReported: false
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    txId: 'TX5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5',
    productId: 'PROD-100005',
    action: 'PRODUCT_TRANSFERRED',
    previousHolder: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    newHolder: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    blockRound: 8940123,
    timestamp: Date.now() - 1000 * 60 * 60 * 1,
    eventType: 'TRANSFER_INITIATED',
    status: 'CONFIRMED'
  },
  {
    txId: 'TX7K9M2P4Q6R8S0T2U4V6W8X0Y2Z4A6B8C0D2E4F5G',
    productId: 'PROD-100001',
    action: 'PRODUCT_RECEIVED',
    previousHolder: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    newHolder: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    blockRound: 8940089,
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    eventType: 'RECEIPT_CONFIRMED',
    status: 'CONFIRMED'
  },
  {
    txId: 'TX1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T',
    productId: 'PROD-100003',
    action: 'COUNTERFEIT_REPORTED',
    previousHolder: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    newHolder: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    blockRound: 8940045,
    timestamp: Date.now() - 1000 * 60 * 45,
    eventType: 'COUNTERFEIT_REPORTED',
    status: 'CONFIRMED'
  },
  {
    txId: 'TX9Z8Y7X6W5V4U3T2S1R0Q9P8O7N6M5L4K3J2I1H0G',
    productId: 'PROD-100002',
    action: 'PRODUCT_RECALLED',
    previousHolder: 'ADMIN7X9K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8',
    newHolder: 'ADMIN7X9K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8',
    blockRound: 8939910,
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    eventType: 'PRODUCT_RECALLED',
    status: 'CONFIRMED'
  },
  {
    txId: 'TX3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2',
    productId: 'PROD-100001',
    action: 'PRODUCT_REGISTERED',
    previousHolder: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    newHolder: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    blockRound: 8939800,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    eventType: 'PRODUCT_REGISTERED',
    status: 'CONFIRMED'
  }
];

export const INITIAL_PARTICIPANTS = [
  {
    address: 'ADMIN7X9K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8',
    name: 'BlockTrace System Admin',
    organization: 'BlockTrace Operations',
    role: 'ADMIN',
    isAuthorized: true,
    authorizedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
  },
  {
    address: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    name: 'Apex Pharma Manufacturing Ltd.',
    organization: 'Apex BioPharma Inc.',
    role: 'MANUFACTURER',
    isAuthorized: true,
    authorizedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString()
  },
  {
    address: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    name: 'Global Freight Distributors',
    organization: 'Global Logistics Group',
    role: 'DISTRIBUTOR',
    isAuthorized: true,
    authorizedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString()
  },
  {
    address: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    name: 'Central Logistics Hub A',
    organization: 'Core Storage Vaults',
    role: 'WAREHOUSE',
    isAuthorized: true,
    authorizedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  },
  {
    address: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    name: 'MediCare Retail Pharmacy',
    organization: 'MediCare Health Outlets',
    role: 'RETAILER',
    isAuthorized: true,
    authorizedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  }
];

export const INITIAL_RECALLS = [
  {
    id: 'RCL-001',
    productId: 'PROD-100002',
    batchId: 'BATCH-2026-002',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'ADMIN7X9K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8',
    recalledAt: Date.now() - 1000 * 60 * 60 * 12,
    recalledBy: 'ADMIN7X9K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8',
    reason: 'Safety recall issued via recall_product() on Algorand due to component defect.',
    severity: 'HIGH',
    status: 'RECALLED'
  }
];

export const INITIAL_COUNTERFEIT_REPORTS = [
  {
    id: 'RPT-001',
    productId: 'PROD-100003',
    batchId: 'BATCH-2026-003',
    reporterAddress: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    reportHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284add200146d909cb',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    reason: 'Packaging anomaly',
    details: 'Packaging print quality mismatch and invalid serial font observed at distribution center.',
    status: 'CONFIRMED'
  }
];

class InMemoryStore {
  constructor() {
    this.users = [...INITIAL_USERS];
    this.products = [...INITIAL_PRODUCTS];
    this.transactions = [...INITIAL_TRANSACTIONS];
    this.participants = [...INITIAL_PARTICIPANTS];
    this.recalls = [...INITIAL_RECALLS];
    this.counterfeitReports = [...INITIAL_COUNTERFEIT_REPORTS];
  }

  // Dashboard Stats
  getDashboardStats() {
    return {
      totalProducts: this.products.length,
      activeProducts: this.products.filter(p => !p.recalled && !p.counterfeitReported && p.currentStatus !== 'SOLD').length,
      productsInTransit: this.products.filter(p => p.currentStatus === 'IN_TRANSIT').length,
      deliveredProducts: this.products.filter(p => ['AT_DISTRIBUTOR', 'AT_WAREHOUSE', 'AT_RETAILER', 'SOLD'].includes(p.currentStatus)).length,
      recalledProducts: this.products.filter(p => p.recalled).length,
      authorizedParticipants: this.participants.filter(p => p.isAuthorized).length,
      blockchainTransactions: this.transactions.length,
      counterfeitReports: this.counterfeitReports.length
    };
  }

  // Analytics Charts Data
  getDashboardCharts() {
    return {
      registrationActivity: [
        { label: 'Jan', count: 12 },
        { label: 'Feb', count: 18 },
        { label: 'Mar', count: 25 },
        { label: 'Apr', count: 32 },
        { label: 'May', count: 45 }
      ],
      supplyChainTransactions: [
        { label: 'Mon', count: 4 },
        { label: 'Tue', count: 8 },
        { label: 'Wed', count: 15 },
        { label: 'Thu', count: 12 },
        { label: 'Fri', count: 19 },
        { label: 'Sat', count: 7 },
        { label: 'Sun', count: 5 }
      ],
      statusDistribution: [
        { name: 'At Distributor', value: this.products.filter(p => p.currentStatus === 'AT_DISTRIBUTOR').length },
        { name: 'In Transit', value: this.products.filter(p => p.currentStatus === 'IN_TRANSIT').length },
        { name: 'At Retailer', value: this.products.filter(p => p.currentStatus === 'AT_RETAILER').length },
        { name: 'Recalled', value: this.products.filter(p => p.recalled).length },
        { name: 'Counterfeit Reported', value: this.products.filter(p => p.counterfeitReported).length }
      ],
      counterfeitStats: {
        totalReports: this.counterfeitReports.length,
        pending: this.counterfeitReports.filter(r => r.status === 'PENDING').length,
        investigating: this.counterfeitReports.filter(r => r.status === 'INVESTIGATING').length,
        confirmed: this.counterfeitReports.filter(r => r.status === 'CONFIRMED').length,
        rejected: this.counterfeitReports.filter(r => r.status === 'REJECTED').length
      }
    };
  }
}

export const store = new InMemoryStore();
