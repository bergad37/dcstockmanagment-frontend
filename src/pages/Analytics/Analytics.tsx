import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  type PieLabelRenderProps,
} from 'recharts';
import { Download, TrendingUp, TrendingDown, Package } from 'lucide-react';
import {
  analyticsFlowData,
  highMovingItemsData,
  lowMovingItemsData,
  categoryPerformanceData,
  inventoryTurnoverData,
} from '../../data/dummyData';

// Color schemes
const COLORS = ['#073c56', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const CHART_COLORS = {
  primary: '#073c56',
  secondary: '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

// Summary Cards Component
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  trend?: number;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, trend, color }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
        {trend && (
          <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
          </p>
        )}
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} color={color} />
      </div>
    </div>
  </div>
);

const downloadReport = (format: 'csv' | 'json') => {
  const totalFlow = analyticsFlowData.reduce((sum, item) => sum + item.inbound, 0);
  const totalOutbound = analyticsFlowData.reduce((sum, item) => sum + item.outbound, 0);
  const netFlow = totalFlow - totalOutbound;
  const totalRevenue = categoryPerformanceData.reduce((sum, item) => sum + item.revenue, 0);

  const report = {
    generatedDate: new Date().toISOString(),
    summary: {
      totalInbound: totalFlow,
      totalOutbound: totalOutbound,
      netFlow: netFlow,
      totalRevenue: totalRevenue,
    },
    flowData: analyticsFlowData,
    highMovingItems: highMovingItemsData,
    lowMovingItems: lowMovingItemsData,
    categoryPerformance: categoryPerformanceData,
    inventoryTurnover: inventoryTurnoverData,
  };

  let content: string;
  let filename: string;

  if (format === 'json') {
    content = JSON.stringify(report, null, 2);
    filename = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
  } else {
    // CSV format
    const headers = [
      'Report Generated',
      new Date().toISOString(),
      '',
      'SUMMARY',
      '',
      'Total Inbound',
      totalFlow,
      'Total Outbound',
      totalOutbound,
      'Net Flow',
      netFlow,
      'Total Revenue',
      `$${totalRevenue.toLocaleString()}`,
      '',
      'FLOW DATA',
      '',
      'Month,Inbound,Outbound,Net',
    ];
    const flowRows = analyticsFlowData.map((d) => `${d.month},${d.inbound},${d.outbound},${d.net}`);
    const categoryRows = [
      '',
      'CATEGORY PERFORMANCE',
      '',
      'Category,Sold,Rented,Revenue',
      ...categoryPerformanceData.map((d) => `${d.category},${d.sold},${d.rented},${d.revenue}`),
    ];
    const highRows = [
      '',
      'HIGH MOVING ITEMS',
      '',
      'Product,Category,Units,Percentage',
      ...highMovingItemsData.map((d) => `${d.name},${d.category},${d.units},${d.percentage}%`),
    ];
    const lowRows = [
      '',
      'LOW MOVING ITEMS',
      '',
      'Product,Category,Units,Percentage',
      ...lowMovingItemsData.map((d) => `${d.name},${d.category},${d.units},${d.percentage}%`),
    ];

    content = [
      ...headers,
      ...flowRows,
      ...categoryRows,
      ...highRows,
      ...lowRows,
    ].join('\n');

    filename = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
  }

  // Create and download file
  const blob = new Blob([content], {
    type: format === 'json' ? 'application/json' : 'text/csv',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30days');

  // Calculate summary statistics
  const totalFlow = analyticsFlowData.reduce((sum, item) => sum + item.inbound, 0);
  const totalOutbound = analyticsFlowData.reduce((sum, item) => sum + item.outbound, 0);
  const netFlow = totalFlow - totalOutbound;
  const totalRevenue = categoryPerformanceData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#073c56]">Analytics Dashboard</h2>
        <p className="text-gray-600 mt-2">Comprehensive overview of your inventory and stock movement</p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#073c56]"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => downloadReport('json')}
            className="flex items-center gap-2 px-4 py-2 bg-[#073c56] text-white rounded-lg hover:bg-[#052840] transition text-sm font-medium"
          >
            <Download size={16} />
            JSON Report
          </button>
          <button
            onClick={() => downloadReport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7] transition text-sm font-medium"
          >
            <Download size={16} />
            CSV Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Inbound"
          value={totalFlow.toLocaleString()}
          icon={TrendingUp}
          trend={12}
          color={CHART_COLORS.success}
        />
        <StatCard
          title="Total Outbound"
          value={totalOutbound.toLocaleString()}
          icon={TrendingDown}
          trend={8}
          color={CHART_COLORS.danger}
        />
        <StatCard
          title="Net Flow"
          value={netFlow.toLocaleString()}
          icon={Package}
          trend={netFlow > 0 ? 15 : -5}
          color={CHART_COLORS.primary}
        />
        <StatCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}K`}
          icon={TrendingUp}
          trend={22}
          color={CHART_COLORS.warning}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Stock Flow Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Flow (Inbound vs Outbound)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: `1px solid ${CHART_COLORS.primary}`,
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="inbound"
                stroke={CHART_COLORS.success}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.success, r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="outbound"
                stroke={CHART_COLORS.danger}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.danger, r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.primary, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: `1px solid ${CHART_COLORS.primary}`,
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="sold" fill={CHART_COLORS.secondary} name="Sold" />
              <Bar dataKey="rented" fill={CHART_COLORS.success} name="Rented" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* High Moving Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 High Moving Items</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={highMovingItemsData}
              layout="vertical"
              margin={{ left: 150, right: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={145} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: `1px solid ${CHART_COLORS.primary}`,
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="units" fill={CHART_COLORS.success} name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low Moving Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Moving Items (Slow Stock)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={lowMovingItemsData}
              layout="vertical"
              margin={{ left: 150, right: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={145} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: `1px solid ${CHART_COLORS.primary}`,
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="units" fill={CHART_COLORS.warning} name="Units" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Turnover Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Turnover Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              data={inventoryTurnoverData}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                dataKey="turnover"
                stroke="#6b7280"
                label={{ value: 'Turnover Rate (times/month)', position: 'insideBottomRight', offset: -5 }}
              />
              <YAxis
                type="number"
                dataKey="product"
                stroke="#6b7280"
                label={{ value: 'Product', angle: -90, position: 'insideLeft' }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: `1px solid ${CHART_COLORS.primary}`,
                  borderRadius: '8px',
                }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter dataKey="turnover" fill={CHART_COLORS.primary} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryPerformanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: PieLabelRenderProps) => {
                  if (props.value) {
                    return `$${(props.value / 1000).toFixed(0)}K`;
                  }
                  return '';
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                {categoryPerformanceData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: `1px solid ${CHART_COLORS.primary}`,
                  borderRadius: '8px',
                }}
                formatter={(value) => `$${(value as number).toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* High Moving Items Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">High Moving Items Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Units</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">%</th>
                </tr>
              </thead>
              <tbody>
                {highMovingItemsData.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{item.name}</td>
                    <td className="py-3 px-4 text-gray-600">{item.category}</td>
                    <td className="text-right py-3 px-4 font-semibold text-green-600">
                      {item.units.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600">{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Moving Items Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Moving Items Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Units</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">%</th>
                </tr>
              </thead>
              <tbody>
                {lowMovingItemsData.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{item.name}</td>
                    <td className="py-3 px-4 text-gray-600">{item.category}</td>
                    <td className="text-right py-3 px-4 font-semibold text-orange-600">
                      {item.units.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600">{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Performance Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Category Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Sold</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Rented</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Transactions</th>
                {/* <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th> */}
              </tr>
            </thead>
            <tbody>
              {categoryPerformanceData.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{item.category}</td>
                  <td className="text-right py-3 px-4 text-gray-600">{item.sold.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-gray-600">{item.rented.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-gray-600">
                    {(item.sold + item.rented).toLocaleString()}
                  </td>
                  {/* <td className="text-right py-3 px-4 font-semibold text-blue-600">
                    ${item.revenue.toLocaleString()}
                  </td> */}
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 px-4 text-gray-800">Total</td>
                <td className="text-right py-3 px-4 text-gray-800">
                  {categoryPerformanceData.reduce((sum, item) => sum + item.sold, 0).toLocaleString()}
                </td>
                <td className="text-right py-3 px-4 text-gray-800">
                  {categoryPerformanceData.reduce((sum, item) => sum + item.rented, 0).toLocaleString()}
                </td>
                <td className="text-right py-3 px-4 text-gray-800">
                  {categoryPerformanceData.reduce((sum, item) => sum + item.sold + item.rented, 0).toLocaleString()}
                </td>
                {/* <td className="text-right py-3 px-4 text-blue-600">
                  ${totalRevenue.toLocaleString()}
                </td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
