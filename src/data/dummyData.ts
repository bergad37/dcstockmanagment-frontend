import type { StockTransaction } from '../api/stockApi';

// Analytics Dummy Data
export const analyticsFlowData = [
  { month: 'Jan', inbound: 240, outbound: 220, net: 20 },
  { month: 'Feb', inbound: 300, outbound: 280, net: 20 },
  { month: 'Mar', inbound: 280, outbound: 320, net: -40 },
  { month: 'Apr', inbound: 390, outbound: 350, net: 40 },
  { month: 'May', inbound: 350, outbound: 420, net: -70 },
  { month: 'Jun', inbound: 480, outbound: 400, net: 80 }
];

export const highMovingItemsData = [
  {
    name: 'USB-C Hub 7-in-1',
    category: 'Accessories',
    units: 450,
    percentage: 28
  },
  {
    name: 'Laptop Dell XPS 15',
    category: 'Computers',
    units: 380,
    percentage: 24
  },
  {
    name: 'Keyboard Mechanical RGB',
    category: 'Peripherals',
    units: 320,
    percentage: 20
  },
  {
    name: 'Mouse Wireless',
    category: 'Accessories',
    units: 280,
    percentage: 18
  },
  {
    name: 'Monitor LG 27 inch',
    category: 'Displays',
    units: 240,
    percentage: 15
  }
];

export const lowMovingItemsData = [
  {
    name: 'Webcam HD 1080p',
    category: 'Accessories',
    units: 45,
    percentage: 3
  },
  { name: 'External SSD 1TB', category: 'Storage', units: 78, percentage: 5 },
  {
    name: 'Office Chair Premium',
    category: 'Furniture',
    units: 92,
    percentage: 6
  },
  {
    name: 'Monitor LG 27 inch',
    category: 'Displays',
    units: 110,
    percentage: 7
  },
  {
    name: 'Keyboard Mechanical RGB',
    category: 'Peripherals',
    units: 125,
    percentage: 8
  }
];

export const categoryPerformanceData = [
  { category: 'Accessories', sold: 750, rented: 120, revenue: 45000 },
  { category: 'Computers', sold: 380, rented: 90, revenue: 95000 },
  { category: 'Peripherals', sold: 445, rented: 200, revenue: 28000 },
  { category: 'Displays', sold: 350, rented: 80, revenue: 35000 },
  { category: 'Storage', sold: 280, rented: 45, revenue: 18000 },
  { category: 'Furniture', sold: 200, rented: 150, revenue: 22000 }
];

export const inventoryTurnoverData = [
  { product: 'USB-C Hub', turnover: 12.5 },
  { product: 'Keyboard RGB', turnover: 9.8 },
  { product: 'Mouse Wireless', turnover: 8.3 },
  { product: 'Laptop Dell', turnover: 7.2 },
  { product: 'Monitor LG', turnover: 5.6 },
  { product: 'External SSD', turnover: 4.1 },
  { product: 'Webcam HD', turnover: 2.3 },
  { product: 'Office Chair', turnover: 1.8 }
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
    transactionDate: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
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
    transactionDate: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000
    ).toISOString(),
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
    transactionDate: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000
    ).toISOString(),
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
    transactionDate: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000
    ).toISOString(),
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

// Dummy data for available stock
export const dummyStockIn = [
  {
    id: '1',
    productName: 'Laptop Dell XPS 13',
    quantity: 10,
    dateAdded: '2025-12-01T09:00:00Z',
    status: 'AVAILABLE'
  },
  {
    id: '2',
    productName: 'Wireless Mouse',
    quantity: 25,
    dateAdded: '2025-12-05T14:30:00Z',
    status: 'AVAILABLE'
  },
  {
    id: '3',
    productName: 'HDMI Cable',
    quantity: 50,
    dateAdded: '2025-12-07T12:00:00Z',
    status: 'AVAILABLE'
  }
];

// Dummy data for stock out (sold/rented items)
export const stockInDummyData = [
  {
    id: 1,
    productName: 'Canon EOS R5 Camera',
    quantity: 5,
    dateAdded: '2025-01-03T09:30:00Z',
    status: 'AVAILABLE'
  },
  {
    id: 2,
    productName: 'DJI Mavic Air 2 Drone',
    quantity: 2,
    dateAdded: '2025-01-07T14:10:00Z',
    status: 'AVAILABLE'
  },
  {
    id: 3,
    productName: 'MacBook Pro 16-inch',
    quantity: 1,
    dateAdded: '2024-12-20T11:45:00Z',
    status: 'OUT_OF_STOCK'
  },
  {
    id: 4,
    productName: 'Epson Projector X200',
    quantity: 3,
    dateAdded: '2025-01-12T16:00:00Z'
    // status omitted → defaults to AVAILABLE
  },
  {
    id: 5,
    productName: 'HP LaserJet Pro Printer',
    quantity: 10,
    dateAdded: '2024-11-28T08:20:00Z',
    status: 'AVAILABLE'
  },
  {
    id: 6,
    productName: 'Samsung 55" Smart TV',
    quantity: 0,
    dateAdded: '2024-12-15T13:30:00Z',
    status: 'OUT_OF_STOCK'
  }
];



export const stockOutDummyData = [
  {
    id: 1,
    productName: 'Canon EOS R5 Camera',
    type: 'SOLD',
    quantity: 1,
    transactionDate: '2025-01-05T10:30:00Z',
    status: 'COMPLETED'
  },
  {
    id: 2,
    productName: 'DJI Mavic Air 2 Drone',
    type: 'RENTED',
    quantity: 1,
    transactionDate: '2025-01-10T14:15:00Z',
    status: 'ACTIVE'
  },
  {
    id: 3,
    productName: 'MacBook Pro 16-inch',
    type: 'RENTED',
    quantity: 2,
    transactionDate: '2025-01-02T09:00:00Z',
    status: 'COMPLETED'
  },
  {
    id: 4,
    productName: 'Epson Projector X200',
    type: 'SOLD',
    quantity: 1,
    transactionDate: '2024-12-22T16:45:00Z'
    // status intentionally missing → defaults to COMPLETED
  },
  {
    id: 5,
    productName: 'HP LaserJet Pro Printer',
    type: 'RENTED',
    quantity: 1,
    transactionDate: '2025-01-12T11:20:00Z',
    status: 'ACTIVE'
  },
  {
    id: 6,
    productName: 'Samsung 55" Smart TV',
    type: 'SOLD',
    quantity: 3,
    transactionDate: '2025-01-08T13:00:00Z',
    status: 'COMPLETED'
  }
];


export const stockOut = [
  {
    id: '101',
    productName: 'Laptop Dell XPS 13',
    type: 'SOLD',
    quantity: 2,
    transactionDate: '2025-12-10T10:15:00Z',
    status: 'COMPLETED'
  },
  {
    id: '102',
    productName: 'Wireless Mouse',
    type: 'RENTED',
    quantity: 5,
    transactionDate: '2025-12-11T09:00:00Z',
    returnDate: '2025-12-20T09:00:00Z',
    status: 'ACTIVE'
  },
  {
    id: '103',
    productName: 'HDMI Cable',
    type: 'SOLD',
    quantity: 10,
    transactionDate: '2025-12-12T16:00:00Z',
    status: 'COMPLETED'
  },
  {
    id: '104',
    productName: 'Projector Epson',
    type: 'RENTED',
    quantity: 1,
    transactionDate: '2025-12-13T11:30:00Z',
    returnDate: '2025-12-18T11:30:00Z',
    status: 'ACTIVE'
  }
];
