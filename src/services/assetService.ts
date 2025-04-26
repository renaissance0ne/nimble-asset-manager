
import { Asset, AssetCheckout, MaintenanceRecord, DashboardStats, User } from "@/types";

// Mock data for assets
const MOCK_ASSETS: Asset[] = [
  {
    id: "1",
    name: "MacBook Pro 16\"",
    type: "Laptop",
    status: "in-use",
    purchaseDate: "2023-01-15",
    purchaseCost: 2499.99,
    assignedTo: "3",
    assignedToName: "Regular User",
    location: "Main Office",
    description: "16-inch MacBook Pro with M1 Pro chip",
    serialNumber: "MBPR1612345",
    warrantyExpiryDate: "2025-01-15",
    lastMaintenanceDate: "2023-07-20",
    nextMaintenanceDate: "2023-10-20",
    createdAt: "2023-01-10",
  },
  {
    id: "2",
    name: "Dell XPS 15",
    type: "Laptop",
    status: "available",
    purchaseDate: "2022-11-05",
    purchaseCost: 1899.99,
    location: "Storage Room",
    description: "15-inch Dell XPS with Intel i9",
    serialNumber: "DX1567890",
    warrantyExpiryDate: "2024-11-05",
    lastMaintenanceDate: "2023-06-10",
    nextMaintenanceDate: "2023-09-10",
    createdAt: "2022-10-30",
  },
  {
    id: "3",
    name: "HP LaserJet Pro",
    type: "Printer",
    status: "maintenance",
    purchaseDate: "2022-05-20",
    purchaseCost: 399.99,
    location: "Marketing Department",
    description: "Color laser printer",
    serialNumber: "HPLP98765",
    warrantyExpiryDate: "2024-05-20",
    lastMaintenanceDate: "2023-08-05",
    nextMaintenanceDate: "2023-11-05",
    createdAt: "2022-05-15",
  },
  {
    id: "4",
    name: "iPhone 14 Pro",
    type: "Mobile Device",
    status: "in-use",
    purchaseDate: "2023-03-10",
    purchaseCost: 1099.99,
    assignedTo: "2",
    assignedToName: "Manager User",
    location: "Field Office",
    description: "256GB iPhone 14 Pro",
    serialNumber: "IP14P54321",
    warrantyExpiryDate: "2024-03-10",
    lastMaintenanceDate: "2023-06-15",
    nextMaintenanceDate: "2023-09-15",
    createdAt: "2023-03-05",
  },
  {
    id: "5",
    name: "Logitech Conference System",
    type: "Conference Equipment",
    status: "available",
    purchaseDate: "2022-09-15",
    purchaseCost: 799.99,
    location: "Conference Room A",
    description: "Complete conference room audio system",
    serialNumber: "LCS12345",
    warrantyExpiryDate: "2024-09-15",
    lastMaintenanceDate: "2023-05-20",
    nextMaintenanceDate: "2023-08-20",
    createdAt: "2022-09-10",
  },
  {
    id: "6",
    name: "Samsung Smart Monitor",
    type: "Monitor",
    status: "in-use",
    purchaseDate: "2023-02-01",
    purchaseCost: 349.99,
    assignedTo: "1",
    assignedToName: "Admin User",
    location: "Engineering Department",
    description: "32-inch 4K smart monitor",
    serialNumber: "SSM87654",
    warrantyExpiryDate: "2025-02-01",
    lastMaintenanceDate: "2023-07-01",
    nextMaintenanceDate: "2023-10-01",
    createdAt: "2023-01-25",
  },
  {
    id: "7",
    name: "Office Desk",
    type: "Furniture",
    status: "in-use",
    purchaseDate: "2022-04-10",
    purchaseCost: 299.99,
    assignedTo: "3",
    assignedToName: "Regular User",
    location: "Main Office",
    description: "Adjustable standing desk",
    serialNumber: "OD98765",
    warrantyExpiryDate: "2027-04-10",
    createdAt: "2022-04-05",
  },
  {
    id: "8",
    name: "Cisco Network Switch",
    type: "Networking Equipment",
    status: "available",
    purchaseDate: "2022-08-20",
    purchaseCost: 1299.99,
    location: "Server Room",
    description: "48-port gigabit network switch",
    serialNumber: "CNS45678",
    warrantyExpiryDate: "2025-08-20",
    lastMaintenanceDate: "2023-04-15",
    nextMaintenanceDate: "2023-10-15",
    createdAt: "2022-08-15",
  },
  {
    id: "9",
    name: "Adobe Creative Cloud License",
    type: "Software License",
    status: "in-use",
    purchaseDate: "2023-01-01",
    purchaseCost: 599.99,
    assignedTo: "2",
    assignedToName: "Manager User",
    location: "N/A",
    description: "Annual subscription for Adobe Creative Cloud",
    serialNumber: "ACC123456",
    warrantyExpiryDate: "2024-01-01",
    createdAt: "2022-12-20",
  },
  {
    id: "10",
    name: "Projector",
    type: "Presentation Equipment",
    status: "retired",
    purchaseDate: "2018-06-15",
    purchaseCost: 599.99,
    location: "Storage Room",
    description: "4K DLP projector",
    serialNumber: "PRJ56789",
    warrantyExpiryDate: "2020-06-15",
    lastMaintenanceDate: "2021-10-10",
    createdAt: "2018-06-10",
  }
];

// Mock data for maintenance records
const MOCK_MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  {
    id: "1",
    assetId: "1",
    maintenanceType: "preventive",
    maintenanceDate: "2023-07-20",
    performedBy: "TechSupport Team",
    cost: 49.99,
    description: "Regular software update and hardware inspection",
    notes: "No issues found",
    createdAt: "2023-07-20",
  },
  {
    id: "2",
    assetId: "3",
    maintenanceType: "corrective",
    maintenanceDate: "2023-08-05",
    performedBy: "HP Service Center",
    cost: 189.99,
    description: "Fixed paper jam issue and replaced toner",
    notes: "Device needed thorough cleaning",
    createdAt: "2023-08-05",
  },
  {
    id: "3",
    assetId: "4",
    maintenanceType: "preventive",
    maintenanceDate: "2023-06-15",
    performedBy: "IT Department",
    cost: 29.99,
    description: "iOS update and security check",
    notes: "Recommended screen protector replacement",
    createdAt: "2023-06-15",
  },
  {
    id: "4",
    assetId: "6",
    maintenanceType: "preventive",
    maintenanceDate: "2023-07-01",
    performedBy: "IT Department",
    cost: 19.99,
    description: "Firmware update and screen calibration",
    notes: "User reported occasional flickering - fixed with update",
    createdAt: "2023-07-01",
  },
  {
    id: "5",
    assetId: "8",
    maintenanceType: "preventive",
    maintenanceDate: "2023-04-15",
    performedBy: "Network Admin",
    cost: 149.99,
    description: "Firmware update and performance optimization",
    notes: "Replaced cooling fan",
    createdAt: "2023-04-15",
  }
];

// Mock data for asset checkouts
const MOCK_CHECKOUTS: AssetCheckout[] = [
  {
    id: "1",
    assetId: "1",
    userId: "3",
    checkoutDate: "2023-02-01",
    expectedReturnDate: "2024-02-01",
    notes: "Assigned for project work",
    createdAt: "2023-02-01",
  },
  {
    id: "2",
    assetId: "4",
    userId: "2",
    checkoutDate: "2023-03-15",
    expectedReturnDate: "2024-03-15",
    notes: "For client meetings and field work",
    createdAt: "2023-03-15",
  },
  {
    id: "3",
    assetId: "6",
    userId: "1",
    checkoutDate: "2023-02-10",
    expectedReturnDate: "2024-02-10",
    notes: "For development work",
    createdAt: "2023-02-10",
  },
  {
    id: "4",
    assetId: "7",
    userId: "3",
    checkoutDate: "2022-04-15",
    expectedReturnDate: null,
    notes: "Office furniture",
    createdAt: "2022-04-15",
  },
  {
    id: "5",
    assetId: "9",
    userId: "2",
    checkoutDate: "2023-01-05",
    expectedReturnDate: "2024-01-05",
    notes: "For design work",
    createdAt: "2023-01-05",
  },
];

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: "2022-01-01",
  },
  {
    id: "2",
    email: "manager@example.com",
    firstName: "Manager",
    lastName: "User",
    role: "manager",
    createdAt: "2022-01-15",
  },
  {
    id: "3",
    email: "user@example.com",
    firstName: "Regular",
    lastName: "User",
    role: "user",
    createdAt: "2022-02-01",
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Asset Service API
export const assetService = {
  // Get all assets with optional filters
  getAssets: async (filters?: { 
    status?: string;
    type?: string;
    search?: string;
  }): Promise<Asset[]> => {
    await delay(500);
    
    let filteredAssets = [...MOCK_ASSETS];
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        filteredAssets = filteredAssets.filter(asset => asset.status === filters.status);
      }
      
      if (filters.type && filters.type !== 'all') {
        filteredAssets = filteredAssets.filter(asset => asset.type === filters.type);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredAssets = filteredAssets.filter(asset => 
          asset.name.toLowerCase().includes(searchLower) || 
          asset.serialNumber?.toLowerCase().includes(searchLower) ||
          asset.description?.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return filteredAssets;
  },
  
  // Get asset types
  getAssetTypes: async (): Promise<string[]> => {
    await delay(300);
    return Array.from(new Set(MOCK_ASSETS.map(asset => asset.type)));
  },
  
  // Get a single asset by ID
  getAssetById: async (id: string): Promise<Asset | undefined> => {
    await delay(300);
    const asset = MOCK_ASSETS.find(asset => asset.id === id);
    
    if (asset && asset.assignedTo) {
      const user = MOCK_USERS.find(user => user.id === asset.assignedTo);
      if (user) {
        asset.assignedToName = `${user.firstName} ${user.lastName}`;
      }
    }
    
    return asset;
  },
  
  // Add a new asset
  addAsset: async (asset: Omit<Asset, 'id' | 'createdAt'>): Promise<Asset> => {
    await delay(800);
    
    const newAsset: Asset = {
      ...asset,
      id: String(MOCK_ASSETS.length + 1),
      createdAt: new Date().toISOString(),
    };
    
    MOCK_ASSETS.push(newAsset);
    return newAsset;
  },
  
  // Update an existing asset
  updateAsset: async (id: string, assetData: Partial<Asset>): Promise<Asset> => {
    await delay(800);
    
    const index = MOCK_ASSETS.findIndex(asset => asset.id === id);
    if (index === -1) throw new Error("Asset not found");
    
    MOCK_ASSETS[index] = { ...MOCK_ASSETS[index], ...assetData };
    
    return MOCK_ASSETS[index];
  },
  
  // Delete an asset
  deleteAsset: async (id: string): Promise<void> => {
    await delay(800);
    
    const index = MOCK_ASSETS.findIndex(asset => asset.id === id);
    if (index === -1) throw new Error("Asset not found");
    
    MOCK_ASSETS.splice(index, 1);
  },
  
  // Get maintenance records for an asset
  getMaintenanceRecords: async (assetId: string): Promise<MaintenanceRecord[]> => {
    await delay(500);
    return MOCK_MAINTENANCE_RECORDS.filter(record => record.assetId === assetId);
  },
  
  // Add a maintenance record
  addMaintenanceRecord: async (record: Omit<MaintenanceRecord, 'id' | 'createdAt'>): Promise<MaintenanceRecord> => {
    await delay(800);
    
    const newRecord: MaintenanceRecord = {
      ...record,
      id: String(MOCK_MAINTENANCE_RECORDS.length + 1),
      createdAt: new Date().toISOString(),
    };
    
    MOCK_MAINTENANCE_RECORDS.push(newRecord);
    
    // Update the asset's last maintenance date
    const asset = MOCK_ASSETS.find(asset => asset.id === record.assetId);
    if (asset) {
      asset.lastMaintenanceDate = record.maintenanceDate;
    }
    
    return newRecord;
  },
  
  // Get checkout history for an asset
  getAssetCheckouts: async (assetId: string): Promise<AssetCheckout[]> => {
    await delay(500);
    return MOCK_CHECKOUTS.filter(checkout => checkout.assetId === assetId);
  },
  
  // Checkout an asset
  checkoutAsset: async (checkout: Omit<AssetCheckout, 'id' | 'createdAt'>): Promise<AssetCheckout> => {
    await delay(800);
    
    const newCheckout: AssetCheckout = {
      ...checkout,
      id: String(MOCK_CHECKOUTS.length + 1),
      createdAt: new Date().toISOString(),
    };
    
    MOCK_CHECKOUTS.push(newCheckout);
    
    // Update the asset status and assigned user
    const asset = MOCK_ASSETS.find(asset => asset.id === checkout.assetId);
    if (asset) {
      asset.status = "in-use";
      asset.assignedTo = checkout.userId;
      
      const user = MOCK_USERS.find(user => user.id === checkout.userId);
      if (user) {
        asset.assignedToName = `${user.firstName} ${user.lastName}`;
      }
    }
    
    return newCheckout;
  },
  
  // Check in an asset
  checkinAsset: async (assetId: string): Promise<void> => {
    await delay(800);
    
    // Find the active checkout
    const checkoutIndex = MOCK_CHECKOUTS.findIndex(
      checkout => checkout.assetId === assetId && !checkout.returnDate
    );
    
    if (checkoutIndex === -1) throw new Error("No active checkout found for this asset");
    
    // Update the checkout with return date
    MOCK_CHECKOUTS[checkoutIndex].returnDate = new Date().toISOString();
    
    // Update the asset status
    const asset = MOCK_ASSETS.find(asset => asset.id === assetId);
    if (asset) {
      asset.status = "available";
      asset.assignedTo = undefined;
      asset.assignedToName = undefined;
    }
  },
  
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(500);
    
    const availableAssets = MOCK_ASSETS.filter(asset => asset.status === "available").length;
    const inUseAssets = MOCK_ASSETS.filter(asset => asset.status === "in-use").length;
    const maintenanceAssets = MOCK_ASSETS.filter(asset => asset.status === "maintenance").length;
    const retiredAssets = MOCK_ASSETS.filter(asset => asset.status === "retired").length;
    
    const totalMaintenanceCost = MOCK_MAINTENANCE_RECORDS.reduce(
      (total, record) => total + record.cost, 0
    );
    
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.setDate(now.getDate() + 30));
    
    const upcomingMaintenance = MOCK_ASSETS.filter(asset => {
      if (!asset.nextMaintenanceDate) return false;
      const maintDate = new Date(asset.nextMaintenanceDate);
      return maintDate <= thirtyDaysFromNow;
    }).length;
    
    return {
      totalAssets: MOCK_ASSETS.length,
      availableAssets,
      inUseAssets,
      maintenanceAssets,
      retiredAssets,
      totalMaintenanceCost,
      upcomingMaintenance,
    };
  },
  
  // Get users for assignment
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return MOCK_USERS;
  },
};
