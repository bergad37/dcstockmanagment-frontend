import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowRightLeft, Info, Trash2 } from 'lucide-react';
import Select from 'react-select';
import { useStockTransferStore } from '../../store/stockTransferStore';
import { useAuthStore } from '../../store/authStore';
import productApi from '../../api/productApi';

interface Props {
  product: {
    id: string;
    name: string;
    stock?: { quantity: number };
    type?: string;
    categoryId?: string;
    category?: { name: string };
  };
  onClose: () => void;
  onSuccess: () => void;
}

interface TransferItem {
  mainProductId: string;
  mainProductName: string;
  mainCategory: string;
  available: number;
  quantity: number;
  autoMatchId: string | null;
  autoMatchName: string | null;
  autoMatchQty: number;
  autoMatchResolved: boolean;
}

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: '0.75rem',
    padding: '1px',
    borderColor: state.isFocused ? '#073c56' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(7,60,86,0.15)' : 'none',
    '&:hover': { borderColor: '#073c56' },
    fontSize: '0.875rem',
  }),
  placeholder: (base: any) => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' }),
  menu: (base: any) => ({ ...base, borderRadius: '0.75rem', overflow: 'hidden', zIndex: 9999 }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#073c56' : state.isFocused ? '#073c5620' : 'white',
    color: state.isSelected ? 'white' : '#111827',
    fontSize: '0.875rem',
    cursor: 'pointer',
  }),
};

export default function StockTransferForm({ product, onClose, onSuccess }: Props) {
  const { batchCreateTransfer, createLoading: loading } = useStockTransferStore();
  const user = useAuthStore((s) => s.user);
  const [transferredBy] = useState<string>((user as any)?.name ?? (user as any)?.email ?? '');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<TransferItem[]>([]);
  const [miniProducts, setMiniProducts] = useState<any[]>([]);
  const [mainProducts, setMainProducts] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Fetch each scope independently so they don't overwrite each other in the shared store
    Promise.all([
      productApi.fetchProducts({ scope: 'MINI_STOCK', limit: 500 }),
      productApi.fetchProducts({ scope: 'MAIN_STOCK', limit: 500 }),
    ]).then(([miniRes, mainRes]) => {
      setMiniProducts(miniRes.data?.data?.products ?? []);
      setMainProducts(mainRes.data?.data?.products ?? []);
      setDataLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialise first item once products are loaded
  useEffect(() => {
    if (!dataLoaded || items.length > 0) return;
    setItems([buildItem(product, miniProducts)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded, miniProducts]);

  function buildItem(
    p: { id: string; name: string; stock?: { quantity: number }; category?: { name: string } },
    mini: any[]
  ): TransferItem {
    const match = mini.find(
      (m) => m.name.trim().toLowerCase() === p.name.trim().toLowerCase()
    );
    return {
      mainProductId: p.id,
      mainProductName: p.name,
      mainCategory: p.category?.name ?? '',
      available: p.stock?.quantity ?? 0,
      quantity: 1,
      autoMatchId: match?.id ?? null,
      autoMatchName: match?.name ?? null,
      autoMatchQty: match?.stock?.quantity ?? 0,
      autoMatchResolved: true,
    };
  }

  const addProduct = (selected: any) => {
    if (!selected) return;
    if (items.some((i) => i.mainProductId === selected.value)) {
      toast.error('This product is already in the list');
      return;
    }
    const p = mainProducts.find((m) => m.id === selected.value);
    if (p) setItems((prev) => [...prev, buildItem(p, miniProducts)]);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateQty = (idx: number, qty: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, quantity: qty } : item))
    );
  };

  const handleSubmit = async () => {
    for (const item of items) {
      if (item.quantity < 1) {
        toast.error(`Quantity must be at least 1 for "${item.mainProductName}"`);
        return;
      }
      if (item.quantity > item.available) {
        toast.error(
          `Cannot transfer ${item.quantity} of "${item.mainProductName}" — only ${item.available} available`
        );
        return;
      }
    }

    try {
      await batchCreateTransfer(
        items.map((item) => ({
          mainStockProductId: item.mainProductId,
          miniStockProductId: item.autoMatchId ?? null,
          quantity: item.quantity,
          notes: notes || undefined,
          transferredBy: transferredBy || undefined,
        }))
      );
      const count = items.length;
      toast.success(
        count === 1
          ? `${items[0].quantity} unit(s) of "${items[0].mainProductName}" transferred to Mini Stock`
          : `${count} products transferred to Mini Stock`
      );
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || 'Transfer failed');
    }
  };

  const mainProductOptions = mainProducts
    .filter((p) => !items.some((i) => i.mainProductId === p.id))
    .map((p) => ({
      value: p.id,
      label: `${p.name}${p.stock?.quantity != null ? ` · ${p.stock.quantity} in stock` : ''}`,
    }));

  const labelCls = 'block text-xs font-medium text-gray-500 mb-1';
  const inputCls =
    'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#073c56]';

  return (
    <div className="space-y-4 p-1">
      {/* Product rows */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={item.mainProductId}
            className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-2"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#073c56]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ArrowRightLeft size={14} className="text-[#073c56]" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[#073c56] truncate">{item.mainProductName}</p>
                  <p className="text-xs text-gray-400">{item.mainCategory} · {item.available} available</p>
                </div>
              </div>
              {items.length > 1 && (
                <button
                  onClick={() => removeItem(idx)}
                  className="flex-shrink-0 p-1.5 rounded-full text-red-400 bg-white hover:bg-red-50 hover:text-red-600 transition"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Auto-match banner */}
            {item.autoMatchId && (
              <div className="flex gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                <Info size={13} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-700">
                  Found <strong>{item.autoMatchName}</strong> in Mini Stock ({item.autoMatchQty} units) — quantity will be updated.
                </p>
              </div>
            )}
            {!item.autoMatchId && item.autoMatchResolved && (
              <div className="flex gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                <Info size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  No match in Mini Stock — a new entry will be created automatically.
                </p>
              </div>
            )}

            {/* Quantity input */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-500 whitespace-nowrap">
                Qty to transfer
                <span className="ml-1 text-gray-400 font-normal">(max {item.available})</span>
              </label>
              <input
                type="number"
                min={1}
                max={item.available}
                value={item.quantity}
                onChange={(e) => updateQty(idx, Math.max(1, Number(e.target.value)))}
                className="w-24 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-[#073c56] text-center font-semibold"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add another product */}
      {!dataLoaded ? (
        <p className="text-xs text-gray-400 text-center py-2">Loading products…</p>
      ) : mainProductOptions.length > 0 ? (
        <div>
          <label className={labelCls}>Add another product to this transfer</label>
          <Select
            options={mainProductOptions}
            placeholder="Search main stock products…"
            isClearable
            menuPortalTarget={document.body}
            styles={selectStyles}
            value={null}
            onChange={(opt) => { addProduct(opt); }}
          />
        </div>
      ) : null}

      <hr className="border-gray-100" />

      {/* Transferred by */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Transferred By</label>
          <input
            type="text"
            value={transferredBy}
            readOnly
            className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
          />
        </div>
        <div>
          <label className={labelCls}>Notes (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason or notes…"
            className={inputCls}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-full border border-gray-300 text-sm text-white hover:text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || items.length === 0}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#073c56] text-white text-sm font-semibold hover:bg-[#062e42] transition disabled:opacity-50"
        >
          <ArrowRightLeft size={14} />
          {loading
            ? 'Transferring…'
            : items.length > 1
            ? `Transfer ${items.length} Products`
            : 'Transfer to Mini Stock'}
        </button>
      </div>
    </div>
  );
}
