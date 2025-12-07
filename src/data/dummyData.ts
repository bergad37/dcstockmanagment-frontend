import type { StockTransaction } from '../api/stockApi';

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
