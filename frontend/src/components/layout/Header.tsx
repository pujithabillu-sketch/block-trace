import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../ui/SearchBar';
import { NetworkIndicator } from '../ui/NetworkIndicator';
import { WalletDisplay } from './WalletDisplay';
import { NotificationPanel } from './NotificationPanel';
import { ProfileMenu } from './ProfileMenu';
import { Menu, Shield, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  onSwitchWorkspace?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSwitchWorkspace }) => {
  const { activeNav, toggleMobileMenu, globalSearch, setGlobalSearch, setActiveNav } = useNavigation();
  const { isAuthenticated } = useAuth();

  const titleMap: Record<string, string> = {
    dashboard: 'Supply Chain Overview',
    wallet: 'Workspace Web3 Wallet',
    products: 'Registered Products Catalog',
    'register-product': 'Register New Physical Product',
    transfers: 'Product Custody Transfers',
    'receive-product': 'Receive Inbound Custody Transfer',
    'supply-chain': 'Supply Chain Mapping',
    'verify-product': 'Verify Product Authenticity',
    'qr-scanner': 'QR Code Scanner',
    'counterfeit-reports': 'Counterfeit Incident Reports',
    'recalled-products': 'Recalled Products Log',
    participants: 'Authorized Supply Chain Participants',
    'blockchain-activity': 'Algorand Blockchain Activity',
    settings: 'System & Security Settings',
  };

  const handleSearchSubmit = (val: string) => {
    const q = val.trim().toUpperCase();
    if (!q) return;

    if (q.startsWith('TX')) {
      setActiveNav('blockchain-activity');
    } else if (q.startsWith('PROD-') || q.startsWith('BATCH-')) {
      setActiveNav('verify-product');
    } else if (q.length > 20) {
      setActiveNav('participants');
    } else {
      setActiveNav('products');
    }
  };

  return (
    <header className="h-[72px] bg-white border-b border-[#E2E8F0] sticky top-0 z-20 px-8 flex items-center justify-between gap-6">
      {/* Left: Mobile Menu Trigger & Page Title */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="lg:hidden flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600 font-bold" />
        </div>

        <div className="hidden sm:block truncate">
          <h1 className="text-base font-bold text-slate-900 truncate">
            {titleMap[activeNav] || 'BlocTrace Platform'}
          </h1>
          <p className="text-[12px] text-slate-500 font-medium">Algorand Smart Contract Verification System</p>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="w-[480px] max-w-full hidden md:block">
        <SearchBar
          value={globalSearch}
          onChange={setGlobalSearch}
          onSearchSubmit={handleSearchSubmit}
          placeholder="Search Product ID, Batch ID, Wallet Address, or Tx Hash..."
          className="h-[44px]"
        />
      </div>

      {/* Right Actions: Workspaces, Network, Wallet, Notifications, Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {onSwitchWorkspace && (
          <button
            onClick={onSwitchWorkspace}
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-all cursor-pointer"
            title="Choose a different workspace role"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
            <span>Workspaces</span>
          </button>
        )}
        <NetworkIndicator />
        {isAuthenticated && (
          <div onClick={() => setActiveNav('wallet')} className="cursor-pointer">
            <WalletDisplay />
          </div>
        )}
        <NotificationPanel />
        <ProfileMenu onSwitchWorkspace={onSwitchWorkspace} />
      </div>
    </header>
  );
};
