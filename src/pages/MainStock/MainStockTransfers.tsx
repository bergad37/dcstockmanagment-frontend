import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ArrowRightLeft, Search, RotateCcw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { customStyles } from '../../utils/ui.helper.styles';
import { useStockTransferStore } from '../../store/stockTransferStore';

interface RevertTarget {
  id: string;
  productName: string;
  quantity: number;
}

function RevertModal({
  target,
  onConfirm,
  onCancel,
  loading,
}: {
  target: RevertTarget;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm mx-4 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Revert Transfer?</p>
            <p className="text-xs text-gray-400">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          <strong>{target.quantity} unit(s)</strong> of{' '}
          <strong>"{target.productName}"</strong> will be returned to Main Stock and
          removed from Mini Stock. The transfer record will be kept and marked as
          reverted.
        </p>
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-full border border-gray-300 text-sm text-white hover:text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
          >
            <RotateCcw size={13} />
            {loading ? 'Reverting…' : 'Confirm Revert'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MainStockTransfers() {
  const { transfers, loading, createLoading, pagination, fetchTransfers, revertTransfer } =
    useStockTransferStore();
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [revertTarget, setRevertTarget] = useState<RevertTarget | null>(null);

  const load = (p = page, pp = perPage, from = dateFrom, to = dateTo) => {
    const params: Record<string, any> = { page: p, limit: pp };
    if (from) params.startDate = from;
    if (to) params.endDate = to;
    fetchTransfers(params);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRevert = async () => {
    if (!revertTarget) return;
    try {
      await revertTransfer(revertTarget.id);
      toast.success(`Transfer of "${revertTarget.productName}" has been reverted`);
      setRevertTarget(null);
    } catch (e: any) {
      toast.error(e.message || 'Failed to revert transfer');
    }
  };

  const filtered = transfers.filter((t: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.mainStockProduct?.name?.toLowerCase().includes(q) ||
      t.miniStockProduct?.name?.toLowerCase().includes(q) ||
      t.transferredBy?.toLowerCase().includes(q) ||
      t.notes?.toLowerCase().includes(q)
    );
  });

  const totalQty = transfers.reduce((sum: number, t: any) => sum + (t.quantity ?? 0), 0);

  const columns = [
    {
      name: 'Date',
      selector: (row: any) => row.transferredAt,
      sortable: true,
      cell: (row: any) =>
        row.transferredAt
          ? new Date(row.transferredAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '—',
    },
    {
      name: 'From (Main Stock)',
      selector: (row: any) => row.mainStockProduct?.name,
      sortable: true,
      grow: 1.8,
      cell: (row: any) => (
        <div className="py-1">
          <p className={`font-medium ${row.revertedAt ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
            {row.mainStockProduct?.name ?? '—'}
          </p>
          <p className="text-xs text-gray-400">{row.mainStockProduct?.category?.name ?? ''}</p>
        </div>
      ),
    },
    {
      name: 'To (Mini Stock)',
      selector: (row: any) => row.miniStockProduct?.name,
      sortable: true,
      grow: 1.8,
      cell: (row: any) => (
        <div className="py-1">
          <p className={`font-medium ${row.revertedAt ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
            {row.miniStockProduct?.name ?? '—'}
          </p>
          <p className="text-xs text-gray-400">
            {!row.revertedAt && row.miniStockProduct?.stock?.quantity != null
              ? `${row.miniStockProduct.stock.quantity} now in mini stock`
              : ''}
          </p>
        </div>
      ),
    },
    {
      name: 'Qty Moved',
      selector: (row: any) => row.quantity,
      sortable: true,
      grow: 0.6,
      cell: (row: any) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
            row.revertedAt
              ? 'bg-gray-50 text-gray-400 border-gray-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          <ArrowRightLeft size={11} />
          {row.quantity}
        </span>
      ),
    },
    {
      name: 'Transferred By',
      selector: (row: any) => row.transferredBy,
      cell: (row: any) =>
        row.transferredBy ? (
          <span className={`text-sm ${row.revertedAt ? 'text-gray-400' : 'text-gray-700'}`}>
            {row.transferredBy}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      name: 'Status',
      grow: 1,
      cell: (row: any) =>
        row.revertedAt ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-200 text-xs font-semibold">
            <RotateCcw size={11} />
            Reverted
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 text-xs font-semibold">
            Completed
          </span>
        ),
    },
    {
      name: 'Notes',
      selector: (row: any) => row.notes,
      grow: 1.2,
      cell: (row: any) =>
        row.notes ? (
          <span className="text-xs text-gray-500 italic">{row.notes}</span>
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      name: '',
      grow: 0.6,
      right: true,
      cell: (row: any) =>
        !row.revertedAt ? (
          <button
            title="Revert transfer"
            onClick={() =>
              setRevertTarget({
                id: row.id,
                productName: row.mainStockProduct?.name ?? 'product',
                quantity: row.quantity,
              })
            }
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-200 transition text-xs font-semibold"
          >
            <RotateCcw size={12} />
            {/* Revert */}
          </button>
        ) : null,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">Transfer History</h2>
        <p className="py-2 text-gray-600">All movements from Main Stock → Mini Stock</p>
      </div>

      {/* Summary bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
          <ArrowRightLeft size={18} className="text-amber-500" />
          <div>
            <p className="text-xs text-gray-400">Total transfers</p>
            <p className="text-lg font-bold text-[#073c56]">{pagination?.total ?? transfers.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <span className="text-amber-600 font-bold text-sm">#</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">Units moved (page)</p>
            <p className="text-lg font-bold text-[#073c56]">{totalQty}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-3">
          <RotateCcw size={18} className="text-red-400" />
          <div>
            <p className="text-xs text-gray-400">Reverted</p>
            <p className="text-lg font-bold text-[#073c56]">
              {transfers.filter((t: any) => t.revertedAt).length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search product or staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#073c56]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 whitespace-nowrap">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); load(1, perPage, e.target.value, dateTo); }}
              className="border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:border-[#073c56] text-gray-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 whitespace-nowrap">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); load(1, perPage, dateFrom, e.target.value); }}
              className="border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:border-[#073c56] text-gray-600"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); setPage(1); load(1, perPage, '', ''); }}
              className="px-3 py-2 rounded-full border border-gray-200 text-sm hover:text-gray-500 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          )}
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          highlightOnHover
          pointerOnHover
          customStyles={customStyles}
          progressPending={loading}
          progressComponent={
            <div className="py-16 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#073c56] mb-3" />
              <p>Loading transfer history...</p>
            </div>
          }
          pagination
          paginationServer
          paginationPerPage={perPage}
          paginationTotalRows={pagination?.total ?? 0}
          onChangePage={(p) => { setPage(p); load(p, perPage); }}
          onChangeRowsPerPage={(pp, p) => { setPerPage(pp); setPage(p); load(p, pp); }}
          paginationRowsPerPageOptions={[10, 20, 50]}
          responsive
          striped
          noDataComponent={
            <div className="py-16 text-center text-gray-400">
              <ArrowRightLeft size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No transfers yet</p>
              <p className="text-xs mt-1">Use the Transfer button on the Products page to move items to Mini Stock.</p>
            </div>
          }
        />
      </div>

      {revertTarget && (
        <RevertModal
          target={revertTarget}
          onConfirm={handleRevert}
          onCancel={() => setRevertTarget(null)}
          loading={createLoading}
        />
      )}
    </div>
  );
}
