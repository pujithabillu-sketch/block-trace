export type NetworkType = 'LocalNet' | 'TestNet' | 'MainNet';

export type UserRole =
  | 'ADMIN'
  | 'MANUFACTURER'
  | 'FOOD_PRODUCER'
  | 'DISTRIBUTOR'
  | 'WAREHOUSE'
  | 'COLD_STORAGE'
  | 'RETAILER'
  | 'CUSTOMER'
  | 'CONSUMER'
  | 'UNAUTHORIZED';

export interface UserAccount {
  address: string;
  name: string;
  email?: string;
  role: UserRole;
  balanceAlgo: number;
}

export type ProductStatus =
  | 'REGISTERED'
  | 'MANUFACTURED'
  | 'IN_TRANSIT'
  | 'AT_DISTRIBUTOR'
  | 'AT_WAREHOUSE'
  | 'AT_RETAILER'
  | 'SOLD'
  | 'RECALLED'
  | 'COUNTERFEIT_REPORTED'
  | 'LOST'
  | 'NOT_FOUND';

export type VerificationState = 'AUTHENTIC' | 'SUSPICIOUS' | 'RECALLED' | 'NOT_FOUND';

export interface ProductRecord {
  productId: string;
  batchId: string;
  metadataHash: string;
  manufacturer: string;
  currentHolder: string;
  pendingRecipient: string;
  creationTimestamp: number;
  lastUpdateTimestamp: number;
  currentStatus: ProductStatus;
  productExists: boolean;
  recalled: boolean;
  counterfeitReported: boolean;
  name?: string;
  description?: string;
  category?: string;
  pendingRecipientRole?: UserRole;
  mfgDate?: string;
  expiryDate?: string;
  origin?: string;
  quantity?: number;
  unit?: string;
  priceInr?: number;
  priceUsdc?: number;
  farmSource?: string;
  farmerId?: string;
  farmerName?: string;
  farmerWallet?: string;
  farmerCert?: string;
  farmerLocationGps?: string;
  gpsCoordinates?: { lat: number; lng: number; locationName: string; speedKmH?: number; heading?: string };
  processingFacility?: string;
  storageTemp?: string;
  coldChainStatus?: 'OPTIMAL' | 'WARNING' | 'BREACHED' | 'NOT_REQUIRED';
  qualityCert?: string;
  ingredients?: string;
  allergens?: string;
}

export interface HistoryEvent {
  productId: string;
  previousHolder: string;
  newHolder: string;
  timestamp: number;
  eventType: string;
  status: ProductStatus;
  txId?: string;
  gpsLocation?: { lat: number; lng: number; locationName: string };
  proofSignature?: string;
  boxMapKey?: string;
}

export interface ParticipantInfo {
  address: string;
  name: string;
  role: UserRole;
  isAuthorized: boolean;
  joinedTimestamp: number;
}

export interface CounterfeitReport {
  id: string;
  productId: string;
  reporterAddress: string;
  reportHash: string;
  timestamp: number;
  details: string;
  evidenceUrl?: string;
  status: 'PENDING' | 'INVESTIGATING' | 'CONFIRMED_COUNTERFEIT' | 'DISMISSED';
}

export interface RecallRecord {
  productId: string;
  batchId: string;
  manufacturer: string;
  currentHolder: string;
  recalledAt: number;
  recalledBy: string;
  reason: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  read: boolean;
  link?: string;
}

// FARMER VALUE & RECOGNITION BREAKDOWN
export interface FarmerValueScoreBreakdown {
  cropQuality: number; // Max 25
  sustainability: number; // Max 20
  priceTransparency: number; // Max 20
  supplyReliability: number; // Max 15
  traceability: number; // Max 10
  communityContribution: number; // Max 10
  totalScore: number; // Max 100
  badgeLabel: string; // e.g. "VERIFIED HIGH-VALUE FARMER"
}

// FARMER SELLING PRICE & FAIR PRICE INTELLIGENCE
export type FairPriceRating = 'EXCELLENT' | 'FAIR' | 'BELOW_MARKET' | 'PRICE_ALERT';

export interface FarmerPriceIntelligenceRecord {
  id: string;
  batchId: string;
  cropName: string;
  quantityKg: number;
  farmerAskingPriceInr: number;
  marketReferencePriceInr: number;
  buyerOfferPriceInr: number;
  finalAgreedPriceInr: number;
  priceDifferenceInr: number; // Final Agreed Price - Asking Price
  marketDifferenceInr: number; // Final Agreed Price - Market Reference Price
  fairPriceScore: number; // (Final Agreed Price / Market Reference Price) * 100
  fairPriceRating: FairPriceRating;
  date: string;
  buyerName: string;
  txHash: string;
}

// 15-STAGE VERIFIED CROP JOURNEY STAGE
export interface CropJourneyStage {
  stageNumber: number;
  stageTitle: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  timestamp: number;
  batchId: string;
  responsibleParticipant: string;
  txHash?: string;
  location?: string;
  details?: string;
}

// PRODUCT RECALL INTELLIGENCE RECORD
export type RecallActionState = 'TEMPERATURE_VIOLATION' | 'QUARANTINED' | 'RELEASED' | 'RECALLED';

export interface RecallIntelligenceRecord {
  id: string;
  batchId: string;
  sensorId: string;
  detectedTemperature: number;
  allowedRange: string;
  durationMinutes: number;
  currentLocation: string;
  affectedUnits: number;
  affectedDistributor: string;
  affectedStorageFacility: string;
  incidentTimestamp: number;
  actionState: RecallActionState;
  txHash: string;
}

// FARMER RECOGNITION & CROP MODEL TYPES
export interface CropItem {
  id: string;
  cropName: string;
  variety?: string;
  quantityAvailableKg: number;
  pricePerKgInr: number;
  harvestDate: string;
  location: string;
  certifications: string[];
}

export interface FarmerRecord {
  id: string;
  farmerId: string;
  name: string;
  location: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  crops: string[];
  totalBatches: number;
  successfulDeliveries: number;
  qualityScore: number;
  blockchainVerified: boolean;
  walletAddress: string;
  joinedDate: string;
  experienceYears?: number;
  trustLevel?: string;
  valueScoreBreakdown?: FarmerValueScoreBreakdown;
  availableCrops: CropItem[];
}

export interface X402PaymentRecord {
  id: string;
  paymentId: string;
  cropName: string;
  farmerName: string;
  farmerWallet: string;
  payerAddress: string;
  quantityKg: number;
  totalAmountInr: number;
  totalAmountUsdc: number;
  paymentMethod: 'x402_USDC' | 'CRYPTO_WALLET' | 'UPI' | 'BANK_TRANSFER';
  txHash: string;
  asset: string;
  network: string;
  timestamp: number;
  status: 'SETTLED' | 'PENDING' | 'FAILED';
}

export type NavItemKey =
  | 'dashboard'
  | 'wallet'
  | 'products'
  | 'product-details'
  | 'register-product'
  | 'transfers'
  | 'receive-product'
  | 'supply-chain'
  | 'verify-product'
  | 'qr-scanner'
  | 'counterfeit-reports'
  | 'recalled-products'
  | 'participants'
  | 'blockchain-activity'
  | 'settings'
  // ROLE-SPECIFIC NAV KEYS
  | 'farmer-network'
  | 'farmer-recognition'
  | 'farmer-applications'
  | 'available-crops'
  | 'crop-requirements'
  | 'purchase-requests'
  | 'incoming-crops'
  | 'processing-batches'
  | 'x402-payments'
  | 'payment-requests'
  | 'crop-records'
  | 'batch-certificates'
  | 'customer-marketplace'
  | 'customer-browse'
  | 'customer-categories'
  | 'customer-orders'
  | 'batch-management'
  | 'sales-orders'
  | 'sales-history'
  | 'customer-purchases';
