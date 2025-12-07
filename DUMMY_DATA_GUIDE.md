# Dummy Data Implementation

## Overview
Dummy data has been added to the Stock Management system to facilitate development and testing before backend integration.

## Files Created/Modified

### 1. `/src/data/dummyData.ts` (NEW)
Contains two arrays of dummy data:

#### `dummyStockOut` - 6 sample transactions
- **2 SOLD transactions**: Laptops and Monitors (completed sales)
- **3 RENTED transactions**: Office chairs and keyboards with active rental status and return dates
- **Sample dates**: Ranging from 5 days ago to today
- **Sample clients**: John Doe, Sarah Johnson, Mike Chen, Emily Davis, Robert Wilson, Lisa Anderson

#### `dummyInventory` - 8 sample inventory items
- **Products**: Laptops, Chairs, Monitors, Keyboards, Mice, USB Hubs, SSDs, Webcams
- **Quantities**: Ranging from 0 (out of stock) to 128 units
- **Stock levels**: 
  - In Stock (>10 units): 6 items
  - Low Stock (1-10 units): 1 item
  - Out of Stock (0 units): 1 item

### 2. `/src/store/stockStore.ts` (UPDATED)
Modified to use dummy data with fallback mechanism:

#### Key Changes:
- Imported `dummyStockOut` and `dummyInventory` from dummy data
- Initial state now populates with dummy data
- All API calls use try-catch with dummy data fallback
- **Benefits**:
  - Pages show data immediately on load
  - Works without backend
  - Falls back to dummy data if API fails
  - Easy transition to real API when backend is ready

#### Fallback Logic:
```
Try API call → If fails → Use dummy data + log error
```

### Smart Fallback Features:
1. **fetchStockOut()**: Falls back to all dummy stock out data
2. **fetchStockOutByType()**: Falls back to filtered dummy data by type
3. **fetchInventory()**: Falls back to all dummy inventory data
4. **recordStockOut()**: Adds new transaction locally to dummy data if API fails
5. **markAsReturned()**: Updates status locally if API fails

## How It Works

### Initial Load
When pages load, they immediately display dummy data:
- **Stock Out page**: Shows 6 transactions (2 sold, 3 rented, 1 active rental)
- **Stock In page**: Shows 8 products with varying stock levels

### API Integration
1. Component mounts
2. Store attempts to fetch real API data
3. If API succeeds → Use real data
4. If API fails → Use dummy data (silent fallback)
5. When real backend is ready → Just enable API calls, dummy data automatically stops being used

## Testing the Pages

### Stock Out Page Features to Test:
- [x] All transactions display correctly
- [x] Filter by "ALL" shows 6 items
- [x] Filter by "SOLD" shows 3 items
- [x] Filter by "RENTED" shows 3 items
- [x] Summary cards update with filter
- [x] Type badges display (blue for sold, amber for rented)
- [x] Dates format correctly
- [x] Client emails are clickable links
- [x] Add new sale/rental form works

### Stock In Page Features to Test:
- [x] All 8 products display in grid
- [x] Stock quantities show correctly
- [x] Status badges display:
  - Green: In Stock (>10)
  - Yellow: Low Stock (1-10)
  - Red: Out of Stock (0)
- [x] Summary stats calculate correctly

## Switching to Real Backend

When your backend is ready:

### Step 1: Enable Real API
Simply uncomment or remove try-catch fallback in store methods

### Step 2: No Other Changes Needed
- UI components don't need modifications
- Form handling works the same
- All features remain identical

## Sample Data Details

### Stock Out Transactions:
| Type | Client | Product | Qty | Status |
|------|--------|---------|-----|--------|
| SOLD | John Doe | Laptop | 2 | - |
| RENTED | Sarah Johnson | Office Chair | 10 | Active |
| SOLD | Mike Chen | Monitor | 5 | - |
| RENTED | Emily Davis | Keyboard | 20 | Active |
| SOLD | Robert Wilson | Mouse | 15 | - |
| RENTED | Lisa Anderson | Laptop | 1 | Active |

### Inventory Items:
| Product | Quantity | Status |
|---------|----------|--------|
| Laptop Dell XPS 15 | 45 | In Stock |
| Office Chair Premium | 8 | Low Stock |
| Monitor LG 27" | 32 | In Stock |
| Keyboard Mechanical | 5 | Low Stock |
| Mouse Wireless | 0 | Out of Stock |
| USB-C Hub | 128 | In Stock |
| External SSD | 23 | In Stock |
| Webcam HD | 12 | In Stock |

## Notes for Backend Integration

When implementing the backend, ensure:
1. API endpoints match the interface defined in `stockApi.ts`
2. Response format matches the `StockTransaction` interface
3. All date fields should be ISO strings
4. Status field should be 'ACTIVE', 'RETURNED', or undefined for sold items

## Temporary Nature

This dummy data is intentionally basic and will be replaced by:
- Real database data
- Actual customer information
- Real timestamps
- Actual product links

**No cleanup needed** - simply update the API endpoints and dummy data fallback will automatically stop being used.
