import { useEffect, useState } from 'react';
import { Warehouse, Package, Truck, AlertTriangle, ArrowDownToLine } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { useStockInStore } from '../../store/stockInStore';
import { useSupplierStore } from '../../store/supplierStore';
import { getCategorySummary, type CategorySummaryRow } from '../../api/statisticsApi';

const LOW_STOCK_THRESHOLD = 3;

export default function MainStockOverview() {
  const { products, listProducts } = useProductStore();
  const { stockIns, fetchStockIns } = useStockInStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();

  const [catRows, setCatRows] = useState<CategorySummaryRow[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  useEffect(() => {
    listProducts({ scope: 'MAIN_STOCK', limit: 100 });
    fetchStockIns({ limit: 5 });
    fetchSuppliers(undefined, 1, 100);

    setCatLoading(true);
    getCategorySummary({ scope: 'MAIN_STOCK' })
      .then((rows) => setCatRows(rows ?? []))
      .catch(() => setCatRows([]))
      .finally(() => setCatLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalInStock = products.reduce((sum: number, p: any) => sum + (p.stock?.quantity ?? 0), 0);
  const lowStockItems = products.filter((p: any) => (p.stock?.quantity ?? 0) <= LOW_STOCK_THRESHOLD);

  const stats = [
    { label: 'Total Products', value: products.length, sub: 'unique items in catalog', icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Items in Stock', value: totalInStock.toLocaleString(), sub: 'units across all products', icon: Warehouse, color: 'bg-[#073c56]/10 text-[#073c56]' },
    { label: 'Active Suppliers', value: (suppliers ?? []).length, sub: 'registered suppliers', icon: Truck, color: 'bg-green-50 text-green-600' },
    { label: 'Low Stock Alerts', value: lowStockItems.length, sub: `items at or below ${LOW_STOCK_THRESHOLD} units`, icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">Main Stock Overview</h2>
        <p className="py-2 text-gray-600">Warehouse inventory at a glance</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-[#073c56]">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Recent Stock-In */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <ArrowDownToLine size={18} className="text-[#073c56]" />
              <h3 className="font-semibold text-[#073c56]">Recent Stock-In</h3>
            </div>
            <a href="/main-stock/stock-in" className="text-xs text-[#073c56] hover:underline font-medium">View all →</a>
          </div>
          <div className="overflow-x-auto">
            {stockIns.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">No stock-in records yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b">
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Supplier</th>
                    <th className="px-4 py-3 font-medium">Qty</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {stockIns.map((row: any) => (
                    <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                      <td className="px-6 py-3 font-medium text-gray-800">{row.product?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{row.supplier?.name ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">+{row.quantity}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {row.receivedAt ? new Date(row.receivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 font-mono">{row.invoiceNo ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="font-semibold text-[#073c56]">Low Stock Alerts</h3>
            <span className="ml-auto bg-amber-50 text-amber-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {lowStockItems.length}
            </span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">All stock levels are healthy</p>
            ) : lowStockItems.slice(0, 5).map((item: any) => {
              const qty = item.stock?.quantity ?? 0;
              return (
                <div key={item.id} className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{item.category?.name}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-700 font-bold">{qty} in stock</span>
                    <span className="text-gray-400">threshold: {LOW_STOCK_THRESHOLD}</span>
                  </div>
                  <div className="mt-2 w-full bg-amber-100 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (qty / LOW_STOCK_THRESHOLD) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Category Summary ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-[#073c56] mb-1">Category Summary</h3>
        <p className="text-xs text-gray-400 mb-4">Current stock levels across all main stock categories</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="py-2 px-4 font-semibold text-gray-600">Category</th>
                <th className="py-2 px-4 font-semibold text-gray-600 text-right">Products</th>
                <th className="py-2 px-4 font-semibold text-gray-600 text-right">Units in Stock</th>
              </tr>
            </thead>
            <tbody>
              {catLoading ? (
                <tr><td colSpan={3} className="text-center py-8 text-gray-400 text-xs">Loading…</td></tr>
              ) : catRows.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-8 text-gray-400 text-xs">No data</td></tr>
              ) : (
                <>
                  {catRows.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-4 font-medium text-gray-800">{r.name}</td>
                      <td className="py-2 px-4 text-right text-gray-600">{r.productCount}</td>
                      <td className="py-2 px-4 text-right font-semibold text-[#073c56]">{r.totalUnitsInStock}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold border-t border-gray-200">
                    <td className="py-2 px-4 text-gray-800">Total</td>
                    <td className="py-2 px-4 text-right">{catRows.reduce((s, r) => s + r.productCount, 0)}</td>
                    <td className="py-2 px-4 text-right text-[#073c56]">{catRows.reduce((s, r) => s + r.totalUnitsInStock, 0)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
