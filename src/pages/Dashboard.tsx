import { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import {
  Search,
  Filter,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle
} from 'lucide-react';
import CustomSelect from '../components/ui/SelectField';
import { stockColumns } from '../utils/columns/stock.column';

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  serialNumber: string;
  costPrice: number;
  description?: string;
  warranty?: string;
}

const Dashboard = () => {
  // Mock stock data - replace with actual API call
  const [stockItems] = useState<StockItem[]>([
    {
      id: 'a3f9c2d4-6e71-4bf7-9c4d-1b4f92a0f7e1',
      name: 'HP EliteBook 840 G5',
      category: 'Electronics',
      quantity: 5,
      serialNumber: 'HP-840G5-2025-001',
      costPrice: 850,
      description: 'High-performance business laptop',
      warranty: '12 months'
    },
    {
      id: 'c9b7f61a-3394-4dc2-92a8-6d5e0795adbd',
      name: 'Office Desk – Walnut',
      category: 'Furniture',
      quantity: 2,
      serialNumber: 'DESK-WAL-88421',
      costPrice: 130,
      description: 'Sturdy executive desk',
      warranty: '6 months'
    },
    {
      id: 'f219d7ac-1d1d-4a1f-bd5e-34f9b4d2b0f8',
      name: 'TP-Link Archer C6 Router',
      category: 'Networking',
      quantity: 0,
      serialNumber: 'TPL-C6-99872',
      costPrice: 45,
      description: 'Dual-band Wi-Fi router',
      warranty: '12 months'
    },
    {
      id: '8c41b18c-6d19-4a6a-9673-f7e33c61e9d0',
      name: "Dell 24'' Monitor",
      category: 'Electronics',
      quantity: 8,
      serialNumber: 'DELL-24FHD-75629',
      costPrice: 160,
      description: 'Full HD LED monitor',
      warranty: '12 months'
    },
    {
      id: '5e7d3b6c-8e2a-4c70-bdc3-3ad4d0fe2d33',
      name: 'Ergonomic Office Chair',
      category: 'Furniture',
      quantity: 1,
      serialNumber: 'CHAIR-ERG-42119',
      costPrice: 75,
      description: 'Adjustable height chair',
      warranty: '6 months'
    },
    {
      id: '7f8e9d0a-1b2c-3d4e-5f6a-7b8c9d0e1f2a',
      name: 'Logitech MX Master 3',
      category: 'Electronics',
      quantity: 4,
      serialNumber: 'LOG-MX3-12345',
      costPrice: 99,
      description: 'Wireless mouse',
      warranty: '12 months'
    },
    {
      id: '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d',
      name: 'Standing Desk Converter',
      category: 'Furniture',
      quantity: 3,
      serialNumber: 'DESK-CONV-67890',
      costPrice: 120,
      description: 'Adjustable standing desk',
      warranty: '6 months'
    },
    {
      id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
      name: 'USB-C Hub',
      category: 'Electronics',
      quantity: 0,
      serialNumber: 'USB-HUB-11111',
      costPrice: 35,
      description: 'Multi-port USB-C hub',
      warranty: '12 months'
    }
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = stockItems.length;
    const inStock = stockItems.filter((item) => item.quantity >= 3).length;
    const lowStock = stockItems.filter(
      (item) => item.quantity > 0 && item.quantity < 3
    ).length;
    const outOfStock = stockItems.filter((item) => item.quantity === 0).length;
    const totalValue = stockItems.reduce(
      (sum, item) => sum + item.quantity * item.costPrice,
      0
    );

    return { totalItems, inStock, lowStock, outOfStock, totalValue };
  }, [stockItems]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(stockItems.map((item) => item.category))
    );
    return uniqueCategories;
  }, [stockItems]);

  // Filter stock items
  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' || item.category === categoryFilter;

      let matchesStatus = true;
      if (statusFilter === 'in-stock') {
        matchesStatus = item.quantity >= 3;
      } else if (statusFilter === 'low-stock') {
        matchesStatus = item.quantity > 0 && item.quantity < 3;
      } else if (statusFilter === 'out-of-stock') {
        matchesStatus = item.quantity === 0;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [stockItems, searchTerm, categoryFilter, statusFilter]);

  // Low stock items (quantity < 3)
  const lowStockItems = useMemo(() => {
    return filteredItems.filter(
      (item) => item.quantity > 0 && item.quantity < 3
    );
  }, [filteredItems]);

  return (
    <div className="w-full sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#073c56]">
          Stock Overview
        </h2>
        <p className="py-2 text-sm text-gray-600">
          Monitor and manage your inventory levels, track stock quantities, and
          identify low stock items.
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#EAECF0] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Items</p>
              <p className="text-2xl font-bold text-[#073c56]">
                {stats.totalItems}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#EAECF0] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Stock</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.inStock}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#EAECF0] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.lowStock}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#EAECF0] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.outOfStock}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#EAECF0] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-[#073c56]">
                $
                {stats.totalValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
            <div className="bg-[#073c56] bg-opacity-10 rounded-full p-3">
              <Package className="h-6 w-6 text-[#073c56]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="w-full m-2 rounded-xl border border-[#EAECF0] bg-white mb-6">
        <div className="px-4 py-4 border-b border-[#EAECF0]">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-[#475467]" />
            <h3 className="text-lg font-semibold text-[#073c56]">Filters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search Filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#EAECF0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#073c56] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <CustomSelect
                id="categoryFilter"
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...categories.map((c) => ({ value: c, label: c }))
                ]}
                value={{
                  value: categoryFilter,
                  label:
                    categoryFilter === 'all' ? 'All Categories' : categoryFilter
                }}
                onChange={(option) => setCategoryFilter(option?.value || 'all')}
              />
            </div>

            {/* Status Filter */}
            <div>
              <CustomSelect
                id="statusFilter"
                options={statusOptions}
                value={
                  statusOptions.find((o) => o.value === statusFilter) || null
                }
                onChange={(option) => setStatusFilter(option?.value || 'all')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="w-full m-2 rounded-xl border border-[#EAECF0] bg-white mb-6">
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-2 px-4 py-4 border-b border-[#EAECF0]">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#073c56]">
            Stock Inventory ({filteredItems.length} items)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <DataTable
            columns={stockColumns()}
            data={filteredItems}
            pagination
            paginationPerPage={10}
            fixedHeader
            responsive
            highlightOnHover
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: '#f9fafb',
                  borderBottom: '2px solid #EAECF0'
                }
              },
              headCells: {
                style: {
                  color: '#073c56',
                  fontWeight: '600',
                  fontSize: '14px'
                }
              },
              cells: {
                style: {
                  fontSize: '14px',
                  color: '#475467'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Low Stock Items Alert Section */}
      {lowStockItems.length > 0 && (
        <div className="w-full m-2 rounded-xl border border-yellow-200 bg-yellow-50 mb-6">
          <div className="px-4 py-4 border-b border-yellow-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-yellow-800">
                Low Stock Alert ({lowStockItems.length} items)
              </h2>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              The following items are running low and may need to be restocked
              soon.
            </p>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              columns={stockColumns()}
              data={lowStockItems}
              pagination={false}
              fixedHeader
              responsive
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: '#fef3c7',
                    borderBottom: '2px solid #fde68a'
                  }
                },
                headCells: {
                  style: {
                    color: '#92400e',
                    fontWeight: '600',
                    fontSize: '14px'
                  }
                },
                cells: {
                  style: {
                    fontSize: '14px',
                    color: '#78350f'
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
