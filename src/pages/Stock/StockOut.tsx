import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import StockOutForm from './stock-out.form';
import { useStockStore } from '../../store/stockStore';
import { stockOutColumns } from '../../utils/columns/stock-out.column';
import Button from '../../components/ui/Button';

const StockOut = () => {
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'SOLD' | 'RENTED'>(
    'ALL'
  );
  const { stockOut, stockOutLoading, fetchStockOut, fetchStockOutByType } =
    useStockStore();

  useEffect(() => {
    // Load stock out data on component mount
    if (filterType === 'ALL') {
      fetchStockOut();
    }
  }, [filterType, fetchStockOut, fetchStockOutByType]);

  const handleFilterChange = (type: 'ALL' | 'SOLD' | 'RENTED') => {
    setFilterType(type);
    if (type === 'ALL') {
      fetchStockOut();
    } else {
      fetchStockOutByType(type);
    }
  };

  const filteredData =
    filterType === 'ALL'
      ? stockOut
      : stockOut.filter((item) => item.type === filterType);

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#073c56',
        color: '#fff',
        fontSize: '0.95rem',
        fontWeight: 'bold',
        paddingLeft: '16px'
      }
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px'
      }
    },
    rows: {
      style: {
        minHeight: '56px',
        '&:hover': {
          backgroundColor: '#f0f5f8'
        }
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">
          Stock Out Management
        </h2>
        <p className="py-2 text-gray-600">
          Track sold and rented items with customer details
        </p>
      </div>

      {/* Summary Section */}
      {filteredData.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700">
              Total Sold Items
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {stockOut
                .filter((item) => item.type === 'SOLD')
                .reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700">
              Total Rented Items
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-2">
              {stockOut
                .filter((item) => item.type === 'RENTED')
                .reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700">Transactions</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {stockOut.length}
            </p>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            {(['ALL', 'SOLD', 'RENTED'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`px-4 py-1 rounded-full font-medium transition ${
                  filterType === type
                    ? 'bg-[#073c56] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <Button
            label="Record Stock Out"
            onClick={() => setShowForm(true)}
            bg="bg-[#073c56]"
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <StockOutForm handleClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {stockOutLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#073c56]"></div>
              <p className="mt-4 text-gray-600">Loading stock out records...</p>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-4 text-gray-600 font-medium">
                No stock out records found
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Start by recording your first sale or rental
              </p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={stockOutColumns as unknown as Record<string, unknown>[]}
            data={filteredData as unknown as Record<string, unknown>[]}
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
  );
};

export default StockOut;
