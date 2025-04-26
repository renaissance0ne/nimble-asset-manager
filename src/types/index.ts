
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "manager" | "user";
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: "available" | "in-use" | "maintenance" | "retired";
  purchaseDate: string;
  purchaseCost: number;
  assignedTo?: string;
  assignedToName?: string;
  location: string;
  description?: string;
  serialNumber?: string;
  warrantyExpiryDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  maintenanceType: "preventive" | "corrective" | "predictive";
  maintenanceDate: string;
  performedBy: string;
  cost: number;
  description: string;
  notes?: string;
  createdAt: string;
}

export interface AssetCheckout {
  id: string;
  assetId: string;
  userId: string;
  checkoutDate: string;
  expectedReturnDate?: string;
  returnDate?: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  inUseAssets: number;
  maintenanceAssets: number;
  retiredAssets: number;
  totalMaintenanceCost: number;
  upcomingMaintenance: number;
}
