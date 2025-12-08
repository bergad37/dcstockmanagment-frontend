# Analytics Dashboard Guide

## Overview
A comprehensive analytics dashboard has been created to provide visual insights into inventory flow, product performance, and revenue metrics. The page uses dummy data for demonstration purposes and serves as a reference for backend API structure.

## Features

### 1. **Summary Statistics Cards**
- **Total Inbound**: Sum of all items received into inventory
- **Total Outbound**: Sum of all items sold/rented out
- **Net Flow**: Difference between inbound and outbound (inventory change)
- **Total Revenue**: Combined revenue from all transactions across all categories

Each card displays:
- Current metric value
- Trend percentage (↑/↓)
- Color-coded icon for quick visual identification

### 2. **Charts & Visualizations**

#### Stock Flow Chart (Line Chart)
- Displays monthly trends for inbound, outbound, and net flow
- Three lines tracking: inbound (green), outbound (red), net flow (blue)
- Helps identify seasonal patterns and inventory trends
- Interactive tooltips on hover

#### Category Performance (Bar Chart)
- Compares sold vs rented items by category
- Shows which categories are performing better
- Dual-axis display for sold and rented quantities
- Helps identify business model strengths (sales vs rentals)

#### High Moving Items (Horizontal Bar Chart)
- Top 5 products with highest sales volume
- Shows unit quantities and percentage of total sales
- Identifies bestsellers for focus and marketing

#### Low Moving Items (Horizontal Bar Chart)
- Products with slowest sales velocity
- Helps identify stagnant inventory
- Useful for deciding on promotions, discounts, or discontinuation

#### Inventory Turnover Rate (Scatter Plot)
- Shows turnover frequency for each product
- X-axis: Turnover rate (times per month)
- Y-axis: Product names
- Higher scatter points indicate fast-moving items

#### Revenue Distribution Pie Chart
- Visual breakdown of revenue by category
- Color-coded slices with revenue values
- Helps understand which categories are most profitable

### 3. **Detailed Tables**

#### High Moving Items Summary Table
| Column | Description |
|--------|-------------|
| Product | Product name |
| Category | Product category |
| Units | Total units sold |
| % | Percentage of total sales |

#### Low Moving Items Summary Table
| Column | Description |
|--------|-------------|
| Product | Product name |
| Category | Product category |
| Units | Total units sold |
| % | Percentage of total sales |

#### Category Performance Table
| Column | Description |
|--------|-------------|
| Category | Product category |
| Sold | Items sold in this category |
| Rented | Items rented in this category |
| Total Transactions | Sum of sold + rented |
| Revenue | Total revenue generated |

### 4. **Report Download Feature**

Two download options for exporting analytics data:

#### JSON Report
- Complete structured data export
- Includes all metrics and detailed information
- Easy to import into other systems
- Filename format: `analytics-report-YYYY-MM-DD.json`

#### CSV Report
- Spreadsheet-compatible format
- Organized into sections:
  - Summary statistics
  - Flow data by month
  - Category performance
  - High moving items
  - Low moving items
- Filename format: `analytics-report-YYYY-MM-DD.csv`

### 5. **Date Range Filter**
- Select between predefined time periods:
  - Last 7 Days
  - Last 30 Days (default)
  - Last 90 Days
  - Last Year
- Currently for UI demonstration (updates state but not data)

## Dummy Data Structure

### `analyticsFlowData`
```typescript
[
  { month: string, inbound: number, outbound: number, net: number },
  ...
]
```

### `highMovingItemsData`
```typescript
[
  { name: string, category: string, units: number, percentage: number },
  ...
]
```

### `lowMovingItemsData`
```typescript
[
  { name: string, category: string, units: number, percentage: number },
  ...
]
```

### `categoryPerformanceData`
```typescript
[
  { category: string, sold: number, rented: number, revenue: number },
  ...
]
```

### `inventoryTurnoverData`
```typescript
[
  { product: string, turnover: number },
  ...
]
```

## Backend API Structure Reference

Based on the analytics page requirements, your backend should provide these endpoints:

### 1. **Stock Flow Analytics**
```
GET /api/analytics/flow?startDate=2024-01-01&endDate=2024-06-30
Response:
{
  data: [
    { month: string, inbound: number, outbound: number, net: number }
  ]
}
```

### 2. **Top Products**
```
GET /api/analytics/top-products?limit=5&type=high-moving
Response:
{
  data: [
    { productId: string, name: string, category: string, units: number, percentage: number }
  ]
}
```

### 3. **Slow Moving Items**
```
GET /api/analytics/slow-moving?limit=5
Response:
{
  data: [
    { productId: string, name: string, category: string, units: number, percentage: number }
  ]
}
```

### 4. **Category Performance**
```
GET /api/analytics/category-performance
Response:
{
  data: [
    { category: string, sold: number, rented: number, revenue: number }
  ]
}
```

### 5. **Inventory Turnover**
```
GET /api/analytics/turnover-rate
Response:
{
  data: [
    { productId: string, product: string, turnover: number }
  ]
}
```

### 6. **Summary Stats**
```
GET /api/analytics/summary
Response:
{
  totalInbound: number,
  totalOutbound: number,
  netFlow: number,
  totalRevenue: number,
  period: string
}
```

## File Locations

- **Main Component**: `/src/pages/Analytics/Analytics.tsx`
- **Dummy Data**: `/src/data/dummyData.ts`
- **Dependencies**: Recharts (charts), lucide-react (icons)

## Styling

- Built with Tailwind CSS
- Color scheme uses project's primary color (#073c56)
- Secondary colors:
  - Success: #10b981 (green)
  - Danger: #ef4444 (red)
  - Warning: #f59e0b (orange)
  - Secondary: #0ea5e9 (blue)
- Responsive design: Mobile-first with breakpoints for tablet and desktop

## Integration Steps

1. **Replace dummy data with API calls**:
   ```typescript
   useEffect(() => {
     fetchAnalyticsData();
   }, [dateRange]);
   ```

2. **Add error handling**:
   - Loading states
   - Error notifications
   - Empty state UI

3. **Implement date range logic**:
   - Update API calls when date range changes
   - Format dates for backend queries

4. **Add real-time updates**:
   - Optional: WebSocket for live analytics
   - Polling for periodic refreshes

## Component Dependencies

- **react**: UI framework
- **recharts**: Charting library
- **lucide-react**: Icon library
- **tailwindcss**: Styling

## Performance Considerations

- Charts render efficiently with ResponsiveContainer
- Dummy data is static (replace with optimized API calls)
- Consider pagination for large datasets
- Cache analytics data to reduce API calls

## Future Enhancements

1. Add drill-down capabilities (click category to see products)
2. Export additional formats (PDF, Excel)
3. Custom date range picker
4. Comparison between time periods
5. Predictive analytics (trend forecasting)
6. Alert system for low stock items
7. Email report scheduling
8. Dashboard customization/widgets selection
