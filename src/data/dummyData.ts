import type { StockTransaction } from '../api/stockApi';

// Analytics Dummy Data
export const analyticsFlowData = [
  { month: 'Jan', inbound: 240, outbound: 220, net: 20 },
  { month: 'Feb', inbound: 300, outbound: 280, net: 20 },
  { month: 'Mar', inbound: 280, outbound: 320, net: -40 },
  { month: 'Apr', inbound: 390, outbound: 350, net: 40 },
  { month: 'May', inbound: 350, outbound: 420, net: -70 },
  { month: 'Jun', inbound: 480, outbound: 400, net: 80 },
];

export const highMovingItemsData = [
  { name: 'USB-C Hub 7-in-1', category: 'Accessories', units: 450, percentage: 28 },
  { name: 'Laptop Dell XPS 15', category: 'Computers', units: 380, percentage: 24 },
  { name: 'Keyboard Mechanical RGB', category: 'Peripherals', units: 320, percentage: 20 },
  { name: 'Mouse Wireless', category: 'Accessories', units: 280, percentage: 18 },
  { name: 'Monitor LG 27 inch', category: 'Displays', units: 240, percentage: 15 },
];

export const lowMovingItemsData = [
  { name: 'Webcam HD 1080p', category: 'Accessories', units: 45, percentage: 3 },
  { name: 'External SSD 1TB', category: 'Storage', units: 78, percentage: 5 },
  { name: 'Office Chair Premium', category: 'Furniture', units: 92, percentage: 6 },
  { name: 'Monitor LG 27 inch', category: 'Displays', units: 110, percentage: 7 },
  { name: 'Keyboard Mechanical RGB', category: 'Peripherals', units: 125, percentage: 8 },
];

export const categoryPerformanceData = [
  { category: 'Accessories', sold: 750, rented: 120, revenue: 45000 },
  { category: 'Computers', sold: 380, rented: 90, revenue: 95000 },
  { category: 'Peripherals', sold: 445, rented: 200, revenue: 28000 },
  { category: 'Displays', sold: 350, rented: 80, revenue: 35000 },
  { category: 'Storage', sold: 280, rented: 45, revenue: 18000 },
  { category: 'Furniture', sold: 200, rented: 150, revenue: 22000 },
];

export const inventoryTurnoverData = [
  { product: 'USB-C Hub', turnover: 12.5 },
  { product: 'Keyboard RGB', turnover: 9.8 },
  { product: 'Mouse Wireless', turnover: 8.3 },
  { product: 'Laptop Dell', turnover: 7.2 },
  { product: 'Monitor LG', turnover: 5.6 },
  { product: 'External SSD', turnover: 4.1 },
  { product: 'Webcam HD', turnover: 2.3 },
  { product: 'Office Chair', turnover: 1.8 },
];

export const dummyStockOut: StockTransaction[] = [
  {
    id: '1',
    productId: 'PROD001',
    productName: 'Laptop Dell XPS 15',
    type: 'SOLD',
    clientName: 'John Doe',
    clientEmail: 'john.doe@example.com',
    quantity: 2,
    transactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    productId: 'PROD002',
    productName: 'Office Chair Premium',
    type: 'RENTED',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah.j@company.com',
    quantity: 10,
    transactionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    productId: 'PROD003',
    productName: 'Monitor LG 27 inch',
    type: 'SOLD',
    clientName: 'Mike Chen',
    clientEmail: 'mike.chen@tech.com',
    quantity: 5,
    transactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    productId: 'PROD004',
    productName: 'Keyboard Mechanical RGB',
    type: 'RENTED',
    clientName: 'Emily Davis',
    clientEmail: 'emily.davis@startup.io',
    quantity: 20,
    transactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    productId: 'PROD005',
    productName: 'Mouse Wireless',
    type: 'SOLD',
    clientName: 'Robert Wilson',
    clientEmail: 'r.wilson@company.com',
    quantity: 15,
    transactionDate: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    productId: 'PROD001',
    productName: 'Laptop Dell XPS 15',
    type: 'RENTED',
    clientName: 'Lisa Anderson',
    clientEmail: 'l.anderson@freelance.com',
    quantity: 1,
    transactionDate: new Date().toISOString(),
    returnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const dummyInventory: StockTransaction[] = [
  {
    id: 'inv1',
    productId: 'PROD001',
    productName: 'Laptop Dell XPS 15',
    type: 'SOLD',
    clientName: '',
    clientEmail: '',
    quantity: 45,
    transactionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv2',
    productId: 'PROD002',
    productName: 'Office Chair Premium',
    type: 'SOLD',
    clientName: '',
    clientEmail: '',
    quantity: 8,
    transactionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv3',
    productId: 'PROD003',
    productName: 'Monitor LG 27 inch',
    type: 'SOLD',
    clientName: '',
    clientEmail: '',
    quantity: 32,
    transactionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv4',
    productId: 'PROD004',
    productName: 'Keyboard Mechanical RGB',
    type: 'SOLD',
    clientName: '',
    clientEmail: '',
    quantity: 5,
    transactionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv5',
    productId: 'PROD005',
    productName: 'Mouse Wireless',
    type: 'SOLD',
    clientName: '',
    clientEmail: '',
    quantity: 0,
    transactionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv6',
    productId: 'PROD006',
    productName: 'USB-C Hub 7-in-1',
    type: 'SOLD',
    clientName: '',
    clientEmail: '',
    quantity: 128,
    transactionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv7',
    productId: 'PROD007',
    productName: 'External SSD 1TB',
    type: 'SOLD',
    clientName: '',
    clientEmail: '',
    quantity: 23,
    transactionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv8',
    productId: 'PROD008',
    productName: 'Webcam HD 1080p',
    type: 'SOLD',
    clientName: '',
    clientEmail: '',
    quantity: 12,
    transactionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
