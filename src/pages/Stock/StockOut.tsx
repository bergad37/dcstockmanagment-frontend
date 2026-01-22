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
import ReturnStockForm from './Return.item';
import { useCategoryStore } from '../../store/categoriesStore';
import { formatStockTransactions, getOverdueDays } from '../../utils/auth';
import { LogOut, Plus, RotateCcw } from 'lucide-react';

type TabType = 'STOCK' | 'STOCK_OUT' | 'CALIBRATION_STOCK';

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
    type: 'ITEM' | 'QUANTITY' | 'CALIBRATION';
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

  // Handle Details Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

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
    if (activeTab === 'CALIBRATION_STOCK') {
      fetchStock({ type: 'CALIBRATION' });
    } else {
      fetchStock(); // ITEM + QUANTITY
    }

    fetchAllTransaction();
    fetchCategories();
  }, [activeTab]);

  useEffect(() => {
    fetchAllTransaction();
    fetchCategories();
  }, [fetchAllTransaction, fetchCategories]);

  const categoryOptions =
    categories?.map((c: any) => ({ value: c.id, label: c.name })) ?? [];

  const closeStockOutModal = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const stockInColumns = (handleUpdateStock, isOnCalibrationTab) => {
    const columns = [
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
      }
    ];

    if (isOnCalibrationTab) {
      columns.push({
        name: 'Equip.Owner',
        selector: (row: any) => row?.product?.supplier?.name ?? '-',
        sortable: true
      });
    }

    columns.push(
      {
        name: 'Date Added',
        sortable: true,
        selector: (row: any) =>
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
            {row?.product?.type !== 'ITEM' &&
              row?.product?.type !== 'CALIBRATION' && (
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
    );

    return columns;
  };

  const isOverdue = (row: any) => {
    if (!row.expectedReturnDate) return false;
    const expectedDate = new Date(row.expectedReturnDate);
    const now = new Date();
    return now > expectedDate;
  };

  const stockOutColumns = (
    returnAction: (param: any) => void,
    viewDetailsAction: (param: any) => void
  ) => [
    {
      name: 'Product',
      selector: (row: any) => row.productName,
      sortable: true,
      cell: (row: any) => (
        <div className="relative inline-block max-w-full">
          {/* Product name */}
          <span className="block font-medium text-gray-900 pr-10">
            {row.productName}
          </span>

          {/* Overdue badge */}
          {isOverdue(row) && (
            <span
              className="absolute -bottom-4 right-0
                     inline-flex items-center gap-1
                     px-2 py-0.5 rounded-full
                     bg-red-50 text-red-700 text-[10px] font-semibold
                     shadow-sm border border-red-200"
            >
              • Overdue
            </span>
          )}
        </div>
      )
    },

    {
      name: 'Type',
      selector: (row: any) => row.type,
      sortable: true,
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
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
      cell: (row: any) => (
        <div className="flex gap-2 flex-col my-3">
          <button
            title="View Details"
            onClick={() => viewDetailsAction(row)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition text-xs font-semibold border border-blue-200"
          >
            View Details
          </button>
          {row.type === 'RENT' ? (
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
          )}
        </div>
      )
    }
  ];

  const filters = (tab: TabType): Filter[] => {
    return tab === 'STOCK'
      ? []
      : [
          //   {
          //     key: 'category',
          //     label: 'Category',
          //     options: categoryOptions.length > 0 ? categoryOptions : [],
          //     value: categoryFilter,
          //     onChange: setCategoryFilter
          //   },
          {
            key: 'type',
            label: 'Transaction type',
            options: [
              { value: 'SOLD', label: 'SOLD' },
              { value: 'RENT', label: 'RENTED' },
              { value: 'RETURNED', label: 'RETURNED' },
              { value: 'MAINTAINED', label: 'MAINTAINED' },
              { value: 'NOT_MAINTAINED', label: 'NOT MAINTAINED' }
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

  const viewDetailsAction = (row: any) => {
    setSelectedTransaction(row);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTransaction(null);
  };

  const returnAction = (data: any) => {
    setTransaction(data);
    setShowReturnModal(true);
  };

  const handleUpdateStock = (data: any) => {
    const payload = { quantity: data.quantity + 1 };
    updateStock(payload as any, data.id);
  };

  const handleClear = () => {
    setDateFrom(null);
    setDateTo(null);
  };

  useEffect(() => {
    if (stockOutSucess) {
      fetchStock();
      fetchAllTransaction();
      resetStockOutSuccess();
    }

    if (activeTab === 'CALIBRATION_STOCK') {
      fetchStock({ type: 'CALIBRATION' });
    }
  }, [
    stockOutSucess,
    fetchStock,
    fetchAllTransaction,
    resetStockOutSuccess,
    activeTab
  ]);

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
          {(['STOCK', 'STOCK_OUT', 'CALIBRATION_STOCK'] as const).map((tab) => {
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
                {tab === 'STOCK'
                  ? 'Stock'
                  : tab === 'STOCK_OUT'
                    ? 'Transactions'
                    : 'Tools for Maintainance'}
              </button>
            );
          })}
        </div>

        {/* <button
          onClick={() => setShowForm(true)}
          className="px-4 py-1 rounded-full border border-[#073c56] text-[#073c56] bg-transparent transition-all duration-200 ease-in-out hover:bg-[#073c56] hover:text-white"
        >
          <p className="text-sm font-medium">+ Add item in stock</p>
        </button> */}
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
                {/* Clear button */}
                {(dateFrom || dateTo) && (
                  <button
                    type="button"
                    onClick={handleClear} // you handle this
                    className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 bg-gray-50 transition hover:bg-gray-100"
                  >
                    Clear
                  </button>
                )}
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
          onClose={closeStockOutModal}
          title={'Register Stock Out'}
          maxHeight={600}
        >
          <StockOutForm
            handleClose={closeStockOutModal}
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
              columns={stockInColumns(handleUpdateStock, false)}
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
          ) : activeTab === 'STOCK_OUT' ? (
            <DataTable
              columns={stockOutColumns(returnAction, viewDetailsAction)}
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
          ) : (
            activeTab === 'CALIBRATION_STOCK' && (
              <DataTable
                columns={stockInColumns(handleUpdateStock, true)}
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
            )
          )}
        </div>
      </div>
      <ReturnStockForm
        handleClose={handleClose}
        transaction={transaction}
        isOpen={showReturnModal}
      />

      {/* Transaction Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
        title="Transaction Details"
        maxHeight={600}
      >
        {selectedTransaction && (
          <div className="space-y-6">
            {/* Transaction Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Transaction Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Transaction ID
                  </p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Transaction Type
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedTransaction.type === 'MAINTAINED'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedTransaction.type === 'RETURNED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedTransaction.type}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Transaction Date
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(
                      selectedTransaction.transactionDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Expected Return Date
                  </p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.expectedReturnDate
                      ? new Date(
                          selectedTransaction.expectedReturnDate
                        ).toLocaleDateString()
                      : 'N/A'}
                  </p>
                  {isOverdue(selectedTransaction) && (
                    <span
                      className="
                     inline-flex items-center gap-1
                     px-2 py-0.5 rounded-full
                     bg-red-50 text-red-700 text-[10px] font-semibold
                     shadow-sm border border-red-200"
                    >
                      • Overdue ({getOverdueDays(selectedTransaction)} days)
                    </span>
                  )}
                </div>
                {selectedTransaction.returnDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Return Date
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(
                        selectedTransaction.returnDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {selectedTransaction.returnCondition && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Return Condition
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedTransaction.returnCondition}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Customer Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.customer.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.customer.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.customer.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.customer.address || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Product Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.product.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.product.type || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Serial Number
                  </p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.product.serialNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Quantity</p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Warranty</p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.product.warranty || 'N/A'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    Description
                  </p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.product.description || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Entry Date
                  </p>
                  <p className="text-sm text-gray-900">
                    {selectedTransaction.product.entryDate
                      ? new Date(
                          selectedTransaction.product.entryDate
                        ).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Stock;
