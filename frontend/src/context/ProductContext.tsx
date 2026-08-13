import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ProductRecord, HistoryEvent, ProductStatus, UserRole, CounterfeitReport, RecallRecord, ParticipantInfo } from '../types';
import { api } from '../services/api';

interface ProductContextType {
  products: ProductRecord[];
  historyEvents: HistoryEvent[];
  counterfeitReports: CounterfeitReport[];
  recalledProducts: RecallRecord[];
  participants: ParticipantInfo[];
  stats: {
    totalProducts: number;
    verifiedCount: number;
    inTransitCount: number;
    suspiciousCount: number;
    recalledCount: number;
  };
  registerProductOnChain: (
    productId: string,
    batchId: string,
    metadataHash: string,
    manufacturerAddress: string,
    name?: string,
    category?: string
  ) => Promise<{ success: boolean; txId: string; error?: string }>;
  transferProductOnChain: (
    productId: string,
    recipientAddress: string,
    recipientRole: UserRole,
    transferHash?: string
  ) => Promise<{ success: boolean; txId: string; error?: string }>;
  receiveProductOnChain: (
    productId: string,
    recipientAddress: string
  ) => Promise<{ success: boolean; txId: string; error?: string }>;
  reportCounterfeitOnChain: (
    productId: string,
    reportHash: string,
    details: string,
    reporterAddress: string
  ) => Promise<{ success: boolean; txId: string; error?: string }>;
  recallProductOnChain: (
    productId: string,
    reason: string,
    callerAddress: string,
    callerRole: UserRole
  ) => Promise<{ success: boolean; txId: string; error?: string }>;
  authorizeParticipantOnChain: (
    address: string,
    name: string,
    role: UserRole,
    callerRole: UserRole
  ) => Promise<{ success: boolean; txId: string; error?: string }>;
  revokeParticipantOnChain: (
    address: string,
    callerRole: UserRole
  ) => Promise<{ success: boolean; txId: string; error?: string }>;
  getProductById: (productId: string) => ProductRecord | undefined;
  getProductHistory: (productId: string) => HistoryEvent[];
  updateStatus: (productId: string, newStatus: ProductStatus) => void;
}

const INITIAL_PRODUCTS: ProductRecord[] = [
  // 1. FOOD & PERISHABLES
  {
    productId: 'PROD-RICE-0001',
    batchId: 'RICE-BATCH-001',
    metadataHash: 'sha256:f47a9b01c3848a9203910c2834b9281a839e0129c9103847291a039281b9384e',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    pendingRecipient: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    pendingRecipientRole: 'DISTRIBUTOR',
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 5,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 1,
    currentStatus: 'IN_TRANSIT',
    productExists: true,
    recalled: false,
    counterfeitReported: false,
    name: 'Premium Basmati Rice Grains',
    category: 'Food & Perishables',
    mfgDate: '2026-08-12',
    origin: 'Andhra Pradesh, India',
    quantity: 500,
    unit: 'Bags (25kg)',
    farmSource: 'Andhra Agro Organic Rice Fields, Unit 12',
    farmerId: 'FARM-8801-AP',
    farmerName: 'Rao Organic Agro Farms',
    farmerWallet: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    farmerCert: 'FSSAI-ORGANIC-RICE-2026',
    farmerLocationGps: '16.5062° N, 80.6480° E',
    processingFacility: 'Andhra Agro Milling & Packaging Plant',
    qualityCert: 'FSSAI-ORGANIC-RICE-2026',
    ingredients: '100% Long Grain Premium Basmati Rice',
    allergens: 'None',
    description: 'Export-grade long grain Premium Basmati Rice harvested in Andhra Pradesh, India.'
  },
  {
    productId: 'PROD-100001',
    batchId: 'BATCH-AVO-001',
    metadataHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    pendingRecipient: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    pendingRecipientRole: 'WAREHOUSE',
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 4,
    currentStatus: 'IN_TRANSIT',
    productExists: true,
    recalled: false,
    counterfeitReported: false,
    name: 'Organic Hass Avocados',
    category: 'Food & Perishables',
    mfgDate: '2026-08-10',
    origin: 'California, USA',
    quantity: 1200,
    unit: 'Boxes (10kg)',
    farmSource: 'Green Valley Organic Orchards, Sector 4',
    farmerId: 'FARM-332-CA',
    farmerName: 'Green Valley Orchards',
    farmerWallet: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    farmerCert: 'USDA-ORGANIC-AVO-2026',
    farmerLocationGps: '37.7749° N, 122.4194° W',
    processingFacility: 'Green Valley Cold Pack Center',
    qualityCert: 'USDA-ORGANIC-AVO-2026',
    ingredients: '100% Fresh Organic Hass Avocados',
    allergens: 'None',
    coldChainStatus: 'OPTIMAL',
    storageTemp: '4.2°C',
    description: 'Fresh organic Hass Avocados harvested at peak ripeness under cold-chain monitoring.'
  },
  {
    productId: 'PROD-WHEAT-103',
    batchId: 'WHEAT-BATCH-77',
    metadataHash: 'sha256:889102948c019284019284019284019284019284019284019284019284019284',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    pendingRecipient: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    pendingRecipientRole: 'RETAILER',
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 48,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 6,
    currentStatus: 'AT_WAREHOUSE',
    productExists: true,
    recalled: false,
    counterfeitReported: false,
    name: 'Golden Harvest Organic Wheat Grains',
    category: 'Food & Perishables',
    mfgDate: '2026-08-08',
    origin: 'Punjab Grain Belt, India',
    quantity: 800,
    unit: 'Bags (50kg)',
    farmSource: 'Golden Grain Organic Fields',
    farmerId: 'FARM-990-PB',
    farmerName: 'Golden Grain Farm Co-op',
    farmerWallet: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    farmerCert: 'FSSAI-GOLDEN-WHEAT-2026',
    farmerLocationGps: '30.9010° N, 75.8573° E',
    qualityCert: 'FSSAI-GOLDEN-WHEAT-2026',
    description: 'Triple-sifted organic whole wheat grains harvested from Punjab fertile plains.'
  },

  // 2. ELECTRONICS & TECH
  {
    productId: 'PROD-ELEC-201',
    batchId: 'BATCH-CHIP-300',
    metadataHash: 'sha256:77a102948c901a8b9201948c201948201948c019284019284019284019284019',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    pendingRecipient: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    pendingRecipientRole: 'RETAILER',
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 48,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 12,
    currentStatus: 'AT_WAREHOUSE',
    productExists: true,
    recalled: false,
    counterfeitReported: false,
    name: 'NextGen 3nm Microprocessor Chipset',
    category: 'Electronics & Tech',
    mfgDate: '2026-08-01',
    origin: 'Hsinchu Science Park, Taiwan',
    quantity: 5000,
    unit: 'Tray Units',
    qualityCert: 'ISO-9001-SEMICONDUCTOR',
    description: 'Ultra-low-power 3nm Neural Processor Unit engineered for enterprise Web3 hardware acceleration.'
  },
  {
    productId: 'PROD-ELEC-202',
    batchId: 'BATCH-IOT-109',
    metadataHash: 'sha256:b102948c019284019284019284019284019284019284019284019284019284019',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    pendingRecipient: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    pendingRecipientRole: 'WAREHOUSE',
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 20,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 2,
    currentStatus: 'IN_TRANSIT',
    productExists: true,
    recalled: false,
    counterfeitReported: false,
    name: 'IoT Smart Temperature Telemetry Sensor Pod',
    category: 'Electronics & Tech',
    mfgDate: '2026-08-09',
    origin: 'Shenzhen Tech Hub, China',
    quantity: 1500,
    unit: 'Units',
    qualityCert: 'CE-FCC-IOT-2026',
    description: 'Calibrated wireless cellular IoT temperature and humidity sensor pod with BLE mesh.'
  },

  // 3. PHARMACEUTICALS & HEALTH
  {
    productId: 'PROD-PHARM-301',
    batchId: 'BATCH-VAC-770',
    metadataHash: 'sha256:990184c019284019284019284019284019284019284019284019284019284019',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    pendingRecipient: '',
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 72,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 24,
    currentStatus: 'AT_WAREHOUSE',
    productExists: true,
    recalled: false,
    counterfeitReported: false,
    name: 'Ultra-Cold mRNA Vaccine Vials (100ml)',
    category: 'Pharmaceuticals & Health',
    mfgDate: '2026-08-05',
    origin: 'Mainz BioTech Facility, Germany',
    quantity: 2500,
    unit: 'Vial Trays',
    coldChainStatus: 'OPTIMAL',
    storageTemp: '-70.5°C',
    qualityCert: 'EMA-GMP-CRITICAL-HEALTH-2026',
    description: 'Ultra-cold thermal-controlled mRNA vaccine batches tracked with real-time temperature logs.'
  },
  {
    productId: 'PROD-PHARM-302',
    batchId: 'BATCH-INS-404',
    metadataHash: 'sha256:c102948c019284019284019284019284019284019284019284019284019284019',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    pendingRecipient: '',
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 36,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 4,
    currentStatus: 'AT_RETAILER',
    productExists: true,
    recalled: false,
    counterfeitReported: false,
    name: 'Insulin Glargine Cold Injection Pen Cartridges',
    category: 'Pharmaceuticals & Health',
    mfgDate: '2026-08-07',
    origin: 'Copenhagen Pharma Labs, Denmark',
    quantity: 4000,
    unit: 'Packs (5 Pens)',
    coldChainStatus: 'OPTIMAL',
    storageTemp: '3.8°C',
    qualityCert: 'FDA-GMP-PHARM-2026',
    description: 'Human insulin recombinant injection pens verified under 2-8°C cold storage compliance.'
  },

  // 4. LUXURY GOODS & APPAREL
  {
    productId: 'PROD-LUX-401',
    batchId: 'BATCH-WTCH-88',
    metadataHash: 'sha256:a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    pendingRecipient: '',
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 120,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 6,
    currentStatus: 'AT_RETAILER',
    productExists: true,
    recalled: false,
    counterfeitReported: false,
    name: 'Chronograph Precision Tourbillon Watch',
    category: 'Luxury Goods & Apparel',
    mfgDate: '2026-07-25',
    origin: 'Geneva Horology Atelier, Switzerland',
    quantity: 25,
    unit: 'Serial Units',
    qualityCert: 'COSC-SWISS-CHRONOMETER',
    description: 'Masterwork hand-assembled Tourbillon timepiece with embedded ARC-4 physical NFC chip tag.'
  },
  {
    productId: 'PROD-LUX-402',
    batchId: 'BATCH-BAG-202',
    metadataHash: 'sha256:d102948c019284019284019284019284019284019284019284019284019284019',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    pendingRecipient: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    pendingRecipientRole: 'DISTRIBUTOR',
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 14,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 1,
    currentStatus: 'REGISTERED',
    productExists: true,
    recalled: false,
    counterfeitReported: false,
    name: 'Italian Handcrafted Calfskin Leather Tote Bag',
    category: 'Luxury Goods & Apparel',
    mfgDate: '2026-08-11',
    origin: 'Florence Leather Crafts, Italy',
    quantity: 150,
    unit: 'Units',
    qualityCert: 'ITALIAN-LEATHER-VERIFIED-2026',
    description: 'Full-grain Italian calfskin leather tote bag authenticated with tamper-evident Algorand NFT metadata.'
  },

  // 5. RAW MATERIALS & MINERALS
  {
    productId: 'PROD-RAW-501',
    batchId: 'BATCH-LITH-900',
    metadataHash: 'sha256:c019284019284019284019284019284019284019284019284019284019284019',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    pendingRecipient: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    pendingRecipientRole: 'DISTRIBUTOR',
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 30,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 2,
    currentStatus: 'REGISTERED',
    productExists: true,
    recalled: false,
    counterfeitReported: false,
    name: 'Battery Grade Lithium Carbonate 99.5%',
    category: 'Raw Materials & Minerals',
    mfgDate: '2026-08-08',
    origin: 'Atacama Refining Works, Chile',
    quantity: 40,
    unit: 'Metric Tons',
    qualityCert: 'ISO-14001-SUSTAINABLE-MINING',
    description: 'High-purity refined lithium carbonate for EV battery cell gigafactories.'
  },
  {
    productId: 'PROD-RAW-502',
    batchId: 'BATCH-COPPER-11',
    metadataHash: 'sha256:e102948c019284019284019284019284019284019284019284019284019284019',
    manufacturer: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    currentHolder: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    pendingRecipient: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    pendingRecipientRole: 'WAREHOUSE',
    creationTimestamp: Date.now() - 1000 * 60 * 60 * 50,
    lastUpdateTimestamp: Date.now() - 1000 * 60 * 60 * 5,
    currentStatus: 'IN_TRANSIT',
    productExists: true,
    recalled: false,
    counterfeitReported: false,
    name: 'Industrial Grade A Copper Cathode Sheets',
    category: 'Raw Materials & Minerals',
    mfgDate: '2026-08-06',
    origin: 'Zambia Copper Smelter, Lusaka',
    quantity: 120,
    unit: 'Bundles (2.5 T)',
    qualityCert: 'LME-REGISTERED-COPPER-2026',
    description: 'London Metal Exchange (LME) registered 99.99% high-purity electrolytic copper cathodes.'
  }
];

const INITIAL_HISTORY: HistoryEvent[] = [
  {
    productId: 'PROD-RICE-0001',
    previousHolder: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    newHolder: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    eventType: 'PRODUCT_REGISTERED',
    status: 'REGISTERED',
    txId: 'TX-RICE-REG-99101A'
  },
  {
    productId: 'PROD-RICE-0001',
    previousHolder: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    newHolder: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    timestamp: Date.now() - 1000 * 60 * 60 * 1,
    eventType: 'TRANSFER_INITIATED',
    status: 'IN_TRANSIT',
    txId: 'TX-RICE-TRF-88202B'
  }
];

const INITIAL_COUNTERFEIT_REPORTS: CounterfeitReport[] = [];

const INITIAL_RECALLED_PRODUCTS: RecallRecord[] = [];

const INITIAL_PARTICIPANTS: ParticipantInfo[] = [
  {
    address: 'ADMIN7X9K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8',
    name: 'BlockTrace System Admin',
    role: 'ADMIN',
    isAuthorized: true,
    joinedTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    address: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    name: 'Andhra Agro Foods',
    role: 'MANUFACTURER',
    isAuthorized: true,
    joinedTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
  {
    address: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    name: 'Global Logistics Corp',
    role: 'DISTRIBUTOR',
    isAuthorized: true,
    joinedTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 15,
  },
  {
    address: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    name: 'Central Logistics Hub A',
    role: 'WAREHOUSE',
    isAuthorized: true,
    joinedTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    address: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    name: 'Retail Organics Store',
    role: 'RETAILER',
    isAuthorized: true,
    joinedTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
];

const generateTxId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let randomTx = 'TX';
  for (let i = 0; i < 50; i++) {
    randomTx += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomTx;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductRecord[]>(INITIAL_PRODUCTS);
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>(INITIAL_HISTORY);
  const [counterfeitReports, setCounterfeitReports] = useState<CounterfeitReport[]>(INITIAL_COUNTERFEIT_REPORTS);
  const [recalledProducts, setRecalledProducts] = useState<RecallRecord[]>(INITIAL_RECALLED_PRODUCTS);
  const [participants, setParticipants] = useState<ParticipantInfo[]>(INITIAL_PARTICIPANTS);

  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const prodRes = await api.getProducts();
        if (prodRes.success && Array.isArray(prodRes.products) && prodRes.products.length > 0) {
          setProducts(prodRes.products.map((p: any) => ({
            ...p,
            productExists: true,
          })));
        }

        const txRes = await api.getTransactions();
        if (txRes.success && Array.isArray(txRes.transactions) && txRes.transactions.length > 0) {
          setHistoryEvents(txRes.transactions.map((t: any) => ({
            productId: t.productId,
            previousHolder: t.previousHolder,
            newHolder: t.newHolder,
            timestamp: t.timestamp,
            eventType: t.eventType || t.action,
            status: t.status,
            txId: t.txId,
          })));
        }

        const partRes = await api.getParticipants();
        if (partRes.success && Array.isArray(partRes.participants) && partRes.participants.length > 0) {
          setParticipants(partRes.participants.map((p: any) => ({
            address: p.address,
            name: p.name,
            role: p.role,
            isAuthorized: p.isAuthorized,
            joinedTimestamp: p.authorizedDate ? new Date(p.authorizedDate).getTime() : Date.now(),
          })));
        }

        const recallRes = await api.getRecalls();
        if (recallRes.success && Array.isArray(recallRes.recalls) && recallRes.recalls.length > 0) {
          setRecalledProducts(recallRes.recalls.map((r: any) => ({
            productId: r.productId,
            batchId: r.batchId,
            manufacturer: r.manufacturer,
            currentHolder: r.currentHolder,
            recalledAt: r.recalledAt,
            recalledBy: r.recalledBy,
            reason: r.reason,
          })));
        }
      } catch (err) {
        console.warn('Backend sync deferred to offline state:', err);
      }
    };

    syncWithBackend();
  }, []);

  const getProductById = (productId: string) => {
    return products.find((p) => p.productId.toUpperCase() === productId.toUpperCase());
  };

  const getProductHistory = (productId: string) => {
    return historyEvents.filter((e) => e.productId.toUpperCase() === productId.toUpperCase());
  };

  const registerProductOnChain = async (
    productId: string,
    batchId: string,
    metadataHash: string,
    manufacturerAddress: string,
    name?: string,
    category?: string
  ): Promise<{ success: boolean; txId: string; error?: string }> => {
    const existing = products.find((p) => p.productId.toUpperCase() === productId.toUpperCase());
    if (existing) {
      return {
        success: false,
        txId: '',
        error: `Product ID "${productId}" is already registered in Box Map storage.`,
      };
    }

    const randomTx = generateTxId();
    const now = Date.now();

    const newProduct: ProductRecord = {
      productId: productId.toUpperCase(),
      batchId: batchId.toUpperCase(),
      metadataHash,
      manufacturer: manufacturerAddress,
      currentHolder: manufacturerAddress,
      pendingRecipient: '',
      creationTimestamp: now,
      lastUpdateTimestamp: now,
      currentStatus: 'REGISTERED',
      productExists: true,
      recalled: false,
      counterfeitReported: false,
      name: name || `Product ${productId.toUpperCase()}`,
      category: category || 'General Pharmaceuticals',
    };

    const newEvent: HistoryEvent = {
      productId: productId.toUpperCase(),
      previousHolder: manufacturerAddress,
      newHolder: manufacturerAddress,
      timestamp: now,
      eventType: 'PRODUCT_REGISTERED',
      status: 'REGISTERED',
      txId: randomTx,
    };

    // Dispatch API request to Express backend
    api.registerProduct({
      name: name || `Product ${productId.toUpperCase()}`,
      batchId: batchId.toUpperCase(),
      category,
      manufacturer: manufacturerAddress,
      description: `Registered product ${productId}`
    }).catch(err => console.warn('Backend API async log failed:', err));

    setProducts((prev) => [newProduct, ...prev]);
    setHistoryEvents((prev) => [newEvent, ...prev]);

    return { success: true, txId: randomTx };
  };

  const transferProductOnChain = async (
    productId: string,
    recipientAddress: string,
    recipientRole: UserRole,
    _transferHash?: string
  ): Promise<{ success: boolean; txId: string; error?: string }> => {
    const target = products.find((p) => p.productId.toUpperCase() === productId.toUpperCase());
    if (!target) {
      return { success: false, txId: '', error: `Product ID "${productId}" not found.` };
    }

    if (target.recalled) {
      return { success: false, txId: '', error: 'Cannot transfer recalled product. Smart contract permanently locks transfer.' };
    }
    if (target.counterfeitReported) {
      return { success: false, txId: '', error: 'Cannot transfer counterfeit-reported product.' };
    }
    if (target.currentStatus === 'SOLD') {
      return { success: false, txId: '', error: 'Cannot transfer sold product.' };
    }

    const txId = generateTxId();
    const now = Date.now();

    // Dispatch API request to Express backend
    api.transferProduct(productId, {
      toWallet: recipientAddress,
      recipientRole
    }).catch(err => console.warn('Backend API async transfer log failed:', err));

    setProducts((prev) =>
      prev.map((p) => {
        if (p.productId.toUpperCase() === productId.toUpperCase()) {
          return {
            ...p,
            currentStatus: 'IN_TRANSIT',
            pendingRecipient: recipientAddress,
            pendingRecipientRole: recipientRole,
            lastUpdateTimestamp: now,
          };
        }
        return p;
      })
    );

    const newEvent: HistoryEvent = {
      productId: productId.toUpperCase(),
      previousHolder: target.currentHolder,
      newHolder: recipientAddress,
      timestamp: now,
      eventType: 'TRANSFER_INITIATED',
      status: 'IN_TRANSIT',
      txId,
    };

    setHistoryEvents((prev) => [newEvent, ...prev]);

    return { success: true, txId };
  };

  const receiveProductOnChain = async (
    productId: string,
    recipientAddress: string
  ): Promise<{ success: boolean; txId: string; error?: string }> => {
    const target = products.find((p) => p.productId.toUpperCase() === productId.toUpperCase());
    if (!target) {
      return { success: false, txId: '', error: `Product ID "${productId}" not found.` };
    }

    // Smart contract address verification: recipient address must match expected pending recipient (or admin override)
    if (
      target.pendingRecipient &&
      target.pendingRecipient.toUpperCase() !== recipientAddress.toUpperCase() &&
      recipientAddress.toUpperCase() !== 'ADMIN7X9K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8'
    ) {
      return {
        success: false,
        txId: '',
        error: `Smart Contract Rejection: Active wallet (${recipientAddress.substring(0, 8)}...) is not designated pending recipient (${target.pendingRecipient.substring(0, 8)}...).`,
      };
    }

    const txId = generateTxId();
    const now = Date.now();

    // Dispatch API request to Express backend
    api.receiveProduct(productId, {
      receiverWallet: recipientAddress
    }).catch(err => console.warn('Backend API async receive log failed:', err));

    let nextStatus: ProductStatus = 'AT_DISTRIBUTOR';
    const role = target.pendingRecipientRole || participants.find(p => p.address.toUpperCase() === recipientAddress.toUpperCase())?.role;
    if (role === 'WAREHOUSE') {
      nextStatus = 'AT_WAREHOUSE';
    } else if (role === 'RETAILER') {
      nextStatus = 'AT_RETAILER';
    } else {
      nextStatus = 'AT_DISTRIBUTOR';
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.productId.toUpperCase() === productId.toUpperCase()) {
          return {
            ...p,
            currentHolder: recipientAddress,
            pendingRecipient: '',
            pendingRecipientRole: undefined,
            currentStatus: nextStatus,
            lastUpdateTimestamp: now,
          };
        }
        return p;
      })
    );

    const newEvent: HistoryEvent = {
      productId: productId.toUpperCase(),
      previousHolder: target.currentHolder,
      newHolder: recipientAddress,
      timestamp: now,
      eventType: 'RECEIPT_CONFIRMED',
      status: nextStatus,
      txId,
    };

    setHistoryEvents((prev) => [newEvent, ...prev]);

    return { success: true, txId };
  };

  const reportCounterfeitOnChain = async (
    productId: string,
    reportHash: string,
    details: string,
    reporterAddress: string
  ): Promise<{ success: boolean; txId: string; error?: string }> => {
    const pId = productId.trim().toUpperCase();
    const target = products.find((p) => p.productId.toUpperCase() === pId);
    if (!target) {
      return {
        success: false,
        txId: '',
        error: `Product ID "${productId}" not found in Box Map storage.`,
      };
    }

    const txId = generateTxId();
    const now = Date.now();

    const newReport: CounterfeitReport = {
      id: `RPT-${String(counterfeitReports.length + 1).padStart(3, '0')}`,
      productId: pId,
      reporterAddress: reporterAddress || 'UNKNOWN',
      reportHash: reportHash.trim(),
      timestamp: now,
      details: details.trim() || 'Suspicious counterfeit product reported on-chain.',
      status: 'CONFIRMED_COUNTERFEIT',
    };

    setCounterfeitReports((prev) => [newReport, ...prev]);
    setProducts((prev) =>
      prev.map((p) =>
        p.productId.toUpperCase() === pId
          ? { ...p, currentStatus: 'COUNTERFEIT_REPORTED', counterfeitReported: true, lastUpdateTimestamp: now }
          : p
      )
    );

    setHistoryEvents((prev) => [
      {
        productId: pId,
        previousHolder: target.currentHolder,
        newHolder: target.currentHolder,
        timestamp: now,
        eventType: 'COUNTERFEIT_REPORTED',
        status: 'COUNTERFEIT_REPORTED',
        txId,
      },
      ...prev,
    ]);

    return { success: true, txId };
  };

  const recallProductOnChain = async (
    productId: string,
    reason: string,
    callerAddress: string,
    callerRole: UserRole
  ): Promise<{ success: boolean; txId: string; error?: string }> => {
    if (callerRole !== 'ADMIN' && callerRole !== 'MANUFACTURER') {
      return {
        success: false,
        txId: '',
        error: 'Smart Contract Rejection: Only ADMIN or MANUFACTURER accounts are authorized to issue product recalls.',
      };
    }

    const pId = productId.trim().toUpperCase();
    const target = products.find((p) => p.productId.toUpperCase() === pId);
    if (!target) {
      return {
        success: false,
        txId: '',
        error: `Product ID "${productId}" not found in Box Map storage.`,
      };
    }

    if (target.recalled) {
      return {
        success: false,
        txId: '',
        error: `Product "${productId}" is already recalled on-chain.`,
      };
    }

    const txId = generateTxId();
    const now = Date.now();

    const recallRecord: RecallRecord = {
      productId: pId,
      batchId: target.batchId,
      manufacturer: target.manufacturer,
      currentHolder: target.currentHolder,
      recalledAt: now,
      recalledBy: callerAddress,
      reason: reason.trim() || 'Emergency safety recall issued via recall_product() on Algorand.',
    };

    setRecalledProducts((prev) => [recallRecord, ...prev]);
    setProducts((prev) =>
      prev.map((p) =>
        p.productId.toUpperCase() === pId
          ? { ...p, currentStatus: 'RECALLED', recalled: true, lastUpdateTimestamp: now }
          : p
      )
    );

    setHistoryEvents((prev) => [
      {
        productId: pId,
        previousHolder: target.currentHolder,
        newHolder: target.currentHolder,
        timestamp: now,
        eventType: 'PRODUCT_RECALLED',
        status: 'RECALLED',
        txId,
      },
      ...prev,
    ]);

    return { success: true, txId };
  };

  const authorizeParticipantOnChain = async (
    address: string,
    name: string,
    role: UserRole,
    callerRole: UserRole
  ): Promise<{ success: boolean; txId: string; error?: string }> => {
    if (callerRole !== 'ADMIN') {
      return {
        success: false,
        txId: '',
        error: 'Smart Contract Rejection: Only contract ADMIN can execute authorize_participant().',
      };
    }

    const addr = address.trim();
    const existing = participants.find((p) => p.address.toLowerCase() === addr.toLowerCase());
    if (existing && existing.isAuthorized) {
      return {
        success: false,
        txId: '',
        error: 'Participant address is already authorized.',
      };
    }

    const txId = generateTxId();
    const now = Date.now();

    const updatedP: ParticipantInfo = {
      address: addr,
      name: name.trim() || 'Authorized Participant',
      role,
      isAuthorized: true,
      joinedTimestamp: now,
    };

    setParticipants((prev) => {
      const filtered = prev.filter((p) => p.address.toLowerCase() !== addr.toLowerCase());
      return [...filtered, updatedP];
    });

    return { success: true, txId };
  };

  const revokeParticipantOnChain = async (
    address: string,
    callerRole: UserRole
  ): Promise<{ success: boolean; txId: string; error?: string }> => {
    if (callerRole !== 'ADMIN') {
      return {
        success: false,
        txId: '',
        error: 'Smart Contract Rejection: Only contract ADMIN can execute revoke_participant().',
      };
    }

    const addr = address.trim();
    const target = participants.find((p) => p.address.toLowerCase() === addr.toLowerCase());
    if (!target) {
      return {
        success: false,
        txId: '',
        error: 'Participant not found in registry.',
      };
    }

    const txId = generateTxId();

    setParticipants((prev) =>
      prev.map((p) =>
        p.address.toLowerCase() === addr.toLowerCase()
          ? { ...p, isAuthorized: false, role: 'UNAUTHORIZED' as UserRole }
          : p
      )
    );

    return { success: true, txId };
  };

  const updateStatus = (productId: string, newStatus: ProductStatus) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.productId.toUpperCase() === productId.toUpperCase()) {
          const isRecalled = newStatus === 'RECALLED' || p.recalled;
          const isCounterfeit = newStatus === 'COUNTERFEIT_REPORTED' || p.counterfeitReported;
          return {
            ...p,
            currentStatus: newStatus,
            recalled: isRecalled,
            counterfeitReported: isCounterfeit,
            lastUpdateTimestamp: Date.now(),
          };
        }
        return p;
      })
    );
  };

  const totalProducts = products.length;
  const verifiedCount = products.filter((p) => !p.recalled && !p.counterfeitReported).length;
  const inTransitCount = products.filter((p) => p.currentStatus === 'IN_TRANSIT').length;
  const suspiciousCount = products.filter((p) => p.counterfeitReported).length;
  const recalledCount = products.filter((p) => p.recalled).length;

  return (
    <ProductContext.Provider
      value={{
        products,
        historyEvents,
        counterfeitReports,
        recalledProducts,
        participants,
        stats: {
          totalProducts,
          verifiedCount,
          inTransitCount,
          suspiciousCount,
          recalledCount,
        },
        registerProductOnChain,
        transferProductOnChain,
        receiveProductOnChain,
        reportCounterfeitOnChain,
        recallProductOnChain,
        authorizeParticipantOnChain,
        revokeParticipantOnChain,
        getProductById,
        getProductHistory,
        updateStatus,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

