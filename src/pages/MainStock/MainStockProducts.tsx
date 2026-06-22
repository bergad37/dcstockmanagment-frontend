import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Package, Plus, Search, ArrowRightLeft, Trash2, AlertTriangle } from 'lucide-react';
import { customStyles } from '../../utils/ui.helper.styles';
import { useProductStore } from '../../store/productStore';
import { useCategoryStore } from '../../store/categoriesStore';
import Modal from '../../components/ui/Modal';
import MainStockProductForm from './MainStockProductForm';
import StockTransferForm from './StockTransferForm';
import { toast } from 'sonner';

const LOW_STOCK_THRESHOLD = 3;

const buildColumns = (
  onTransfer: (row: any) => void,
  onArchive: (row: any) => void
) => [
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
          {Number(row.costPrice).toLocaleString()}
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
  {
    name: 'Actions',
    cell: (row: any) => (
      <div className="flex items-center gap-1.5">
        <button
          title={`Transfer ${row.name} to Mini Stock`}
          onClick={() => onTransfer(row)}
          disabled={(row.stock?.quantity ?? 0) === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white border border-amber-200 transition text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowRightLeft size={13} />
          {/* Transfer */}
        </button>
        <button
          title={`Remove ${row.name} from Main Stock`}
          onClick={() => onArchive(row)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition text-xs font-semibold"
        >
          <Trash2 size={13} />
          {/* Remove */}
        </button>
      </div>
    ),
  },
];

export default function MainStockProducts() {
  const { products, loading, pagination, listProducts, deleteProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [transferProduct, setTransferProduct] = useState<any>(null);
  const [archiveProduct, setArchiveProduct] = useState<any>(null);
  const [archiveReason, setArchiveReason] = useState('');
  const [archiveLoading, setArchiveLoading] = useState(false);

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

  const handleArchiveConfirm = async () => {
    if (!archiveProduct) return;
    if (!archiveReason.trim()) {
      toast.error('Please provide a reason before removing');
      return;
    }
    setArchiveLoading(true);
    try {
      await deleteProduct(archiveProduct.id, archiveReason.trim());
      toast.success(`"${archiveProduct.name}" removed from Main Stock`);
      setArchiveProduct(null);
      setArchiveReason('');
      load(page, perPage);
    } catch {
      toast.error('Failed to remove product');
    } finally {
      setArchiveLoading(false);
    }
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
          columns={buildColumns(
            (row) => setTransferProduct(row),
            (row) => { setArchiveProduct(row); setArchiveReason(''); }
          )}
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

      <Modal
        isOpen={!!transferProduct}
        onClose={() => setTransferProduct(null)}
        title="Transfer to Mini Stock"
        maxHeight={640}
      >
        {transferProduct && (
          <StockTransferForm
            product={transferProduct}
            onClose={() => setTransferProduct(null)}
            onSuccess={() => {
              setTransferProduct(null);
              load(page, perPage);
            }}
          />
        )}
      </Modal>

      {/* Archive / Remove confirmation modal */}
      <Modal
        isOpen={!!archiveProduct}
        onClose={() => { setArchiveProduct(null); setArchiveReason(''); }}
        title="Remove Product from Main Stock"
        maxHeight={500}
      >
        {archiveProduct && (
          <div className="space-y-5 p-1">
            {/* Product summary */}
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <p className="font-semibold text-red-700">{archiveProduct.name}</p>
              <p className="text-xs text-red-400 mt-0.5">
                {archiveProduct.category?.name}
                {archiveProduct.stock?.quantity != null
                  ? ` · ${archiveProduct.stock.quantity} units currently in stock`
                  : ''}
              </p>
            </div>

            {/* Contextual warnings */}
            <div className="space-y-2">
              {(archiveProduct.stock?.quantity ?? 0) > 0 && (
                <div className="flex gap-2 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                  <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    This product still has <strong>{archiveProduct.stock.quantity} units</strong> in
                    stock. Removing it will hide it from the catalog but stock records are kept.
                  </p>
                </div>
              )}
              <div className="flex gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                <AlertTriangle size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600">
                  If this product was already transferred to Mini Stock, those Mini Stock entries
                  are <strong>not affected</strong> — they remain fully active.
                </p>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for removal <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                placeholder="e.g. Added by mistake, duplicate entry..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#073c56]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setArchiveProduct(null); setArchiveReason(''); }}
                className="px-4 py-2 rounded-full border border-gray-300 text-sm  text-white hover:bg-white hover:text-primary transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleArchiveConfirm}
                disabled={archiveLoading || !archiveReason.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} />
                {archiveLoading ? 'Removing...' : 'Remove Product'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
