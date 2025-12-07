import { useEffect } from 'react';
import { useStockStore } from '../../store/stockStore';

const StockIn = () => {
  const { inventory, inventoryLoading, fetchInventory } = useStockStore();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">
          Stock Inventory
        </h2>
        <p className="py-2 text-gray-600">
          View all available items in your inventory
        </p>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryLoading ? (
          // Loading State
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#073c56]"></div>
              <p className="mt-4 text-gray-600">Loading inventory...</p>
            </div>
          </div>
        ) : inventory.length === 0 ? (
          // Empty State
          <div className="col-span-full flex items-center justify-center h-64">
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
                No items in inventory
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Add products through the Products section to get started
              </p>
            </div>
          </div>
        ) : (
          // Inventory Cards
          inventory.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border-l-4 border-[#073c56]"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#073c56] to-[#055082] p-4">
                <h3 className="text-lg font-bold text-white truncate">
                  {item.productName}
                </h3>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Quantity Badge */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Available Quantity
                  </p>
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                    <span className="text-3xl font-bold text-[#073c56]">
                      {item.quantity}
                    </span>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">
                      Units
                    </span>
                  </div>
                </div>

                {/* Product ID */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Product ID</p>
                  <p className="text-sm font-mono text-gray-700 mt-1">
                    {item.productId}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">
                      Status
                    </span>
                    {item.quantity > 10 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ In Stock
                      </span>
                    ) : item.quantity > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⚠ Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ✕ Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {inventory.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <p className="text-sm text-gray-600 font-medium">Total Products</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {inventory.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
            <p className="text-sm text-gray-600 font-medium">Total Units</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {inventory.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
            <p className="text-sm text-gray-600 font-medium">Low Stock Items</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {
                inventory.filter(
                  (item) => item.quantity <= 10 && item.quantity > 0
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-red-500">
            <p className="text-sm text-gray-600 font-medium">Out of Stock</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {inventory.filter((item) => item.quantity === 0).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockIn;
