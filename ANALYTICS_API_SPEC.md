# Analytics Backend API Specification

This document outlines the expected API structure for backend integration with the Analytics Dashboard.

## Base URL
```
/api/analytics
```

## Endpoints

### 1. Stock Flow Data
**Get monthly inbound/outbound trends**

```
GET /api/analytics/flow?startDate=2024-01-01&endDate=2024-06-30
```

**Query Parameters:**
- `startDate` (optional): ISO 8601 date format
- `endDate` (optional): ISO 8601 date format
- `groupBy` (optional): 'day' | 'week' | 'month' (default: month)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "month": "Jan",
      "inbound": 240,
      "outbound": 220,
      "net": 20
    },
    {
      "month": "Feb",
      "inbound": 300,
      "outbound": 280,
      "net": 20
    },
    ...
  ],
  "period": {
    "start": "2024-01-01",
    "end": "2024-06-30",
    "totalMonths": 6
  }
}
```

**Data Calculation:**
- `inbound` = SUM(stock_in transactions)
- `outbound` = SUM(stock_out transactions)
- `net` = inbound - outbound
- Month aggregation by transaction date

---

### 2. High Moving Items
**Get top-selling products**

```
GET /api/analytics/high-moving?limit=5&days=90
```

**Query Parameters:**
- `limit` (optional): Number of results (default: 5, max: 20)
- `days` (optional): Look-back period (default: 90)
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productId": "PROD001",
      "name": "USB-C Hub 7-in-1",
      "category": "Accessories",
      "units": 450,
      "percentage": 28,
      "revenue": 4500,
      "avgPrice": 10
    },
    {
      "productId": "PROD002",
      "name": "Laptop Dell XPS 15",
      "category": "Computers",
      "units": 380,
      "percentage": 24,
      "revenue": 38000,
      "avgPrice": 100
    },
    ...
  ],
  "metadata": {
    "period": "last 90 days",
    "totalUnits": 1600,
    "totalRevenue": 85000
  }
}
```

**Data Calculation:**
- Sort by units sold (descending)
- `percentage` = (units / totalUnits) * 100
- Include top N items (default 5)

---

### 3. Low Moving Items
**Get slow-selling products**

```
GET /api/analytics/low-moving?limit=5&days=90
```

**Query Parameters:**
- `limit` (optional): Number of results (default: 5)
- `days` (optional): Look-back period (default: 90)
- `minStock` (optional): Minimum stock threshold (default: 0)
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productId": "PROD008",
      "name": "Webcam HD 1080p",
      "category": "Accessories",
      "units": 45,
      "percentage": 3,
      "revenue": 1350,
      "currentStock": 12,
      "daysSinceLastSale": 5
    },
    {
      "productId": "PROD007",
      "name": "External SSD 1TB",
      "category": "Storage",
      "units": 78,
      "percentage": 5,
      "revenue": 2340,
      "currentStock": 23,
      "daysSinceLastSale": 2
    },
    ...
  ],
  "metadata": {
    "period": "last 90 days",
    "totalProducts": 5,
    "totalUnits": 450
  }
}
```

**Data Calculation:**
- Sort by units sold (ascending)
- Include products with minimal sales velocity
- Track days since last sale for urgency

---

### 4. Category Performance
**Get sales metrics by category**

```
GET /api/analytics/category-performance?days=90
```

**Query Parameters:**
- `days` (optional): Look-back period (default: 90)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category": "Accessories",
      "sold": 750,
      "rented": 120,
      "totalTransactions": 870,
      "revenue": 45000,
      "percentageOfTotal": 18.5,
      "avgTransactionValue": 51.72,
      "salesBreakdown": {
        "sold": 86.2,
        "rented": 13.8
      }
    },
    {
      "category": "Computers",
      "sold": 380,
      "rented": 90,
      "totalTransactions": 470,
      "revenue": 95000,
      "percentageOfTotal": 39.1,
      "avgTransactionValue": 202.13,
      "salesBreakdown": {
        "sold": 80.9,
        "rented": 19.1
      }
    },
    ...
  ],
  "summary": {
    "totalTransactions": 2835,
    "totalRevenue": 243000,
    "categoriesCount": 6
  }
}
```

**Data Calculation:**
- Group transactions by category
- Sum sold and rented quantities
- Calculate revenue per category
- Compute percentages and averages

---

### 5. Inventory Turnover Rate
**Get product turnover frequency**

```
GET /api/analytics/turnover-rate?days=30
```

**Query Parameters:**
- `days` (optional): Period in days (default: 30, use for monthly turnover)
- `limit` (optional): Top N products (default: all)
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productId": "PROD006",
      "product": "USB-C Hub",
      "category": "Accessories",
      "turnover": 12.5,
      "avgDailySales": 0.416,
      "unitsSold": 450,
      "period": "30 days"
    },
    {
      "productId": "PROD004",
      "product": "Keyboard RGB",
      "category": "Peripherals",
      "turnover": 9.8,
      "avgDailySales": 0.327,
      "unitsSold": 320,
      "period": "30 days"
    },
    ...
  ],
  "benchmark": {
    "avgTurnover": 6.3,
    "highTurnover": ">8 times/month",
    "lowTurnover": "<3 times/month"
  }
}
```

**Data Calculation:**
- `turnover` = totalUnitsSold / averageStock (monthly)
- For 30 days: divide monthly units by average inventory
- Higher = faster-moving inventory
- Benchmark helps identify optimization opportunities

---

### 6. Summary Statistics
**Get overall analytics summary**

```
GET /api/analytics/summary?days=90
```

**Query Parameters:**
- `days` (optional): Look-back period (default: 90)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalInbound": 1648,
    "totalOutbound": 1350,
    "netFlow": 298,
    "totalRevenue": 243000,
    "period": "last 90 days",
    "metrics": {
      "totalTransactions": 2835,
      "totalCategories": 6,
      "totalProducts": 25,
      "avgTransactionValue": 85.73
    },
    "trends": {
      "inboundTrend": 12,
      "outboundTrend": 8,
      "revenueTrend": 22,
      "netFlowTrend": 15
    },
    "comparison": {
      "previousPeriod": "last 90 days prior",
      "changePercent": -2.5,
      "direction": "down"
    }
  }
}
```

**Data Calculation:**
- `totalInbound` = SUM(all inbound transactions)
- `totalOutbound` = SUM(all outbound transactions)
- `netFlow` = totalInbound - totalOutbound
- Trends compared to previous period (same days)

---

### 7. Product Details with Analytics
**Get individual product analytics**

```
GET /api/analytics/product/:productId?days=90
```

**Path Parameters:**
- `productId`: Product ID

**Query Parameters:**
- `days` (optional): Look-back period (default: 90)

**Response:**
```json
{
  "success": true,
  "data": {
    "productId": "PROD001",
    "name": "Laptop Dell XPS 15",
    "category": "Computers",
    "currentStock": 45,
    "unitsSold": 380,
    "unitsRented": 90,
    "totalUnits": 470,
    "turnoverRate": 7.2,
    "revenue": 38000,
    "avgPrice": 100,
    "revenue_sold": 28000,
    "revenue_rented": 10000,
    "lastTransaction": "2024-06-08T10:30:00Z",
    "trend": "upward",
    "topCustomers": [
      { "customerId": "C001", "name": "John Doe", "purchases": 5 }
    ]
  }
}
```

---

## Error Responses

All endpoints should return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

**Common Error Codes:**
- `INVALID_DATE_RANGE` - Start date after end date
- `DATE_RANGE_TOO_LARGE` - Period exceeds maximum
- `CATEGORY_NOT_FOUND` - Invalid category filter
- `INVALID_LIMIT` - Limit exceeds max (20)
- `DATABASE_ERROR` - Server-side database error

---

## Query Parameters Reference

| Param | Format | Default | Max | Description |
|-------|--------|---------|-----|-------------|
| startDate | YYYY-MM-DD | 90 days ago | - | Period start |
| endDate | YYYY-MM-DD | Today | - | Period end |
| days | Number | 90 | 365 | Look-back days |
| limit | Number | 5 | 20 | Results limit |
| category | String | null | - | Filter category |
| groupBy | String | month | - | day/week/month |

---

## Performance Optimization Tips

1. **Cache analytics data** (30-minute TTL recommended)
2. **Use database indexes** on transaction dates and product IDs
3. **Aggregate data** periodically (daily/hourly) instead of real-time
4. **Paginate** results for large datasets
5. **Use connection pooling** for database queries

---

## Sample Implementation Queries

### PostgreSQL Example: High Moving Items
```sql
SELECT 
  p.id as productId,
  p.name,
  pc.name as category,
  COUNT(*) as units,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage,
  SUM(CASE WHEN st.type = 'SOLD' THEN st.quantity * p.price ELSE 0 END) as revenue
FROM products p
JOIN stock_transactions st ON p.id = st.product_id
JOIN product_categories pc ON p.category_id = pc.id
WHERE st.type IN ('SOLD', 'RENTED')
  AND st.transaction_date >= NOW() - INTERVAL '90 days'
GROUP BY p.id, p.name, pc.name
ORDER BY units DESC
LIMIT 5;
```

### Database Indexes Recommended
```sql
CREATE INDEX idx_stock_transactions_date ON stock_transactions(transaction_date);
CREATE INDEX idx_stock_transactions_product ON stock_transactions(product_id);
CREATE INDEX idx_stock_transactions_type ON stock_transactions(type);
CREATE INDEX idx_products_category ON products(category_id);
```

---

## Testing Recommendations

1. **Mock with dummy data** before full implementation
2. **Test date range boundaries** (edge cases)
3. **Verify percentage calculations** (sum to 100%)
4. **Load test** with large datasets (1M+ transactions)
5. **Validate error handling** for invalid queries

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-08 | Initial specification |

---

## Additional Notes

- All timestamps should be in ISO 8601 format (UTC)
- All currency values in the base unit (USD)
- Percentage calculations should be rounded to 2 decimals
- Transaction types: 'SOLD', 'RENTED', 'RETURNED', 'ADJUSTED'
- Maintain data consistency with product, customer, and category tables
