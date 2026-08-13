# 🛡️ BlocTrace – Algorand Blockchain Supply Chain & Agriculture Provenance Intelligence Platform

[![Algorand](https://img.shields.io/badge/Blockchain-Algorand%20AVM-000000?style=for-the-badge&logo=algorand&logoColor=white)](https://algorand.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)

**BlocTrace** is an enterprise-grade, decentralized supply chain provenance and fair-price intelligence platform built on the **Algorand Blockchain (AVM Smart Contracts & ARC-4 Box Storage)**.

It provides end-to-end transparency, telemetry tracking, product recall management, and fair-price intelligence for agricultural crops, food perishables, pharmaceuticals, electronics, and manufactured goods.

---

## 🌟 Core Highlights & Features

### 🏢 True Role-Based Workspaces & Dynamic Aesthetics
BlocTrace provides isolated navigation, metrics, terminology, actions, and workflows for each role:
- **`ADMIN`**: Global System Administration, Algorand Network Node Health, Smart Contract Box Inspection.
- **`FOOD_PRODUCER`**: Agricultural Supply Chain, Accredited Farmer Network, x402 Instant Settlement, 14-Stage Crop Journey.
- **`MANUFACTURER`**: Production Batch Management, Serial Registration, Sensor Tagging, Custody Transfer.
- **`DISTRIBUTOR`**: Fleet Logistics, Route Tracking, Live GPS Telemetry, Shipping Dispatches.
- **`WAREHOUSE`**: Storage Facility Check-In/Check-Out, High-Density Bin Indexing, Stock Auditing.
- **`COLD_STORAGE`**: Cold Chain Verification, IoT Thermal Excursion Breach Monitoring.
- **`RETAILER`**: Shelf Acceptance, POS Provenance Verification, Packaging QR Code Generation.
- **`CUSTOMER`**: Public Authenticity Scanner, Farm-to-Fork Timeline, Algorand Tx Explorer.

---

### 🌾 Farmer Value & Recognition System
Replaces simple badges with measurable value scoring:
- **Quality & Sustainability Metrics**: Crop Quality (25), Sustainability (20), Price Transparency (20), Supply Reliability (15), Traceability (10), Community Contribution (10).
- **Accreditation Badges**: `VERIFIED HIGH-VALUE FARMER` badges issued directly on-chain.

---

### ⚖️ Fair Price Intelligence & Fair Price Score
Guarantees price transparency across agricultural crop procurement:
- **Transparent Price Evidence**: Displays Farmer Asking Price, Market Reference Price, Buyer Offer, and Final Agreed Price.
- **Fair Price Score Formula**: `(Final Agreed Price / Market Reference Price) × 100`
- **Compliance Score Ranges**:
  - `92% – 100%`: **EXCELLENT**
  - `80% – 91%`: **FAIR**
  - `60% – 79%`: **BELOW MARKET**
  - `< 60%`: **PRICE ALERT**

---

### 🌾 14-Stage Verified Crop Journey
Tracks batches from harvest to consumer purchase across 14 immutable checkpoints:
1. Farmer Harvesting & Registration
2. Crop Registered On-Chain (Algorand ARC-4 Box Storage)
3. Quality & Moisture Verification (Grade A Certification)
4. Farmer Asking Price Recording
5. Fair Price Intelligence Analysis (Oracle Valuation)
6. Purchase Agreement & x402 Settlement (USDC Transfer)
7. Food Producer Receipt & Storage
8. Crop Milling & Primary Processing
9. Product Packaging & Manufacturing
10. Live GPS Monitored Transport Dispatch
11. Warehouse Facility Check-In
12. Cold Storage Thermal Verification
13. Algorand AVM Smart Contract Provenance Proof
14. Consumer Packaging QR Code Live Scan

---

### 🚨 Product Recall Intelligence & Thermal Violation Management
Dedicated incident console for cold-chain excursion management:
- **Automated Detection**: Real-time alert triggers when IoT temperature sensors exceed defined thresholds (e.g., 2.0°C – 8.0°C).
- **Scope Containment Mapping**: Pinpoints affected batches, units, logistics trucks, and storage hubs.
- **On-Chain Containment Actions**: Execute `QUARANTINED`, `RECALLED`, or `RELEASED` states directly on Algorand LocalNet.

---

### 🛰️ Live GIS Telemetry & Google Maps Integration
- **Live Vehicle Telemetry**: 5-second polling interval tracking latitude, longitude, speed (km/h), and heading.
- **Interactive GIS Map**: Google Maps JavaScript API integration with fallback radar component for offline/local development.

---

### ⚡ x402 Web3 Micropayment Protocol
- **Instant Crop Settlement**: Execute USDC micropayment settlements between Food Producers and Farmers.
- **Algorand Transaction Proof**: On-chain tx hashes for instant audit verification.

---

## 🏗️ Repository Architecture

```
algomahesh/
├── frontend/                   # React 18 + Vite + TypeScript + Tailwind Token System
│   ├── src/
│   │   ├── components/         # Workspace Dashboards, Verified Crop Journey, Recall Console
│   │   │   ├── dashboards/     # Role-specific dashboards (Admin, Producer, Manufacturer, etc.)
│   │   │   ├── layout/         # Workspace Layouts, Navigation Bar, Role Selector
│   │   │   ├── ui/             # PageHeader, Card, Button, StatusBadge, WalletAddress, GpsTracker
│   │   │   ├── VerifiedCropJourney.tsx
│   │   │   └── ProductRecallIntelligence.tsx
│   │   ├── context/            # AuthContext, NavigationContext, ProductContext
│   │   ├── pages/              # Role Pages & Farmer Recognition Hub
│   │   ├── services/           # locationService, temperatureService, web3Service
│   │   ├── styles/             # Natural Light & Dark Design Tokens
│   │   └── types/              # Comprehensive TypeScript Interfaces
│   └── package.json
│
├── backend/                    # Node.js + Express REST API Server
│   ├── config.js               # Algorand Node & Smart Contract Settings
│   ├── routes/                 # Express API Endpoints (/api/products, /api/transfers)
│   ├── services/               # Algorand SDK & AVM Box Storage Interfaces
│   └── server.js               # Express Entry Point (Port 5000)
│
└── projects/algomahesh/        # Algorand Smart Contracts (PyTeal / Beaker / AlgoKit)
    └── smart_contracts/        # ARC-4 Smart Contracts & Box Storage Maps
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **Algokit / Algorand LocalNet** (Optional for smart contract deployment)

---

### 1. Clone the Repository
```bash
git clone https://github.com/pujithabillu-sketch/block-trace.git
cd block-trace
```

---

### 2. Launch Backend API Server
```bash
cd backend
npm install
npm run dev
```
> Backend API runs at: **`http://localhost:5000`**

---

### 3. Launch Frontend Web Portal
```bash
cd ../frontend
npm install
npm run dev
```
> Access Frontend Web Portal at: **`http://localhost:5173`**

---

## 🔒 Smart Contract Methods (Algorand AVM ARC-4)

| Method Name | Parameters | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `register_product` | `productId`, `batchId`, `metadataHash` | Manufacturer, Admin | Creates Box Map storage record on Algorand |
| `transfer_product` | `productId`, `recipientAddr`, `role` | Current Holder | Sets pending recipient custody state |
| `receive_product` | `productId`, `receiverAddr` | Designated Recipient | Finalizes custody transfer to new holder |
| `record_fair_price` | `productId`, `askingPrice`, `marketRef` | Food Producer, Admin | Stores price evidence & fair price score on-chain |
| `flag_recall` | `productId`, `incidentId`, `reason` | Producer, Admin | Locks batch transfer and flags quarantine state |

---

## 📜 License

This project is open-source software licensed under the **MIT License**.
