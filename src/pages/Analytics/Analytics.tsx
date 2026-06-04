import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  RotateCcw,
  ShoppingCart,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { getStatistics, downloadExcelReport } from '../../api/statisticsApi';
import { toast } from 'sonner';

const PRIMARY = '#073c56';
const COLORS = {
  primary: PRIMARY,
  secondary: '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

// ── Stat card ────────────────────────────────────────────────────────────────
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
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}18` }}
      >
        <Icon size={22} className="" style={{ color: accent } as any} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1" style={{ color: PRIMARY }}>
          {loading ? '—' : value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
const Analytics = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [excelLoading, setExcelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // totals
  const [totals, setTotals] = useState<Record<string, any>>({});
  // charts
  const [flowData, setFlowData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [highMoving, setHighMoving] = useState<any[]>([]);
  const [lowMoving, setLowMoving] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getStatistics({ range: dateRange })
      .then((data) => {
        if (!mounted) return;
        const payload = data?.data ?? data;

        setTotals(payload?.totals ?? {});

        const flow = (payload?.stockFlow ?? []).map((it: any) => ({
          month: it.label ?? it.month ?? '',
          inbound: it.inbound ?? 0,
          outbound: it.outbound ?? 0,
          net: it.net ?? 0,
        }));
        setFlowData(flow);

        const cat = (payload?.categoryPerformance ?? []).map((c: any) => ({
          category: c.name ?? c.category ?? '',
          sold: Number(c.sold ?? 0),
          rented: Number(c.rented ?? 0),
        }));
        setCategoryData(cat);

        const hi = (payload?.topItems ?? []).map((it: any) => ({
          name: it.name ?? '',
          category: it.category?.name ?? '',
          units: Number(it.units ?? 0),
        }));
        setHighMoving(hi);

        const lo = (payload?.lowItems ?? []).map((it: any) => ({
          name: it.name ?? '',
          category: it.category?.name ?? '',
          units: Number(it.units ?? 0),
        }));
        setLowMoving(lo);
      })
      .catch((err) => {
        if (mounted) setError(err?.message ?? 'Failed to load statistics');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [dateRange]);

  const handleExcelDownload = async () => {
    setExcelLoading(true);
    try {
      await downloadExcelReport(dateRange);
      toast.success('Report downloaded successfully');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setExcelLoading(false);
    }
  };

  const totalFlow = flowData.reduce((s, d) => s + d.inbound, 0);
  const totalOutbound = flowData.reduce((s, d) => s + d.outbound, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">
            Stock Analytics
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Comprehensive overview of inventory movement and product performance
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#073c56] bg-white"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>

          <button
            onClick={handleExcelDownload}
            disabled={excelLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#073c56] text-white text-sm font-semibold hover:bg-[#062e42] transition disabled:opacity-60"
          >
            {excelLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}
            {excelLoading ? 'Generating…' : 'Export Excel'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Sales"
          value={totals.totalSoldTx ?? 0}
          sub="completed sell transactions"
          icon={ShoppingCart}
          accent={COLORS.success}
          loading={loading}
        />
        <StatCard
          title="Active Rentals"
          value={totals.activeRentals ?? 0}
          sub={`${totals.totalRentTx ?? 0} total rent transactions`}
          icon={RotateCcw}
          accent={COLORS.warning}
          loading={loading}
        />
        <StatCard
          title="Total Customers"
          value={totals.totalCustomers ?? 0}
          sub="registered clients"
          icon={Users}
          accent={COLORS.secondary}
          loading={loading}
        />
        <StatCard
          title="Products in Stock"
          value={totals.allProducts ?? 0}
          sub={`${(totals.totalStockUnits ?? 0).toLocaleString()} total units`}
          icon={Package}
          accent={PRIMARY}
          loading={loading}
        />
      </div>

      {/* ── Secondary cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4">
          <TrendingUp size={20} style={{ color: COLORS.success }} />
          <div>
            <p className="text-xs text-gray-400">Stock Out (sold + rented)</p>
            <p className="text-xl font-bold text-[#073c56]">
              {loading ? '—' : totalOutbound.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4">
          <TrendingDown size={20} style={{ color: COLORS.danger }} />
          <div>
            <p className="text-xs text-gray-400">Stock In (returned)</p>
            <p className="text-xl font-bold text-[#073c56]">
              {loading ? '—' : totalFlow.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4">
          <Package size={20} style={{ color: PRIMARY }} />
          <div>
            <p className="text-xs text-gray-400">Net Stock Movement</p>
            <p className="text-xl font-bold text-[#073c56]">
              {loading ? '—' : (totalFlow - totalOutbound).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ── Charts ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Stock movement line chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-[#073c56] mb-4">
            Stock Movement Trends (6 months)
          </h3>
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

        {/* Category bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-[#073c56] mb-4">
            Category Activity (Sold vs Rented)
          </h3>
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

        {/* Fast-moving */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-[#073c56] mb-4">
            Fast-Moving Products (Top 5)
          </h3>
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

        {/* Slow-moving */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-[#073c56] mb-4">
            Slow-Moving Products (Bottom 5)
          </h3>
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

      {/* ── Tables ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Fast-moving table */}
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

        {/* Slow-moving table */}
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

      {/* ── Category performance table ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-[#073c56] mb-4">
          Category Performance Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-4 font-semibold text-gray-600">Category</th>
                <th className="text-right py-2 px-4 font-semibold text-gray-600">Items Sold</th>
                <th className="text-right py-2 px-4 font-semibold text-gray-600">Items Rented</th>
                <th className="text-right py-2 px-4 font-semibold text-gray-600">Total Activity</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-xs">No data</td></tr>
              ) : (
                <>
                  {categoryData.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-4 font-medium text-gray-800">{r.category}</td>
                      <td className="py-2 px-4 text-right text-gray-600">{r.sold}</td>
                      <td className="py-2 px-4 text-right text-gray-600">{r.rented}</td>
                      <td className="py-2 px-4 text-right font-semibold text-[#073c56]">
                        {r.sold + r.rented}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold border-t border-gray-200">
                    <td className="py-2 px-4 text-gray-800">Total</td>
                    <td className="py-2 px-4 text-right">{categoryData.reduce((s, r) => s + r.sold, 0)}</td>
                    <td className="py-2 px-4 text-right">{categoryData.reduce((s, r) => s + r.rented, 0)}</td>
                    <td className="py-2 px-4 text-right text-[#073c56]">
                      {categoryData.reduce((s, r) => s + r.sold + r.rented, 0)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
