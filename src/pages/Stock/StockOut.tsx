import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import StockOutForm from './stock-out.form';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import Filters, {
  type Filter,
  type FilterOption
} from '../../components/ui/Filters';
import DateRangeFilter from '../../components/ui/DatePicker';
import { customStyles } from '../../utils/ui.helper.styles';
import { useStockStore } from '../../store/stockStore';
import { LogOut, Plus, RotateCcw } from 'lucide-react';
import ReturnStockForm from './Return.item';
import { useCategoryStore } from '../../store/categoriesStore';
import { formatStockTransactions } from '../../utils/auth';

type TabType = 'STOCK' | 'STOCK_OUT';

const Stock = () => {
  const {
    fetchStock,
    stockOutSucess,
    stock,
    transactions,
    stockLoading,
    fetchAllTransaction,
    updateStock
  } = useStockStore();

  const { resetStockOutSuccess } = useStockStore();

  const { fetchCategories, categories } = useCategoryStore();

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
  const [transactionType, setTransactionType] = useState<FilterOption | null>(
    null
  );
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);

  //Handle Return Item
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [transaction, setTransaction] = useState<{
    id: string;
    productName: string;
    productId: string;
    productType: 'ITEM' | 'QUANTITY';
    quantity: number;
  }>({
    id: '',
    productName: '',
    productType: 'ITEM',
    quantity: 0,
    productId: ''
  });

  const filteredStockOutData = formatStockTransactions(
    transactions?.transactions
  )?.filter((item) => {
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

  useEffect(() => {
    fetchStock();
    fetchAllTransaction();
    fetchCategories();
  }, [fetchStock, fetchAllTransaction, fetchCategories, activeTab]);

  const categoryOptions =
    categories?.map((c: any) => ({ value: c.id, label: c.name })) ?? [];

  const stockInColumns = (handleUpdateStock) => [
    {
      name: 'Product',
      selector: (row: any) => row?.product?.name,
      sortable: true
    },
    {
      name: 'Category',
      selector: (row: any) =>
        row?.product?.category ? row?.product?.category?.name : '-',
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
      cell: (row: any) =>
        row?.product?.entryDate
          ? new Date(row.product.entryDate).toLocaleDateString()
          : '-'
    },
    // {
    //   name: 'Status',
    //   selector: (row: any) => row.status || 'AVAILABLE',
    //   cell: (row: any) => (
    //     <span
    //       className={`px-3 py-1 rounded-full text-xs font-semibold ${
    //         row.status === 'AVAILABLE'
    //           ? 'bg-green-100 text-green-800'
    //           : 'bg-gray-100 text-gray-800'
    //       }`}
    //     >
    //       {row.status || 'AVAILABLE'}
    //     </span>
    //   )
    // },
    {
      name: 'Action',
      cell: (row: any) => (
        <div className="inline-flex items-center gap-1">
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700  hover:bg-red-600 hover:text-white transition text-xs font-semibold  border border-red-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <LogOut size={14} />
            Stock Out
          </button>
          {row?.product?.type !== 'ITEM' && (
            <button
              title="Increase stock quantity"
              onClick={() => handleUpdateStock(row)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700  hover:bg-green-600 hover:text-white transition text-xs font-semibold  border border-green-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      )
    }
  ];

  const stockOutColumns = (returnAction: (param: any) => void) => [
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
      name: 'Prod.Qty',
      selector: (row: any) => row.quantity,
      sortable: true,
      flex: 0.5
    },
    {
      name: 'Transaction Date',
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
      name: 'Client Name',
      selector: (row: any) => row.clientName,
      sortable: true
    },
    {
      name: 'Returned Date',
      selector: (row: any) => row.returnDate,
      cell: (row: any) => {
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.type === 'RETURNED'
              ? new Date(row.returnDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : '-'}
          </span>
        );
      }
    },
    {
      name: 'Actions',
      cell: (row: any) =>
        row.type === 'RENT' ? (
          <button
            title={`Return ${row.productName}`}
            onClick={() => returnAction(row)}
            disabled={row.quantity === 0}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <RotateCcw
              size={14}
              className="animate-[spin_0.6s_ease-in-out_1]"
            />
            Return
          </button>
        ) : (
          <span>-</span>
        )
    }
  ];

  const filters = (tab: TabType): Filter[] => {
    return tab === 'STOCK'
      ? []
      : [
          {
            key: 'category',
            label: 'Category',
            options: categoryOptions.length > 0 ? categoryOptions : [],
            value: categoryFilter,
            onChange: setCategoryFilter
          },
          {
            key: 'type',
            label: 'Transaction type',
            options: [
              { value: 'SOLD', label: 'SOLD' },
              { value: 'RENT', label: 'RENTED' },
              { value: 'RETURNED', label: 'RETURNED' }
            ],
            value: transactionType,
            onChange: setTransactionType
          }
        ];
  };

  const handleSearchProductInStock = (data) => {
    fetchStock({ searchKey: data });
  };

  const handleClose = () => {
    setShowReturnModal(false);
  };

  const returnAction = (data: any) => {
    setTransaction(data);
    setShowReturnModal(true);
  };

  const handleUpdateStock = (data: any) => {
    const payload = { quantity: data.quantity + 1 };
    updateStock(payload as any, data.id);
  };
  useEffect(() => {
    if (stockOutSucess) {
      fetchStock();
      fetchAllTransaction();
      resetStockOutSuccess();
    }
  }, [stockOutSucess, fetchStock, fetchAllTransaction, resetStockOutSuccess]);
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
      <div className="flex justify-between gap-2 mb-6">
        <div className="inline-flex rounded-full border border-[#073c56]/30 bg-gray-100 p-1 gap-2">
          {(['STOCK', 'STOCK_OUT'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#073c56] text-white shadow-sm'
                    : 'bg-transparent text-[#073c56] hover:text-white'
                }`}
              >
                {tab === 'STOCK' ? 'Stock' : 'Transactions'}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-1 rounded-full border border-[#073c56] text-[#073c56] bg-transparent transition-all duration-200 ease-in-out hover:bg-[#073c56] hover:text-white"
        >
          <p className="text-sm font-medium">+ Add item in stock</p>
        </button>
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
            <>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-0 rounded-full transition bg-[#073c56] text-white"
              >
                <p className="font-sm py-1">Record stock out</p>
              </button>
            </>
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
              columns={stockInColumns(handleUpdateStock)}
              data={stock?.stocks}
              highlightOnHover
              pointerOnHover
              customStyles={customStyles}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 50]}
              responsive
              striped
            />
          ) : (
            activeTab === 'STOCK_OUT' && (
              <DataTable
                columns={stockOutColumns(returnAction)}
                data={filteredStockOutData}
                highlightOnHover
                pointerOnHover
                customStyles={customStyles}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 50]}
                responsive
                striped
              />
            )
          )}
        </div>
      </div>
      <ReturnStockForm
        handleClose={handleClose}
        transaction={transaction}
        isOpen={showReturnModal}
      />
    </div>
  );
};

export default Stock;
