import React, { createContext, useContext, useState } from 'react';
import type { UserRole, UserAccount, NetworkType } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  account: UserAccount | null;
  network: NetworkType;
  isAuthenticated: boolean;
  login: (address: string, name?: string, role?: UserRole) => void;
  logout: () => void;
  setNetwork: (network: NetworkType) => void;
  switchRole: (role: UserRole) => void;
  presetAccounts: UserAccount[];
}

const PRESET_ACCOUNTS: UserAccount[] = [
  {
    address: 'ADMIN7X9K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8',
    name: 'BlockTrace System Admin',
    email: 'admin@blocktrace.io',
    role: 'ADMIN',
    balanceAlgo: 125.5,
  },
  {
    address: 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
    name: 'Apex Global Agri & Manufacturing Ltd.',
    email: 'farmer@apexagri.com',
    role: 'MANUFACTURER',
    balanceAlgo: 48.2,
  },
  {
    address: 'FOOD1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7',
    name: 'Green Valley Organic Food Producers',
    email: 'foodproducer@greenvalley.com',
    role: 'FOOD_PRODUCER',
    balanceAlgo: 42.0,
  },
  {
    address: 'DST1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8',
    name: 'Global Freight Distributors',
    email: 'distributor@globalfreight.com',
    role: 'DISTRIBUTOR',
    balanceAlgo: 32.8,
  },
  {
    address: 'WHS6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3',
    name: 'Central Storage & Logistics Hub A',
    email: 'warehouse@centrallogistics.com',
    role: 'WAREHOUSE',
    balanceAlgo: 18.9,
  },
  {
    address: 'COLD8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4',
    name: 'SubZero Cold Chain Storage',
    email: 'coldstorage@subzero.com',
    role: 'COLD_STORAGE',
    balanceAlgo: 22.4,
  },
  {
    address: 'RTL9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
    name: 'MediCare & Goods Outlets',
    email: 'retailer@medicareoutlets.com',
    role: 'RETAILER',
    balanceAlgo: 15.4,
  },
  {
    address: 'CUST7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3',
    name: 'Verified Consumer / Customer',
    email: 'customer@blocktrace.io',
    role: 'CUSTOMER',
    balanceAlgo: 25.4,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('blocktrace_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    return null;
  });

  const [network, setNetworkState] = useState<NetworkType>(() => {
    return (localStorage.getItem('blocktrace_network') as NetworkType) || 'LocalNet';
  });

  const login = async (inputVal: string, name?: string, role?: UserRole) => {
    const cleanInput = inputVal.trim().toLowerCase();
    const preset = PRESET_ACCOUNTS.find(
      (a) => a.address.toLowerCase() === cleanInput || (a.email && a.email.toLowerCase() === cleanInput)
    );

    const targetAddress = preset ? preset.address : (inputVal.length > 20 ? inputVal : `WALLET-${cleanInput.replace(/[^a-z0-9]/g, '').toUpperCase()}`);
    const targetRole = role || preset?.role || 'MANUFACTURER';
    
    // Call backend login
    await api.login(targetRole, targetAddress);

    const newAccount: UserAccount = {
      address: targetAddress,
      name: name || preset?.name || (preset?.email ? preset.name : `User (${cleanInput})`),
      email: preset?.email || (cleanInput.includes('@') ? cleanInput : undefined),
      role: targetRole,
      balanceAlgo: preset?.balanceAlgo || 10.0,
    };
    setAccount(newAccount);
    localStorage.setItem('blocktrace_user', JSON.stringify(newAccount));
  };

  const logout = () => {
    setAccount(null);
    localStorage.removeItem('blocktrace_user');
    localStorage.removeItem('blocktrace_jwt_token');
  };

  const setNetwork = (net: NetworkType) => {
    setNetworkState(net);
    localStorage.setItem('blocktrace_network', net);
  };

  const switchRole = (newRole: UserRole) => {
    if (account) {
      const updated = { ...account, role: newRole };
      setAccount(updated);
      localStorage.setItem('blocktrace_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        account,
        network,
        isAuthenticated: !!account,
        login,
        logout,
        setNetwork,
        switchRole,
        presetAccounts: PRESET_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
