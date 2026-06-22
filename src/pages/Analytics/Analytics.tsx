import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Download, TrendingUp, TrendingDown, Package, Users,
  RotateCcw, ShoppingCart, Loader2, Warehouse, Truck,
  ArrowDownToLine, type LucideIcon,
} from 'lucide-react';
import {
  getStatistics, getCategorySummary, getMainStockStats, downloadExcelReport,
  type CategorySummaryRow, type MainStockStats,
} from '../../api/statisticsApi';
import { toast } from 'sonner';

const PRIMARY = '#073c56';
const COLORS = {
  primary: PRIMARY,
  secondary: '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

function today() {
  return new Date().toISOString().split('T')[0];
}
function thirtyDaysAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().split('T')[0];
}

// ── Stat card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent: string;
  loading?: boolean;
}
function StatCard({ title, value, sub, icon: Icon, accent, loading }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}18` }}>
        <Icon size={22} style={{ color: accent } as any} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1" style={{ color: PRIMARY }}>{loading ? '—' : value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Category summary table ─────────────────────────────────────────────────────
function CategorySummaryTable({ rows, loading }: { rows: CategorySummaryRow[]; loading: boolean }) {
  const totals = rows.reduce((acc, r) => ({
    products: acc.products + r.productCount,
    units: acc.units + r.totalUnitsInStock,
    sold: acc.sold + r.totalSold,
    rented: acc.rented + r.totalRented,
  }), { products: 0, units: 0, sold: 0, rented: 0 });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="py-2 px-4 font-semibold text-gray-600">Category</th>
            <th className="py-2 px-4 font-semibold text-gray-600 text-right">Products</th>
            <th className="py-2 px-4 font-semibold text-gray-600 text-right">Units in Stock</th>
            <th className="py-2 px-4 font-semibold text-gray-600 text-right">Sold</th>
            <th className="py-2 px-4 font-semibold text-gray-600 text-right">Rented</th>
            <th className="py-2 px-4 font-semibold text-gray-600 text-right">Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-xs">Loading…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-xs">No data</td></tr>
          ) : (
            <>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-gray-800">{r.name}</td>
                  <td className="py-2 px-4 text-right text-gray-600">{r.productCount}</td>
                  <td className="py-2 px-4 text-right font-semibold text-[#073c56]">{r.totalUnitsInStock}</td>
                  <td className="py-2 px-4 text-right text-gray-600">{r.totalSold}</td>
                  <td className="py-2 px-4 text-right text-gray-600">{r.totalRented}</td>
                  <td className="py-2 px-4 text-right font-semibold text-[#073c56]">{r.totalSold + r.totalRented}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold border-t border-gray-200">
                <td className="py-2 px-4 text-gray-800">Total</td>
                <td className="py-2 px-4 text-right">{totals.products}</td>
                <td className="py-2 px-4 text-right text-[#073c56]">{totals.units}</td>
                <td className="py-2 px-4 text-right">{totals.sold}</td>
                <td className="py-2 px-4 text-right">{totals.rented}</td>
                <td className="py-2 px-4 text-right text-[#073c56]">{totals.sold + totals.rented}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Main stock category table (no sold/rented — irrelevant for warehouse) ────
function MainStockCategoryTable({ rows, loading }: { rows: CategorySummaryRow[]; loading: boolean }) {
  const totalProducts = rows.reduce((s, r) => s + r.productCount, 0);
  const totalUnits = rows.reduce((s, r) => s + r.totalUnitsInStock, 0);

  return (
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
          {loading ? (
            <tr><td colSpan={3} className="text-center py-8 text-gray-400 text-xs">Loading…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={3} className="text-center py-8 text-gray-400 text-xs">No data</td></tr>
          ) : (
            <>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-gray-800">{r.name}</td>
                  <td className="py-2 px-4 text-right text-gray-600">{r.productCount}</td>
                  <td className="py-2 px-4 text-right font-semibold text-[#073c56]">{r.totalUnitsInStock}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold border-t border-gray-200">
                <td className="py-2 px-4 text-gray-800">Total</td>
                <td className="py-2 px-4 text-right">{totalProducts}</td>
                <td className="py-2 px-4 text-right text-[#073c56]">{totalUnits}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Mini Stock panel ──────────────────────────────────────────────────────────
function MiniStockPanel({
  totals, flowData, categoryData, highMoving, lowMoving, loading,
  catRows, catLoading,
}: {
  totals: Record<string, any>;
  flowData: any[];
  categoryData: any[];
  highMoving: any[];
  lowMoving: any[];
  loading: boolean;
  catRows: CategorySummaryRow[];
  catLoading: boolean;
}) {
  const totalFlow = flowData.reduce((s, d) => s + d.inbound, 0);
  const totalOutbound = flowData.reduce((s, d) => s + d.outbound, 0);

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        <StatCard title="Total Sell Transactions" value={totals.totalSoldTx ?? 0} sub="completed sell transactions" icon={ShoppingCart} accent={COLORS.success} loading={loading} />
        <StatCard title="Total Rental Transactions" value={totals.activeRentals ?? 0} sub={`${totals.totalRentTx ?? 0} total rent transactions`} icon={RotateCcw} accent={COLORS.warning} loading={loading} />
        <StatCard title="Total Customers" value={totals.totalCustomers ?? 0} sub="registered clients" icon={Users} accent={COLORS.secondary} loading={loading} />
        {/* <StatCard title="Products in Stock" value={totals.allProducts ?? 0} sub={`${(totals.totalStockUnits ?? 0).toLocaleString()} total units`} icon={Package} accent={PRIMARY} loading={loading} /> */}
      </div>

      {/* Secondary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4">
          <TrendingUp size={20} style={{ color: COLORS.success }} />
          <div>
            <p className="text-xs text-gray-400">Stock Out (sold + rented)</p>
            <p className="text-xl font-bold text-[#073c56]">{loading ? '—' : totalOutbound.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4">
          <TrendingDown size={20} style={{ color: COLORS.danger }} />
          <div>
            <p className="text-xs text-gray-400">Stock In (returned)</p>
            <p className="text-xl font-bold text-[#073c56]">{loading ? '—' : totalFlow.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4">
          <Package size={20} style={{ color: PRIMARY }} />
          <div>
            <p className="text-xs text-gray-400">Net Stock Movement</p>
            <p className="text-xl font-bold text-[#073c56]">{loading ? '—' : (totalFlow - totalOutbound).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-[#073c56] mb-4">Stock Movement Trends (6 months)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={flowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="inbound" name="Returned" stroke={COLORS.success} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="outbound" name="Out (sold+rented)" stroke={COLORS.danger} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="net" name="Net" stroke={PRIMARY} strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-[#073c56] mb-4">Category Activity (Sold vs Rented)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#9ca3af" angle={-30} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="sold" name="Sold" fill={COLORS.secondary} radius={[3, 3, 0, 0]} />
              <Bar dataKey="rented" name="Rented" fill={COLORS.success} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-[#073c56] mb-4">Fast-Moving Products (Top 5)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={highMoving} layout="vertical" margin={{ left: 130, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" width={125} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="units" name="Units" fill={COLORS.success} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-[#073c56] mb-4">Slow-Moving Products (Bottom 5)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={lowMoving} layout="vertical" margin={{ left: 130, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" width={125} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="units" name="Units" fill={COLORS.warning} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fast/slow tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-[#073c56] mb-4">Fast-Moving Summary</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Product</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Category</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-600">Units</th>
              </tr>
            </thead>
            <tbody>
              {highMoving.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-8 text-gray-400 text-xs">No data</td></tr>
              ) : highMoving.map((r, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-800">{r.name}</td>
                  <td className="py-2 px-3 text-gray-500 text-xs">{r.category}</td>
                  <td className="py-2 px-3 text-right font-semibold text-green-600">{r.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-[#073c56] mb-4">Slow-Moving Summary</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Product</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Category</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-600">Units</th>
              </tr>
            </thead>
            <tbody>
              {lowMoving.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-8 text-gray-400 text-xs">No data</td></tr>
              ) : lowMoving.map((r, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-800">{r.name}</td>
                  <td className="py-2 px-3 text-gray-500 text-xs">{r.category}</td>
                  <td className="py-2 px-3 text-right font-semibold text-amber-600">{r.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-[#073c56] mb-1">Category Summary</h3>
        <p className="text-xs text-gray-400 mb-4">Products grouped by category with stock levels and activity in the selected date range.</p>
        <CategorySummaryTable rows={catRows} loading={catLoading} />
      </div>
    </>
  );
}

// ── Main Stock panel ──────────────────────────────────────────────────────────
function MainStockPanel({
  stats, statsLoading, catRows, catLoading,
}: {
  stats: MainStockStats | null;
  statsLoading: boolean;
  catRows: CategorySummaryRow[];
  catLoading: boolean;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Products" value={stats?.productCount ?? 0} sub="unique items in catalog" icon={Package} accent={PRIMARY} loading={statsLoading} />
        <StatCard title="Units in Stock" value={(stats?.totalUnits ?? 0).toLocaleString()} sub="across all main stock products" icon={Warehouse} accent={COLORS.secondary} loading={statsLoading} />
        <StatCard title="Active Suppliers" value={stats?.supplierCount ?? 0} sub="registered suppliers" icon={Truck} accent={COLORS.success} loading={statsLoading} />
        <StatCard title="Stock-In Events" value={stats?.stockInCount ?? 0} sub="in selected date range" icon={ArrowDownToLine} accent={COLORS.warning} loading={statsLoading} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="text-base font-semibold text-[#073c56] mb-4">Recent Stock-In</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-2 font-medium">Product</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium">Supplier</th>
                <th className="px-4 py-2 font-medium text-right">Qty</th>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {statsLoading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-xs">Loading…</td></tr>
              ) : !stats?.recentStockIns?.length ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-xs">No stock-in records</td></tr>
              ) : stats.recentStockIns.map((row: any, i: number) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{row.product?.name ?? '—'}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs">{row.product?.category?.name ?? '—'}</td>
                  <td className="px-4 py-2 text-gray-500">{row.supplier?.name ?? '—'}</td>
                  <td className="px-4 py-2 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">+{row.quantity}</span>
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {row.receivedAt ? new Date(row.receivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-400 font-mono">{row.invoiceNo ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-[#073c56] mb-1">Category Summary</h3>
        <p className="text-xs text-gray-400 mb-4">Warehouse inventory grouped by category.</p>
        <MainStockCategoryTable rows={catRows} loading={catLoading} />
      </div>
    </>
  );
}

// ── Root component ────────────────────────────────────────────────────────────
type PortalTab = 'mini' | 'main';

const Analytics = () => {
  const [portalTab, setPortalTab] = useState<PortalTab>('mini');
  const [startDate, setStartDate] = useState(thirtyDaysAgo());
  const [endDate, setEndDate] = useState(today());
  const [excelLoading, setExcelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mini stock
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState<Record<string, any>>({});
  const [flowData, setFlowData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [highMoving, setHighMoving] = useState<any[]>([]);
  const [lowMoving, setLowMoving] = useState<any[]>([]);
  const [miniCatRows, setMiniCatRows] = useState<CategorySummaryRow[]>([]);
  const [miniCatLoading, setMiniCatLoading] = useState(false);

  // Main stock
  const [mainStats, setMainStats] = useState<MainStockStats | null>(null);
  const [mainLoading, setMainLoading] = useState(false);
  const [mainCatRows, setMainCatRows] = useState<CategorySummaryRow[]>([]);
  const [mainCatLoading, setMainCatLoading] = useState(false);

  const params = { startDate, endDate };

  // Mini stock data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setMiniCatLoading(true);
    setError(null);

    Promise.all([
      getStatistics(params),
      getCategorySummary({ ...params, scope: 'MINI_STOCK' }),
    ])
      .then(([statsData, catData]) => {
        if (!mounted) return;
        const payload = statsData?.data ?? statsData;
        setTotals(payload?.totals ?? {});
        setFlowData((payload?.stockFlow ?? []).map((it: any) => ({
          month: it.label ?? it.month ?? '', inbound: it.inbound ?? 0, outbound: it.outbound ?? 0, net: it.net ?? 0,
        })));
        setCategoryData((payload?.categoryPerformance ?? []).map((c: any) => ({
          category: c.name ?? c.category ?? '', sold: Number(c.sold ?? 0), rented: Number(c.rented ?? 0),
        })));
        setHighMoving((payload?.topItems ?? []).map((it: any) => ({
          name: it.name ?? '', category: it.category?.name ?? '', units: Number(it.units ?? 0),
        })));
        setLowMoving((payload?.lowItems ?? []).map((it: any) => ({
          name: it.name ?? '', category: it.category?.name ?? '', units: Number(it.units ?? 0),
        })));
        setMiniCatRows(catData ?? []);
      })
      .catch((err) => { if (mounted) setError(err?.message ?? 'Failed to load statistics'); })
      .finally(() => { if (mounted) { setLoading(false); setMiniCatLoading(false); } });

    return () => { mounted = false; };
  }, [startDate, endDate]);

  // Main stock data — only load when tab is shown
  useEffect(() => {
    if (portalTab !== 'main') return;
    let mounted = true;
    setMainLoading(true);
    setMainCatLoading(true);

    Promise.all([
      getMainStockStats(params),
      getCategorySummary({ ...params, scope: 'MAIN_STOCK' }),
    ])
      .then(([stats, catData]) => {
        if (!mounted) return;
        setMainStats(stats);
        setMainCatRows(catData ?? []);
      })
      .catch(() => {})
      .finally(() => { if (mounted) { setMainLoading(false); setMainCatLoading(false); } });

    return () => { mounted = false; };
  }, [portalTab, startDate, endDate]);

  const handleExcelDownload = async () => {
    setExcelLoading(true);
    try {
      await downloadExcelReport({ startDate, endDate });
      toast.success('Report downloaded successfully');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">Stock Analytics</h2>
          <p className="text-gray-500 mt-1 text-sm">Comprehensive overview of inventory movement and performance</p>
        </div>

        {/* Date pickers + export — top right */}
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#073c56] bg-white"
          />
          <span className="text-gray-400 text-sm">→</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={today()}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#073c56] bg-white"
          />
          <button
            onClick={handleExcelDownload}
            disabled={excelLoading}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#073c56] text-white text-sm font-semibold hover:bg-[#062e42] transition disabled:opacity-60"
          >
            {excelLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {excelLoading ? 'Generating…' : 'Export'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* ── Tab navigation — same style as Stock page ────────────────── */}
      <div className="flex gap-2 mb-6">
        <div className="inline-flex rounded-full border border-[#073c56]/30 bg-gray-100 p-1 gap-1">
          {(['mini', 'main'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setPortalTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                portalTab === tab
                  ? 'bg-[#073c56] text-white shadow-sm'
                  : 'bg-transparent text-[#073c56] hover:text-white hover:bg-[#073c56]/80'
              }`}
            >
              {tab === 'mini' ? 'Mini Stock Stats' : 'Main Stock Stats'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Panels ──────────────────────────────────────────────────────── */}
      {portalTab === 'mini' && (
        <MiniStockPanel
          totals={totals}
          flowData={flowData}
          categoryData={categoryData}
          highMoving={highMoving}
          lowMoving={lowMoving}
          loading={loading}
          catRows={miniCatRows}
          catLoading={miniCatLoading}
        />
      )}

      {portalTab === 'main' && (
        <MainStockPanel
          stats={mainStats}
          statsLoading={mainLoading}
          catRows={mainCatRows}
          catLoading={mainCatLoading}
        />
      )}
    </div>
  );
};

export default Analytics;
