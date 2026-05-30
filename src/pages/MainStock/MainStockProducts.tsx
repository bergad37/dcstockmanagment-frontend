import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Package, Plus, Search } from 'lucide-react';
import { customStyles } from '../../utils/ui.helper.styles';
import { useProductStore } from '../../store/productStore';
import { useCategoryStore } from '../../store/categoriesStore';
import Modal from '../../components/ui/Modal';
import MainStockProductForm from './MainStockProductForm';

const LOW_STOCK_THRESHOLD = 3;

const columns = [
  {
    name: 'Product Name',
    selector: (row: any) => row.name,
    sortable: true,
    grow: 2,
    cell: (row: any) => (
      <div className="py-1">
        <p className="font-medium text-gray-800">{row.name}</p>
        {row.serialNumber && (
          <p className="text-xs text-gray-400 font-mono">SN: {row.serialNumber}</p>
        )}
      </div>
    ),
  },
  {
    name: 'Category',
    selector: (row: any) => row.category?.name,
    sortable: true,
    cell: (row: any) => (
      <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
        {row.category?.name ?? '—'}
      </span>
    ),
  },
  {
    name: 'Type',
    selector: (row: any) => row.type,
    sortable: true,
    grow: 0.6,
    cell: (row: any) => (
      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
        {row.type}
      </span>
    ),
  },
  {
    name: 'In Stock',
    selector: (row: any) => row.stock?.quantity ?? 0,
    sortable: true,
    grow: 0.5,
    cell: (row: any) => {
      const qty = row.stock?.quantity ?? 0;
      return (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            qty <= LOW_STOCK_THRESHOLD
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {qty}
          {qty <= LOW_STOCK_THRESHOLD && <span className="ml-1 text-red-400">▼</span>}
        </span>
      );
    },
  },
  {
    name: 'Unit Cost',
    selector: (row: any) => row.costPrice,
    sortable: true,
    cell: (row: any) =>
      row.costPrice != null ? (
        <span className="text-sm font-medium text-gray-700">
          ${Number(row.costPrice).toLocaleString()}
        </span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    name: 'Supplier',
    selector: (row: any) => row.supplier?.name,
    sortable: true,
    cell: (row: any) => row.supplier?.name ?? <span className="text-gray-300">—</span>,
  },
  {
    name: 'Added',
    selector: (row: any) => row.entryDate,
    sortable: true,
    cell: (row: any) =>
      row.entryDate
        ? new Date(row.entryDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '—',
  },
];

export default function MainStockProducts() {
  const { products, loading, pagination, listProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);

  const load = (p = page, pp = perPage, s = search, cat = categoryFilter) => {
    const params: Record<string, any> = {
      page: p,
      limit: pp,
      scope: 'MAIN_STOCK',
    };
    if (s) params.searchKey = s;
    if (cat) params.categoryId = cat;
    listProducts(params);
  };

  useEffect(() => {
    fetchCategories();
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1, perPage, search, categoryFilter);
  };

  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    setPage(1);
    load(1, perPage, search, cat);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">Products</h2>
          <p className="py-2 text-gray-600">Main warehouse product catalog</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#073c56] text-white text-sm font-semibold hover:bg-[#062e42] transition"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b flex flex-wrap gap-3 items-center">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#073c56]"
            />
          </form>

          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#073c56] text-gray-600"
          >
            <option value="">All Categories</option>
            {categories?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
            <Package size={16} />
            <span>{pagination?.total ?? products.length} products</span>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={products}
          highlightOnHover
          pointerOnHover
          customStyles={customStyles}
          progressPending={loading}
          progressComponent={
            <div className="py-16 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#073c56] mb-3" />
              <p>Loading products...</p>
            </div>
          }
          pagination
          paginationServer
          paginationPerPage={perPage}
          paginationTotalRows={pagination?.total ?? 0}
          onChangePage={(p) => { setPage(p); load(p, perPage, search, categoryFilter); }}
          onChangeRowsPerPage={(pp, p) => { setPerPage(pp); setPage(p); load(p, pp, search, categoryFilter); }}
          paginationRowsPerPageOptions={[10, 20, 50]}
          responsive
          striped
          noDataComponent={
            <div className="py-16 text-center text-gray-400">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p>No products found</p>
            </div>
          }
        />
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add Product to Main Stock" maxHeight={640}>
        <MainStockProductForm
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); load(1, perPage); }}
        />
      </Modal>
    </div>
  );
}
