import React, { createContext, useContext, useState } from 'react';
import type { NavItemKey } from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface NavigationContextType {
  activeNav: NavItemKey;
  setActiveNav: (nav: NavItemKey) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  navigateToProductDetails: (productId: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNav, setActiveNavState] = useState<NavItemKey>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string>('PROD-RICE-0001');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const setActiveNav = (nav: NavItemKey) => {
    setActiveNavState(nav);
    setIsMobileMenuOpen(false); // Close mobile drawer when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProductDetails = (productId: string) => {
    setSelectedProductId(productId);
    setActiveNavState('product-details');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NavigationContext.Provider
      value={{
        activeNav,
        setActiveNav,
        selectedProductId,
        setSelectedProductId,
        navigateToProductDetails,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        globalSearch,
        setGlobalSearch,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
