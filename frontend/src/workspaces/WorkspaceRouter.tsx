import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminWorkspace } from './AdminWorkspace';
import { FoodProducerWorkspace } from './FoodProducerWorkspace';
import { ManufacturerWorkspace } from './ManufacturerWorkspace';
import { DistributorWorkspace } from './DistributorWorkspace';
import { WarehouseWorkspace } from './WarehouseWorkspace';
import { ColdStorageWorkspace } from './ColdStorageWorkspace';
import { RetailerDashboard } from '../components/dashboards/RetailerDashboard';
import { CustomerDashboard } from '../components/dashboards/CustomerDashboard';
import type { UserRole } from '../types';

export const WorkspaceRouter: React.FC = () => {
  const { account } = useAuth();
  const role: UserRole = account?.role || 'FOOD_PRODUCER';

  switch (role) {
    case 'ADMIN':
      return <AdminWorkspace />;
    case 'FOOD_PRODUCER':
      return <FoodProducerWorkspace />;
    case 'MANUFACTURER':
      return <ManufacturerWorkspace />;
    case 'DISTRIBUTOR':
      return <DistributorWorkspace />;
    case 'WAREHOUSE':
      return <WarehouseWorkspace />;
    case 'COLD_STORAGE':
      return <ColdStorageWorkspace />;
    case 'RETAILER':
      return <RetailerDashboard />;
    case 'CONSUMER':
    case 'CUSTOMER':
      return <CustomerDashboard />;
    default:
      return <FoodProducerWorkspace />;
  }
};
