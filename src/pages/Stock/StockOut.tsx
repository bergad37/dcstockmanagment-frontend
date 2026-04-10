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
import { useAuthStore } from '../../store/authStore';
import ReturnStockForm from './Return.item';
import { useCategoryStore } from '../../store/categoriesStore';
import { formatStockTransactions, getOverdueDays } from '../../utils/auth';
import { LogOut, Plus, RotateCcw } from 'lucide-react';

type TabType = 'STOCK' | 'STOCK_OUT' | 'CALIBRATION_STOCK';

const Stock = () => {
  const { user } = useAuthStore();
  const {
    fetchStock,
    stockOutSucess,
    stock,
    transactions,
    stockLoading,
    fetchAllTransaction,
    updateStock,
    stockPagination,
    transactionsPagination,
    cancelTransaction,
    cancelTransactionLoading
  } = useStockStore();

  const { resetStockOutSuccess } = useStockStore();

  const { fetchCategories } = useCategoryStore();

  const [activeTab, setActiveTab] = useState<TabType>('STOCK');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    label: string;
    value: string;
    type: 'ITEM' | 'QUANTITY' | 'CALIBRATION';
  } | null>(null);
  //   const [categoryFilter, setCategoryFilter] = useState<FilterOption | null>(
  //     null
  //   );
  const [transactionType, setTransactionType] = useState<FilterOption | null>(
    null
  );
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);

  // pagination state for stock (STOCK & CALIBRATION_STOCK)
  const [stockPage, setStockPage] = useState<number>(1);
  const [stockPerPage, setStockPerPage] = useState<number>(10);

  // pagination state for transactions (STOCK_OUT)
  const [txPage, setTxPage] = useState<number>(1);
  const [txPerPage, setTxPerPage] = useState<number>(10);

  // keep current stock search query so we can carry it across pages
  const [stockSearch, setStockSearch] = useState<string>('');

  // keep current transaction search query
  const [transactionSearch, setTransactionSearch] = useState<string>('');

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
  const [cancelComment, setCancelComment] = useState<string>('');
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantityInput, setQuantityInput] = useState<number>(1);
  const [selectedStockRow, setSelectedStockRow] = useState<any>(null);

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

  // initial loads
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load stock whenever tab/page/limit or search changes
  useEffect(() => {
    const params: Record<string, any> = {
      page: stockPage,
      limit: stockPerPage
    };

    if (stockSearch) {
      params.searchKey = stockSearch;
    }

    if (activeTab === 'CALIBRATION_STOCK') {
      params.type = 'CALIBRATION';
    }

    // ITEM + QUANTITY (default) when not calibration
    void fetchStock(params);
  }, [activeTab, stockPage, stockPerPage, stockSearch, fetchStock]);

  // load transactions whenever page/limit/search changes
  useEffect(() => {
    const params: Record<string, any> = {
      page: txPage,
      limit: txPerPage,
      includeCancelled: true
    };

    if (transactionSearch) {
      params.searchKey = transactionSearch;
    }

    void fetchAllTransaction(params);
  }, [txPage, txPerPage, transactionSearch, fetchAllTransaction]);

  //   const categoryOptions =
  //     categories?.map((c: any) => ({ value: c.id, label: c.name })) ?? [];

  const closeStockOutModal = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const stockInColumns = (
    handleOpenQuantityModal: (param: any) => void,
    isOnCalibrationTab: boolean,
    user: any
  ) => {
    const columns: any[] = [
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
        name: 'Serial Number',
        selector: (row: any) => row?.product?.serialNumber ?? '---',
        sortable: true
      },
      {
        name: 'Quantity',
        selector: (row: any) => row.quantity,
        grow: 0.5,
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
      user?.role === 'ADMIN' && {
        name: 'Actions',
        selector: (row: any) => row.id,
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
                  onClick={() => handleOpenQuantityModal(row)}
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
    viewDetailsAction: (param: any) => void,
    user: any
  ) => [
    {
      name: 'Product',
      grow: 2,
      selector: (row: any) => row.productName,
      sortable: true,
      cell: (row: any) => (
        <div className="relative inline-block max-w-full">
          {/* Product name */}
          <span className="block font-medium text-gray-900 pr-10">
            {row.productName}
          </span>
          <span className="block font-light text-gray-900 pr-10 py-1">
            sn: {row.serialNumber}
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
      grow: 0.5,
      selector: (row: any) => row.type,
      sortable: true,
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-[8px] font-semibold ${
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
      name: 'status',
      grow: 0.5,
      selector: (row: any) => row.status,
      sortable: true,
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-[8px] font-semibold ${
            row.status === 'CANCELLED' ? 'text-red-800' : 'text-blue-800'
          }`}
        >
          {row.status}
        </span>
      )
    },
    {
      name: 'Prod.Qty',
      grow: 0.5,
      selector: (row: any) => row.quantity,
      sortable: true
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
              row.type === 'RETURNED'
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
        user?.role === 'ADMIN' && (
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

  const handleSearchProductInStock = (data: string) => {
    const trimmed = data.trim();
    setStockSearch(trimmed);
    // reset to first page on new search
    setStockPage(1);
  };

  const handleSearchTransactions = (data: string) => {
    const trimmed = data.trim();
    setTransactionSearch(trimmed);
    // reset to first page on new search
    setTxPage(1);
  };

  const handleClose = () => {
    setShowReturnModal(false);
  };

  const viewDetailsAction = (row: any) => {
    setSelectedTransaction(row);
    setCancelComment('');
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTransaction(null);
    setCancelComment('');
  };

  const handleCancelTransaction = async () => {
    if (!selectedTransaction?.id) return;
    const trimmedComment = cancelComment.trim();
    if (!trimmedComment) {
      window.alert('Please provide a reason for cancelling this transaction.');
      return;
    }

    const shouldCancel = window.confirm(
      'Are you sure you want to cancel this transaction?'
    );
    if (!shouldCancel) return;

    try {
      await cancelTransaction(selectedTransaction.id, trimmedComment);

      // Reload current pages with current filters/search
      const stockParams: Record<string, any> = {
        page: stockPage,
        limit: stockPerPage
      };
      if (stockSearch) stockParams.searchKey = stockSearch;
      if (activeTab === 'CALIBRATION_STOCK') {
        stockParams.type = 'CALIBRATION';
      }

      const txParams: Record<string, any> = {
        page: txPage,
        limit: txPerPage
      };
      if (transactionSearch) txParams.searchKey = transactionSearch;

      await Promise.all([
        fetchStock(stockParams),
        fetchAllTransaction(txParams)
      ]);
      handleCloseDetailsModal();
    } catch (error) {
      console.error(error);
      window.alert('Failed to cancel transaction. Please try again.');
    }
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
      // reload current pages
      const stockParams: Record<string, any> = {
        page: stockPage,
        limit: stockPerPage
      };
      if (stockSearch) stockParams.searchKey = stockSearch;
      if (activeTab === 'CALIBRATION_STOCK') {
        stockParams.type = 'CALIBRATION';
      }

      const txParams: Record<string, any> = {
        page: txPage,
        limit: txPerPage
      };

      if (transactionSearch) txParams.searchKey = transactionSearch;

      void fetchStock(stockParams);
      void fetchAllTransaction(txParams);
      resetStockOutSuccess();
    }
  }, [
    stockOutSucess,
    fetchStock,
    fetchAllTransaction,
    resetStockOutSuccess,
    activeTab,
    stockPage,
    stockPerPage,
    stockSearch,
    txPage,
    txPerPage,
    transactionSearch
  ]);

  const handleChangeStockPage = async (newPage: number) => {
    setStockPage(newPage);
  };

  const handleChangeStockRowsPerPage = async (
    newPerPage: number,
    newPage: number
  ) => {
    setStockPerPage(newPerPage);
    setStockPage(newPage);
  };

  const handleChangeTxPage = async (newPage: number) => {
    setTxPage(newPage);
  };

  const handleChangeTxRowsPerPage = async (
    newPerPage: number,
    newPage: number
  ) => {
    setTxPerPage(newPerPage);
    setTxPage(newPage);
  };

  const handleOpenQuantityModal = (row: any) => {
    setSelectedStockRow(row);
    setQuantityInput(row.quantity); // pre-fill with current value instead of 1
    setShowQuantityModal(false);
    setShowQuantityModal(true);
  };

  const handleConfirmQuantityUpdate = () => {
    if (!selectedStockRow || quantityInput < 0) return;
    const payload = { quantity: quantityInput }; // exact value, not additive
    updateStock(payload as any, selectedStockRow.id);
    setShowQuantityModal(false);
    setSelectedStockRow(null);
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
      <div className="flex justify-between gap-2 mb-6">
        <div className="inline-flex rounded-full border border-[#073c56]/30 bg-gray-100 p-1 gap-2">
          {(['STOCK', 'STOCK_OUT', 'CALIBRATION_STOCK'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  // reset pages when switching tabs
                  if (tab === 'STOCK' || tab === 'CALIBRATION_STOCK') {
                    setStockPage(1);
                    setStockSearch(''); // clear stock search when switching away
                  }
                  if (tab === 'STOCK_OUT') {
                    setTxPage(1);
                    setTransactionSearch(''); // clear transaction search when switching away
                  }
                }}
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
            <SearchBar
              onSubmit={
                activeTab === 'STOCK_OUT'
                  ? handleSearchTransactions
                  : handleSearchProductInStock
              }
            />

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
              columns={stockInColumns(handleOpenQuantityModal, false, user)}
              data={stock?.stocks}
              highlightOnHover
              pointerOnHover
              customStyles={customStyles}
              pagination
              paginationServer
              paginationPerPage={stockPerPage}
              paginationTotalRows={
                stockPagination?.total ?? stock?.stocks?.length ?? 0
              }
              onChangePage={handleChangeStockPage}
              onChangeRowsPerPage={handleChangeStockRowsPerPage}
              paginationRowsPerPageOptions={[10, 15, 20, 50]}
              responsive
              striped
            />
          ) : activeTab === 'STOCK_OUT' ? (
            <DataTable
              columns={stockOutColumns(returnAction, viewDetailsAction, user)}
              data={filteredStockOutData}
              highlightOnHover
              pointerOnHover
              customStyles={customStyles}
              pagination
              paginationServer
              paginationPerPage={txPerPage}
              paginationTotalRows={
                transactionsPagination?.total ??
                filteredStockOutData?.length ??
                0
              }
              onChangePage={handleChangeTxPage}
              onChangeRowsPerPage={handleChangeTxRowsPerPage}
              paginationRowsPerPageOptions={[10, 15, 20, 30, 50]}
              responsive
              striped
            />
          ) : (
            activeTab === 'CALIBRATION_STOCK' && (
              <DataTable
                columns={stockInColumns(handleUpdateStock, true, user)}
                data={stock?.stocks}
                highlightOnHover
                pointerOnHover
                customStyles={customStyles}
                pagination
                paginationServer
                paginationPerPage={stockPerPage}
                paginationTotalRows={
                  stockPagination?.total ?? stock?.stocks?.length ?? 0
                }
                onChangePage={handleChangeStockPage}
                onChangeRowsPerPage={handleChangeStockRowsPerPage}
                paginationRowsPerPageOptions={[10, 15, 20, 30, 50]}
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

      {/* Add quantity Modal */}
      <Modal
        isOpen={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
        title="Increase Stock Quantity"
        maxHeight={300}
      >
        <div className="space-y-5 p-2">
          <p className="text-sm text-gray-600">
            Current quantity for{' '}
            <span className="font-semibold text-gray-900">
              {selectedStockRow?.product?.name}
            </span>
            :{' '}
            <span className="font-bold text-[#073c56]">
              {selectedStockRow?.quantity}
            </span>
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity to Add
            </label>
            <input
              type="number"
              min={1}
              value={quantityInput}
              onChange={(e) =>
                setQuantityInput(Math.max(0, Number(e.target.value)))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:ring-[#073c56]"
            />
            <p className="text-xs text-gray-400 mt-1">
              Previous quantity:{' '}
              <span className="font-semibold text-gray-700">
                {selectedStockRow?.quantity}
              </span>
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowQuantityModal(false)}
              className="px-4 py-2 bg-gray-200 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmQuantityUpdate}
              disabled={quantityInput < 1}
              className="px-4 py-2 rounded-full bg-[#073c56] text-white text-sm font-medium hover:bg-[#0a5070] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

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
                Transaction Information.{' '}
                <span className="text-xs text-yellow-800 ">{`(${selectedTransaction?.status})`}</span>
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
            {selectedTransaction.status === 'CANCELLED' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Cancellation reason
                </h3>
                <p className="text-sm text-gray-900">
                  {selectedTransaction.cancelComments || 'N/A'}
                </p>
              </div>
            )}

            {user?.role === 'ADMIN' &&
              selectedTransaction.status !== 'CANCELLED' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cancellation Reason
                    </label>
                    <textarea
                      value={cancelComment}
                      onChange={(e) => setCancelComment(e.target.value)}
                      rows={3}
                      placeholder="Write the reason for cancelling this transaction..."
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:ring-[#073c56]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCancelTransaction}
                      disabled={
                        cancelTransactionLoading || !cancelComment.trim()
                      }
                      className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelTransactionLoading
                        ? 'Cancelling Transaction...'
                        : 'Cancel Transaction'}
                    </button>
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Stock;
