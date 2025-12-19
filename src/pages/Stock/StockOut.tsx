import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import StockOutForm from './stock-out.form';
// import { useStockStore } from '../../store/stockStore';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { stockOutDummyData } from '../../data/dummyData';
import SearchBar from '../../components/ui/SearchBar';
import Filters, {
  type Filter,
  type FilterOption
} from '../../components/ui/Filters';
import DateRangeFilter from '../../components/ui/DatePicker';
import { customStyles } from '../../utils/ui.helper.styles';
import { useStockStore } from '../../store/stockStore';
import { LogOut } from 'lucide-react';

type TabType = 'STOCK' | 'STOCK_OUT';

const Stock = () => {
  const { fetchStock, stock, stockLoading } = useStockStore();

  const [activeTab, setActiveTab] = useState<TabType>('STOCK');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    label: string;
    value: string;
    type: 'ITEM' | 'QUANTITY';
  } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<FilterOption | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<FilterOption | null>(null);
  const [transactionType, setTransactionType] = useState<FilterOption | null>(
    null
  );
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);

  const filteredStockOutData = stockOutDummyData.filter((item) => {
    if (dateFrom && new Date(item.transactionDate) < new Date(dateFrom)) {
      return false;
    }

    if (dateTo && new Date(item.transactionDate) > new Date(dateTo)) {
      return false;
    }

    if (transactionType && item.type !== transactionType.value) {
      return false;
    }

    return true;
  });

  // const [searchStockProduct, setSearchStockProduct] = useState(undefined);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const handleReturn = (itemId: string) => {
    console.log('Return item:', itemId);
  };

  const stockInColumns = [
    {
      name: 'Product',
      selector: (row: any) => row?.product?.name,
      sortable: true
    },
    {
      name: 'Quantity',
      selector: (row: any) => row.quantity,
      sortable: true
    },
    {
      name: 'Date Added',
      sortable: true,
      cell: (row: any) => new Date(row.product.entryDate).toLocaleDateString()
    },
    {
      name: 'Status',
      selector: (row: any) => row.status || 'AVAILABLE',
      cell: (row: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === 'AVAILABLE'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.status || 'AVAILABLE'}
        </span>
      )
    },
    {
      name: 'Action',
      cell: (row: any) => (
        <button
          title={`Record stock out for ${row.product?.name}`}
          onClick={() => {
            setSelectedProduct({
              label: row.product?.name,
              value: row.product?.id,
              type: row.product?.type
            });
            setShowForm(true);
          }}
          disabled={row.quantity === 0}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 text-red-700  hover:bg-red-600 hover:text-white transition text-xs font-semibold  border border-red-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <LogOut size={14} />
          Stock Out
        </button>
      )
    }
  ];

  const stockOutColumns = [
    {
      name: 'Product',
      selector: (row: any) => row.productName,
      sortable: true
    },
    {
      name: 'Type',
      selector: (row: any) => row.type,
      sortable: true,
      cell: (row: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.type === 'SOLD'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {row.type}
        </span>
      )
    },
    {
      name: 'Quantity',
      selector: (row: any) => row.quantity,
      sortable: true
    },
    {
      name: 'Date',
      selector: (row: any) => row.transactionDate,
      sortable: true,
      cell: (row: any) =>
        new Date(row.transactionDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
    },
    {
      name: 'Return',
      cell: (row: any) =>
        row.type === 'RENTED' && row.status === 'ACTIVE' ? (
          <Button
            label="Return"
            onClick={() => handleReturn(row.id)}
            bg="bg-green-600"
          />
        ) : (
          <span>-</span>
        )
    },
    {
      name: 'Status',
      selector: (row: any) => row.status || 'COMPLETED',
      cell: (row: any) => {
        const status = row.status || 'COMPLETED';
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {status}
          </span>
        );
      }
    }
  ];

  const filters = (tab: TabType): Filter[] => {
    return tab === 'STOCK'
      ? [
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'available', label: 'Available' },
              { value: 'out', label: 'Out Of Stock' }
            ],
            value: statusFilter,
            onChange: setStatusFilter
          }
        ]
      : [
          {
            key: 'category',
            label: 'Category',
            options: [
              { value: 'furniture', label: 'furniture' },
              { value: 'electronics', label: 'Electronics' }
            ],
            value: categoryFilter,
            onChange: setCategoryFilter
          },
          {
            key: 'type',
            label: 'Transaction type',
            options: [
              { value: 'SOLD', label: 'SOLD' },
              { value: 'RENT', label: 'RENTED' }
            ],
            value: transactionType,
            onChange: setTransactionType
          }
        ];
  };

  const handleSearchProductInStock = (data) => {
    fetchStock({ searchKey: data });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">
          Stock Management
        </h2>
        <p className="py-2 text-gray-600">
          Track available, sold, and rented items
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {(['STOCK', 'STOCK_OUT'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              activeTab === tab
                ? 'bg-[#073c56] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab === 'STOCK' ? 'Stock' : 'Stock Out'}
          </button>
        ))}
      </div>
      <div className="border rounded-xl py-12">
        <div className="mb-4 flex justify-between">
          <div className="flex gap-4 items-end">
            <SearchBar onSubmit={handleSearchProductInStock} />

            {activeTab === 'STOCK_OUT' && (
              <>
                <Filters filters={filters(activeTab)} />
                <DateRangeFilter
                  from={dateFrom}
                  to={dateTo}
                  onFromChange={setDateFrom}
                  onToChange={setDateTo}
                />
              </>
            )}
          </div>
          {activeTab === 'STOCK' && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-0 rounded-full transition bg-[#073c56] text-white"
            >
              <p className="font-sm py-1">Record stock out</p>
            </button>
          )}
        </div>

        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedProduct(null);
          }}
          title={'Register Stock Out'}
        >
          <StockOutForm
            handleClose={() => {
              setShowForm(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
          />
        </Modal>

        {/* DataTable */}
        <div className="bg-white my-12 shadow overflow-hidden">
          {stockLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#073c56]"></div>
                <p className="mt-4 text-gray-600">Loading records...</p>
              </div>
            </div>
          ) : activeTab === 'STOCK' ? (
            <DataTable
              columns={stockInColumns}
              data={stock?.stocks}
              highlightOnHover
              pointerOnHover
              customStyles={customStyles}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 20, 50]}
              responsive
              striped
            />
          ) : (
            <DataTable
              columns={stockOutColumns}
              data={filteredStockOutData}
              highlightOnHover
              pointerOnHover
              customStyles={customStyles}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 20, 50]}
              responsive
              striped
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Stock;
