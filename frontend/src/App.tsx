import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { ProductProvider } from './context/ProductContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MainContent } from './components/layout/MainContent';
import { ToastContainer } from './components/ui/Toast';

import { ConnectWalletLandingPage } from './pages/ConnectWalletLandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';

import { DashboardPage } from './pages/DashboardPage';
import { WalletPage } from './pages/WalletPage';
import { ProductsPage } from './pages/ProductsPage';
import { RegisterProductPage } from './pages/RegisterProductPage';
import { TransfersPage } from './pages/TransfersPage';
import { ReceiveProductPage } from './pages/ReceiveProductPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { SupplyChainPage } from './pages/SupplyChainPage';
import { VerifyProductPage } from './pages/VerifyProductPage';
import { QrScannerPage } from './pages/QrScannerPage';
import { CounterfeitReportsPage } from './pages/CounterfeitReportsPage';
import { RecalledProductsPage } from './pages/RecalledProductsPage';
import { ParticipantsPage } from './pages/ParticipantsPage';
import { BlockchainActivityPage } from './pages/BlockchainActivityPage';
import { SettingsPage } from './pages/SettingsPage';
import { FarmerRecognitionPage } from './pages/FarmerRecognitionPage';

export type EntryViewType = 'landing' | 'role-selection' | 'app';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeNav } = useNavigation();
  const [entryView, setEntryView] = useState<EntryViewType>('landing');

  // AUTHENTICATION GUARD:
  if (!isAuthenticated && (entryView === 'role-selection' || entryView === 'app')) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="landing-redirect"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full min-h-screen"
        >
          <ConnectWalletLandingPage
            onConnectedSuccess={() => setEntryView('role-selection')}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // 1. DEFAULT ROOT ROUTE (`/`): WEB3 LANDING / CONNECT WALLET PAGE
  if (entryView === 'landing') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="landing-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full min-h-screen"
        >
          <ConnectWalletLandingPage
            onConnectedSuccess={() => setEntryView('role-selection')}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // 2. WORKSPACE / ROLE SELECTION PAGE (`Choose Your Workspace`)
  if (entryView === 'role-selection') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="role-selection-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full min-h-screen flex flex-col"
        >
          <RoleSelectionPage
            onRoleSelected={() => setEntryView('app')}
            onNavigateToLanding={() => setEntryView('landing')}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // 3. PROTECTED DASHBOARD WORKSPACE WITH ROLE ROUTE PROTECTION
  const renderActivePage = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardPage key="dashboard" />;
      case 'wallet':
        return <WalletPage key="wallet" />;
      case 'products':
      case 'customer-browse':
      case 'customer-categories':
      case 'batch-management':
      case 'incoming-crops':
      case 'processing-batches':
        return <ProductsPage key="products" />;
      case 'product-details':
        return <ProductDetailsPage key="product-details" />;
      case 'register-product':
        return <RegisterProductPage key="register-product" />;
      case 'transfers':
      case 'customer-orders':
      case 'sales-orders':
      case 'sales-history':
      case 'customer-purchases':
        return <TransfersPage key="transfers" />;
      case 'receive-product':
        return <ReceiveProductPage key="receive-product" />;
      case 'supply-chain':
      case 'crop-records':
        return <SupplyChainPage key="supply-chain" />;
      case 'verify-product':
        return <VerifyProductPage key="verify-product" />;
      case 'qr-scanner':
        return <QrScannerPage key="qr-scanner" />;
      case 'counterfeit-reports':
        return <CounterfeitReportsPage key="counterfeit-reports" />;
      case 'recalled-products':
        return <RecalledProductsPage key="recalled-products" />;
      case 'participants':
        return <ParticipantsPage key="participants" />;
      case 'blockchain-activity':
      case 'batch-certificates':
        return <BlockchainActivityPage key="blockchain-activity" />;
      case 'settings':
        return <SettingsPage key="settings" />;
      case 'farmer-network':
      case 'farmer-recognition':
      case 'farmer-applications':
      case 'available-crops':
      case 'crop-requirements':
      case 'purchase-requests':
      case 'x402-payments':
      case 'payment-requests':
        return <FarmerRecognitionPage key="farmer-recognition" />;
      case 'customer-marketplace':
        return <DashboardPage key="customer-marketplace" />;
      default:
        return <DashboardPage key="default" />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="app-container"
      >
        <Sidebar onSwitchWorkspace={() => setEntryView('role-selection')} />
        <div className="main-wrapper">
          <Header onSwitchWorkspace={() => setEntryView('role-selection')} />
          <MainContent>{renderActivePage()}</MainContent>
        </div>
        <ToastContainer />
      </motion.div>
    </AnimatePresence>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <NavigationProvider>
          <MainLayout />
        </NavigationProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
