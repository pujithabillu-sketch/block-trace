import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import type { NavItemKey, UserRole } from '../../types';
import {
  LayoutDashboard,
  Box,
  ShoppingBag,
  GitMerge,
  Activity,
  QrCode,
  ShieldCheck,
  BarChart3,
  Settings,
  Shield,
  PlusCircle,
  X,
  PackageCheck,
  Search,
  ShoppingCart,
  Users,
  AlertTriangle,
  Wallet,
  Wheat,
  Award,
  Zap,
  FileCheck,
  Truck,
  DollarSign,
  UserCheck,
  Store,
  Receipt,
  LogOut,
  RefreshCw,
} from 'lucide-react';

interface NavItem {
  key: NavItemKey;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  onSwitchWorkspace?: () => void;
}

// ROLE-SPECIFIC NAVIGATION STRUCTURES
const ROLE_NAVIGATION_MAPS: Record<UserRole, NavGroup[]> = {
  MANUFACTURER: [
    {
      title: 'MAIN',
      items: [{ key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }],
    },
    {
      title: 'PRODUCTION',
      items: [
        { key: 'register-product', label: 'Register Batch', icon: <PlusCircle className="w-4 h-4" /> },
        { key: 'products', label: 'My Products', icon: <Box className="w-4 h-4" /> },
        { key: 'batch-management', label: 'Batch Management', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'LOGISTICS',
      items: [
        { key: 'transfers', label: 'Create Shipment', icon: <ShoppingBag className="w-4 h-4" /> },
        { key: 'transfers', label: 'Transfer Custody', icon: <Truck className="w-4 h-4" /> },
        { key: 'supply-chain', label: 'Shipment Tracking', icon: <GitMerge className="w-4 h-4" /> },
      ],
    },
    {
      title: 'BLOCKCHAIN',
      items: [
        { key: 'blockchain-activity', label: 'On-Chain Records', icon: <Activity className="w-4 h-4" /> },
        { key: 'blockchain-activity', label: 'Transaction History', icon: <Activity className="w-4 h-4" /> },
      ],
    },
    {
      title: 'VERIFICATION',
      items: [
        { key: 'qr-scanner', label: 'Generate QR', icon: <QrCode className="w-4 h-4" /> },
        { key: 'verify-product', label: 'Verify Product', icon: <ShieldCheck className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { key: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
        { key: 'settings', label: 'Profile', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ],

  DISTRIBUTOR: [
    {
      title: 'MAIN',
      items: [{ key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }],
    },
    {
      title: 'INCOMING',
      items: [
        { key: 'receive-product', label: 'Incoming Shipments', icon: <Truck className="w-4 h-4" /> },
        { key: 'receive-product', label: 'Pending Receipts', icon: <PackageCheck className="w-4 h-4" /> },
        { key: 'receive-product', label: 'Receive Product', icon: <Box className="w-4 h-4" /> },
      ],
    },
    {
      title: 'INVENTORY',
      items: [
        { key: 'products', label: 'Current Inventory', icon: <Box className="w-4 h-4" /> },
        { key: 'products', label: 'Batch Inventory', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'LOGISTICS',
      items: [
        { key: 'transfers', label: 'Create Transfer', icon: <ShoppingBag className="w-4 h-4" /> },
        { key: 'transfers', label: 'Active Shipments', icon: <Truck className="w-4 h-4" /> },
        { key: 'supply-chain', label: 'Delivery Tracking', icon: <GitMerge className="w-4 h-4" /> },
      ],
    },
    {
      title: 'VERIFICATION',
      items: [
        { key: 'verify-product', label: 'Verify Batch', icon: <ShieldCheck className="w-4 h-4" /> },
        { key: 'qr-scanner', label: 'Scan QR', icon: <QrCode className="w-4 h-4" /> },
      ],
    },
    {
      title: 'BLOCKCHAIN',
      items: [
        { key: 'supply-chain', label: 'Custody History', icon: <GitMerge className="w-4 h-4" /> },
        { key: 'blockchain-activity', label: 'Transactions', icon: <Activity className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { key: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
        { key: 'settings', label: 'Profile', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ],

  RETAILER: [
    {
      title: 'MAIN',
      items: [{ key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }],
    },
    {
      title: 'STORE',
      items: [
        { key: 'products', label: 'Inventory', icon: <Store className="w-4 h-4" /> },
        { key: 'receive-product', label: 'Incoming Products', icon: <PackageCheck className="w-4 h-4" /> },
        { key: 'products', label: 'Product Catalog', icon: <Box className="w-4 h-4" /> },
      ],
    },
    {
      title: 'SALES',
      items: [
        { key: 'customer-orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
        { key: 'sales-history', label: 'Sales History', icon: <Receipt className="w-4 h-4" /> },
        { key: 'customer-purchases', label: 'Customer Purchases', icon: <Users className="w-4 h-4" /> },
      ],
    },
    {
      title: 'VERIFICATION',
      items: [
        { key: 'verify-product', label: 'Verify Product', icon: <ShieldCheck className="w-4 h-4" /> },
        { key: 'qr-scanner', label: 'QR Scanner', icon: <QrCode className="w-4 h-4" /> },
      ],
    },
    {
      title: 'BLOCKCHAIN',
      items: [
        { key: 'supply-chain', label: 'Product History', icon: <GitMerge className="w-4 h-4" /> },
        { key: 'blockchain-activity', label: 'Transactions', icon: <Activity className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { key: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
        { key: 'settings', label: 'Profile', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ],

  CUSTOMER: [
    {
      title: 'HOME',
      items: [{ key: 'customer-marketplace', label: 'Marketplace', icon: <ShoppingCart className="w-4 h-4 text-indigo-500" /> }],
    },
    {
      title: 'PRODUCTS',
      items: [
        { key: 'customer-browse', label: 'Browse Products', icon: <Box className="w-4 h-4" /> },
        { key: 'customer-browse', label: 'Search Products', icon: <Search className="w-4 h-4" /> },
        { key: 'customer-categories', label: 'Categories', icon: <Store className="w-4 h-4" /> },
      ],
    },
    {
      title: 'TRACEABILITY',
      items: [
        { key: 'qr-scanner', label: 'Scan QR', icon: <QrCode className="w-4 h-4" /> },
        { key: 'supply-chain', label: 'Product Journey', icon: <GitMerge className="w-4 h-4" /> },
        { key: 'verify-product', label: 'Verify Authenticity', icon: <ShieldCheck className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ORDERS',
      items: [
        { key: 'customer-orders', label: 'My Orders', icon: <ShoppingBag className="w-4 h-4" /> },
        { key: 'customer-orders', label: 'Order Tracking', icon: <Truck className="w-4 h-4" /> },
        { key: 'customer-orders', label: 'Purchase History', icon: <Receipt className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PAYMENTS',
      items: [
        { key: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
        { key: 'x402-payments', label: 'x402 Payments', icon: <Zap className="w-4 h-4 text-amber-500" /> },
        { key: 'x402-payments', label: 'Payment History', icon: <DollarSign className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { key: 'settings', label: 'Profile', icon: <Settings className="w-4 h-4" /> },
        { key: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ],

  FOOD_PRODUCER: [
    {
      title: 'MAIN',
      items: [{ key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-emerald-600" /> }],
    },
    {
      title: 'FARMER NETWORK',
      items: [
        { key: 'farmer-network', label: 'Farmers', icon: <Users className="w-4 h-4 text-emerald-600" /> },
        { key: 'farmer-recognition', label: 'Farmer Recognition', icon: <Award className="w-4 h-4 text-amber-500" /> },
        { key: 'farmer-applications', label: 'Farmer Applications', icon: <UserCheck className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PROCUREMENT',
      items: [
        { key: 'available-crops', label: 'Available Crops', icon: <Wheat className="w-4 h-4 text-amber-600" /> },
        { key: 'crop-requirements', label: 'Crop Requirements', icon: <FileCheck className="w-4 h-4" /> },
        { key: 'purchase-requests', label: 'Purchase Requests', icon: <ShoppingBag className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PRODUCTS',
      items: [
        { key: 'incoming-crops', label: 'Incoming Crops', icon: <Wheat className="w-4 h-4" /> },
        { key: 'processing-batches', label: 'Processing Batches', icon: <Box className="w-4 h-4" /> },
        { key: 'products', label: 'Food Products', icon: <Box className="w-4 h-4" /> },
      ],
    },
    {
      title: 'SUPPLY CHAIN',
      items: [
        { key: 'supply-chain', label: 'Batch Tracking', icon: <GitMerge className="w-4 h-4" /> },
        { key: 'supply-chain', label: 'Shipment Tracking', icon: <Truck className="w-4 h-4" /> },
        { key: 'supply-chain', label: 'Traceability', icon: <ShieldCheck className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PAYMENTS',
      items: [
        { key: 'x402-payments', label: 'x402 Payments', icon: <Zap className="w-4 h-4 text-amber-500" /> },
        { key: 'payment-requests', label: 'Payment Requests', icon: <DollarSign className="w-4 h-4" /> },
        { key: 'x402-payments', label: 'Payment History', icon: <Receipt className="w-4 h-4" /> },
      ],
    },
    {
      title: 'BLOCKCHAIN',
      items: [
        { key: 'crop-records', label: 'Crop Records', icon: <Activity className="w-4 h-4" /> },
        { key: 'batch-certificates', label: 'Batch Certificates', icon: <FileCheck className="w-4 h-4 text-teal-600" /> },
        { key: 'blockchain-activity', label: 'Transactions', icon: <Activity className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { key: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
        { key: 'settings', label: 'Profile', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ],

  ADMIN: [
    {
      title: 'GOVERNANCE',
      items: [
        { key: 'dashboard', label: 'Admin Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-teal-600" /> },
        { key: 'participants', label: 'Participants & Roles', icon: <Users className="w-4 h-4" /> },
        { key: 'blockchain-activity', label: 'Network Governance', icon: <Activity className="w-4 h-4" /> },
        { key: 'recalled-products', label: 'Recalled Products', icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
        { key: 'counterfeit-reports', label: 'Counterfeit Reports', icon: <Shield className="w-4 h-4 text-amber-500" /> },
        { key: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ],

  WAREHOUSE: [
    {
      title: 'MAIN',
      items: [{ key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }],
    },
    {
      title: 'WAREHOUSE LOGISTICS',
      items: [
        { key: 'receive-product', label: 'Inbound Storage', icon: <PackageCheck className="w-4 h-4" /> },
        { key: 'products', label: 'Stored Batches', icon: <Box className="w-4 h-4" /> },
        { key: 'transfers', label: 'Dispatch Batch', icon: <ShoppingBag className="w-4 h-4" /> },
        { key: 'supply-chain', label: 'Storage Telemetry', icon: <GitMerge className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { key: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
        { key: 'settings', label: 'Profile', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ],

  COLD_STORAGE: [
    {
      title: 'MAIN',
      items: [{ key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-cyan-600" /> }],
    },
    {
      title: 'COLD CHAIN',
      items: [
        { key: 'products', label: 'Thermal Storage Batches', icon: <Box className="w-4 h-4" /> },
        { key: 'supply-chain', label: 'Telemetry Logs', icon: <Activity className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { key: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
        { key: 'settings', label: 'Profile', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ],

  CONSUMER: [],
  UNAUTHORIZED: [],
};

const getRoleDisplayTitle = (role: UserRole): string => {
  switch (role) {
    case 'MANUFACTURER':
      return 'Manufacturer Hub';
    case 'FOOD_PRODUCER':
      return 'Food & Agri Producer';
    case 'DISTRIBUTOR':
      return 'Distributor Workspace';
    case 'RETAILER':
      return 'Retailer Store Hub';
    case 'CUSTOMER':
      return 'Customer Marketplace';
    case 'ADMIN':
      return 'Admin Governance';
    case 'WAREHOUSE':
      return 'Warehouse Hub';
    case 'COLD_STORAGE':
      return 'Cold Chain Storage';
    default:
      return 'BlocTrace Workspace';
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ onSwitchWorkspace }) => {
  const { activeNav, setActiveNav, isSidebarCollapsed, isMobileMenuOpen, toggleMobileMenu } = useNavigation();
  const { account, logout } = useAuth();

  const currentRole: UserRole = account?.role || 'FOOD_PRODUCER';
  const navGroups = ROLE_NAVIGATION_MAPS[currentRole] || ROLE_NAVIGATION_MAPS.FOOD_PRODUCER;

  const handleNavClick = (key: NavItemKey) => {
    setActiveNav(key);
  };

  const handleLogoutClick = () => {
    logout();
    if (onSwitchWorkspace) {
      onSwitchWorkspace();
    }
  };

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-300 select-none">
      {/* BRANDING HEADER */}
      <div className="h-[72px] px-5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                Bloc<span className="text-teal-400">Trace</span>
              </span>
              <span className="text-[10px] font-bold text-teal-300/80 tracking-wider uppercase truncate mt-1">
                {getRoleDisplayTitle(currentRole)}
              </span>
            </motion.div>
          )}
        </div>

        {/* MOBILE CLOSE BUTTON */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* WORKSPACE SWITCHER QUICK BAR */}
      {onSwitchWorkspace && !isSidebarCollapsed && (
        <div className="p-3 mx-3 mt-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-slate-200 truncate">{account?.name || 'Active Workspace'}</span>
          </div>
          <button
            onClick={onSwitchWorkspace}
            title="Switch Workspace"
            className="text-[10px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-md border border-teal-500/30"
          >
            <RefreshCw className="w-3 h-3" />
            Switch
          </button>
        </div>
      )}

      {/* SIDEBAR NAVIGATION GROUPS */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {!isSidebarCollapsed && (
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400/90 mb-2">
                {group.title}
              </h3>
            )}
            {group.items.map((item, itemIdx) => {
              const isActive = activeNav === item.key;
              return (
                <button
                  key={`${item.key}-${itemIdx}`}
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <span
                    className={`transition-colors shrink-0 ${
                      isActive ? 'text-teal-400 scale-110' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  {isActive && !isSidebarCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-1.5 h-1.5 rounded-full bg-teal-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* FOOTER & LOGOUT */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/80 shrink-0">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span>Logout / Exit Workspace</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-800 transition-all duration-300 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderNavContent()}
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0F172A] z-50 lg:hidden shadow-2xl"
            >
              {renderNavContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
