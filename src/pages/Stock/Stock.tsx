// import { useEffect, useState } from 'react';
// import DataTable from 'react-data-table-component';
// import StockOutForm from './stock-out.form';
// import { useStockStore } from '../../store/stockStore';
// import { stockOutColumns } from '../../utils/columns/stock-out.column';
// import Button from '../../components/ui/Button';
// import Modal from '../../components/ui/Modal';

// const Stock = () => {
//   const [activeTab, setActiveTab] = useState<'IN_STOCK' | 'STOCK_OUT'>('IN_STOCK');
//   const [showForm, setShowForm] = useState(false);
//   const [filterType, setFilterType] = useState<'ALL' | 'SOLD' | 'RENTED'>('ALL');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dateFilter, setDateFilter] = useState('');

//   const {
//     stockOut,
//     stockOutLoading,
//     inventory,
//     inventoryLoading,
//     fetchStockOut,
//     fetchStockOutByType,
//     fetchInventory
//   } = useStockStore();

//   useEffect(() => {
//     if (activeTab === 'STOCK_OUT') {
//       if (filterType === 'ALL') {
//         fetchStockOut();
//       } else {
//         fetchStockOutByType(filterType);
//       }
//     } else if (activeTab === 'IN_STOCK') {
//       fetchInventory();
//     }
//   }, [activeTab, filterType, fetchStockOut, fetchStockOutByType, fetchInventory]);

//   const handleTabChange = (tab: 'IN_STOCK' | 'STOCK_OUT') => {
//     setActiveTab(tab);
//     setSearchTerm('');
//     setDateFilter('');
//     if (tab === 'STOCK_OUT') {
//       setFilterType('ALL');
//     }
//   };

//   const handleFilterChange = (type: 'ALL' | 'SOLD' | 'RENTED') => {
//     setFilterType(type);
//     if (type === 'ALL') {
//       fetchStockOut();
//     } else {
//       fetchStockOutByType(type);
//     }
//   };

//   // Filter stock out data based on search and date
//   const filteredStockOutData = stockOut.filter((item) => {
//     const matchesSearch =
//       item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesDate = !dateFilter || item.transactionDate.startsWith(dateFilter);

//     return matchesSearch && matchesDate;
//   });

//   // Filter inventory data based on search
//   const filteredInventoryData = inventory.filter((item) =>
//     item.productName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const customStyles = {
//     headCells: {
//       style: {
//         backgroundColor: '#073c56',
//         color: '#fff',
//         fontSize: '0.95rem',
//         fontWeight: 'bold',
//         paddingLeft: '16px'
//       }
//     },
//     cells: {
//       style: {
//         paddingLeft: '16px',
//         paddingRight: '16px'
//       }
//     },
//     rows: {
//       style: {
//         minHeight: '56px',
//         '&:hover': {
//           backgroundColor: '#f0f5f8'
//         }
//       }
//     }
//   };

//   const renderInStockTab = () => (
//     <div className="space-y-6">
//       {/* Search Bar */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex flex-col md:flex-row gap-4 items-center">
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073c56] focus:border-transparent"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Inventory Grid */}
//       {inventoryLoading ? (
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#073c56]"></div>
//             <p className="mt-4 text-gray-600">Loading inventory...</p>
//           </div>
//         </div>
//       ) : filteredInventoryData.length === 0 ? (
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <svg
//               className="mx-auto h-12 w-12 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//               />
//             </svg>
//             <p className="mt-4 text-gray-600 font-medium">
//               No items in inventory
//             </p>
//             <p className="text-gray-500 text-sm mt-2">
//               Add products through the Products section to get started
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredInventoryData.map((item) => (
//             <div
//               key={item.productId}
//               className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border-l-4 border-[#073c56]"
//             >
//               {/* Card Header */}
//               <div className="bg-gradient-to-r from-[#073c56] to-[#055082] p-4">
//                 <h3 className="text-lg font-bold text-white truncate">
//                   {item.productName}
//                 </h3>
//               </div>

//               {/* Card Content */}
//               <div className="p-6">
//                 {/* Quantity Badge */}
//                 <div className="mb-4">
//                   <p className="text-sm text-gray-600 mb-2">
//                     Available Quantity
//                   </p>
//                   <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
//                     <span className="text-3xl font-bold text-[#073c56]">
//                       {item.quantity}
//                     </span>
//                     <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium">
//                       Units
//                     </span>
//                   </div>
//                 </div>

//                 {/* Product ID */}
//                 <div className="pt-4 border-t border-gray-200">
//                   <p className="text-xs text-gray-500">Product ID</p>
//                   <p className="text-sm font-mono text-gray-700 mt-1">
//                     {item.productId}
//                   </p>
//                 </div>

//                 {/* Status Indicator */}
//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs font-medium text-gray-600">
//                       Status
//                     </span>
//                     {item.quantity > 10 ? (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         ✓ In Stock
//                       </span>
//                     ) : item.quantity > 0 ? (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                         ⚠ Low Stock
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                         ✕ Out of Stock
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Summary Stats */}
//       {inventory.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
//             <p className="text-sm text-gray-600 font-medium">Total Products</p>
//             <p className="text-3xl font-bold text-blue-600 mt-2">
//               {inventory.length}
//             </p>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
//             <p className="text-sm text-gray-600 font-medium">Total Units</p>
//             <p className="text-3xl font-bold text-green-600 mt-2">
//               {inventory.reduce((sum, item) => sum + item.quantity, 0)}
//             </p>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
//             <p className="text-sm text-gray-600 font-medium">Low Stock Items</p>
//             <p className="text-3xl font-bold text-yellow-600 mt-2">
//               {
//                 inventory.filter(
//                   (item) => item.quantity <= 10 && item.quantity > 0
//                 ).length
//               }
//             </p>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6 border-t-4 border-red-500">
//             <p className="text-sm text-gray-600 font-medium">Out of Stock</p>
//             <p className="text-3xl font-bold text-red-600 mt-2">
//               {inventory.filter((item) => item.quantity === 0).length}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const renderStockOutTab = () => (
//     <div className="space-y-6">
//       {/* Summary Section */}
//       {filteredStockOutData.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <p className="text-sm font-medium text-gray-700">
//               Total Sold Items
//             </p>
//             <p className="text-2xl font-bold text-blue-600 mt-2">
//               {stockOut
//                 .filter((item) => item.type === 'SOLD')
//                 .reduce((sum, item) => sum + item.quantity, 0)}
//             </p>
//           </div>
//           <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
//             <p className="text-sm font-medium text-gray-700">
//               Total Rented Items
//             </p>
//             <p className="text-2xl font-bold text-amber-600 mt-2">
//               {stockOut
//                 .filter((item) => item.type === 'RENTED')
//                 .reduce((sum, item) => sum + item.quantity, 0)}
//             </p>
//           </div>
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//             <p className="text-sm font-medium text-gray-700">Transactions</p>
//             <p className="text-2xl font-bold text-green-600 mt-2">
//               {stockOut.length}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Action Bar */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//             <div className="flex gap-2">
//               {(['ALL', 'SOLD', 'RENTED'] as const).map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => handleFilterChange(type)}
//                   className={`px-4 py-1 rounded-full font-medium transition ${
//                     filterType === type
//                       ? 'bg-[#073c56] text-white'
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>

//             <div className="flex gap-2 items-center">
//               <input
//                 type="date"
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value)}
//                 className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#073c56] focus:border-transparent"
//                 placeholder="Filter by date"
//               />
//             </div>
//           </div>

//           <Button
//             label="Record Stock Out"
//             onClick={() => setShowForm(true)}
//             bg="bg-[#073c56]"
//           />
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex flex-col md:flex-row gap-4 items-center">
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Search by product, client name, or email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073c56] focus:border-transparent"
//             />
//           </div>
//         </div>
//       </div>

//       <Modal
//         isOpen={showForm}
//         onClose={() => setShowForm(false)}
//         title="Record Stock Out"
//       >
//         <StockOutForm handleClose={() => setShowForm(false)} />
//       </Modal>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         {stockOutLoading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#073c56]"></div>
//               <p className="mt-4 text-gray-600">Loading stock out records...</p>
//             </div>
//           </div>
//         ) : filteredStockOutData.length === 0 ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//                 />
//               </svg>
//               <p className="mt-4 text-gray-600 font-medium">
//                 No stock out records found
//               </p>
//               <p className="text-gray-500 text-sm mt-2">
//                 Start by recording your first sale or rental
//               </p>
//             </div>
//           </div>
//         ) : (
//           <DataTable
//             columns={stockOutColumns as unknown as Record<string, unknown>[]}
//             data={filteredStockOutData as unknown as Record<string, unknown>[]}
//             highlightOnHover
//             pointerOnHover
//             customStyles={customStyles}
//             pagination
//             paginationPerPage={10}
//             paginationRowsPerPageOptions={[5, 10, 20, 50]}
//             responsive
//             striped
//           />
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">
//           Stock Management
//         </h2>
//         <p className="py-2 text-gray-600">
//           Manage your inventory and track sold/rented items
//         </p>
//       </div>

//       {/* Tabs */}
//       <div className="mb-6">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8">
//             <button
//               onClick={() => handleTabChange('IN_STOCK')}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'IN_STOCK'
//                   ? 'border-[#073c56] text-[#073c56]'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               In Stock Items
//             </button>
//             <button
//               onClick={() => handleTabChange('STOCK_OUT')}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'STOCK_OUT'
//                   ? 'border-[#073c56] text-[#073c56]'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Stock Out (Sold/Rented)
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Tab Content */}
//       {activeTab === 'IN_STOCK' ? renderInStockTab() : renderStockOutTab()}
//     </div>
//   );
// };

// export default Stock;