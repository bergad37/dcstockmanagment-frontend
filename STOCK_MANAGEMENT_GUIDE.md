# Stock Management Implementation Guide

## Overview

This document outlines the newly implemented Stock Management system with two pages: **Stock Out** (for tracking sales and rentals) and **Stock In** (for viewing current inventory).

---

## 📋 Features Implemented

### 1. **Stock Out Management Page** (`StockOut.tsx`)

A comprehensive dashboard for managing items that leave inventory through sales or rentals.

#### Key Features:

- **Filter by Type**: View All, Sold, or Rented items
- **Record Stock Out**: Modal form to add new sales/rentals
- **Data Table**: Display all transactions with sortable columns
- **Summary Stats**: Quick overview of totals (Sold, Rented, Transaction count)
- **User-Friendly Display**:
  - Shows client name and email
  - Type indicators (blue for Sold, amber for Rented)
  - Transaction dates
  - Return dates for rented items
  - Status for rental items (Active/Returned)

#### Stock Out Form Fields:

When recording a stock out transaction, users fill:

- **Product**: Select from dropdown
- **Transaction Type**: Sold or Rented
- **Client Name**: Full name of the customer
- **Client Email**: Email address for contact
- **Quantity**: Number of items
- **Return Date**: (Only for rentals) Expected return date

### 2. **Stock In Page** (`StockIn.tsx`)

A visual inventory display showing all available items in stock.

#### Key Features:

- **Product Cards Grid**: Beautiful card layout for each product
- **Stock Information**:
  - Product name
  - Available quantity (large, easy-to-read)
  - Product ID
  - Stock status indicator (In Stock / Low Stock / Out of Stock)
- **Summary Dashboard**:
  - Total Products count
  - Total Units in inventory
  - Low Stock Items count (≤10 units)
  - Out of Stock Items count

#### Visual Indicators:

- **Green badge**: In Stock (> 10 units)
- **Yellow badge**: Low Stock (1-10 units)
- **Red badge**: Out of Stock (0 units)

---

## 📁 File Structure

```
src/
├── api/
│   └── stockApi.ts                    # API endpoints for stock operations
├── store/
│   └── stockStore.ts                  # Zustand store for stock state management
├── pages/Stock/
│   ├── StockOut.tsx                   # Main Stock Out dashboard
│   ├── StockIn.tsx                    # Main Stock In inventory view
│   └── stock-out.form.tsx             # Form for recording stock transactions
└── utils/columns/
    └── stock-out.column.tsx           # Column definitions for data tables
```

---

## 🔌 API Endpoints (Backend Required)

The implementation assumes the following API endpoints:

### Stock Out Endpoints

```
POST   /stock/out                      # Record a sale or rental
GET    /stock/out                      # Fetch all stock out transactions
GET    /stock/out?type=SOLD            # Fetch only sold items
GET    /stock/out?type=RENTED          # Fetch only rented items
PATCH  /stock/out/{id}/return          # Mark rented item as returned
```

### Stock In Endpoints

```
GET    /stock/inventory                # Fetch all inventory items
POST   /stock/in                       # Add items back to inventory
```

---

## 📊 Data Models

### StockTransaction

```typescript
{
  id: string;
  productId: string;
  productName: string;
  type: 'SOLD' | 'RENTED';
  clientName: string;
  clientEmail: string;
  quantity: number;
  transactionDate: string;
  returnDate?: string;                 // For rented items
  status?: 'ACTIVE' | 'RETURNED';      // For rented items
  createdAt: string;
  updatedAt: string;
}
```

### StockOutPayload

```typescript
{
  productId: string;
  type: 'SOLD' | 'RENTED';
  clientName: string;
  clientEmail: string;
  quantity: number;
  returnDate?: string;                 // Required if type='RENTED'
}
```

---

## 🎯 How to Use

### Recording a Sale

1. Navigate to **Stock Out** page
2. Click **"Record Stock Out"** button
3. Select product, set type to "Sold"
4. Enter client details (name & email)
5. Enter quantity
6. Click **"Record Sale"**

### Recording a Rental

1. Navigate to **Stock Out** page
2. Click **"Record Stock Out"** button
3. Select product, set type to "Rented"
4. Enter client details (name & email)
5. Enter quantity
6. **Enter expected return date** (required for rentals)
7. Click **"Record Rental"**

### Viewing Inventory

1. Navigate to **Stock In** page
2. Browse products in card grid
3. View quantity and status at a glance
4. Check summary stats at the bottom

### Filtering Transactions

1. On Stock Out page, click filter buttons: **ALL**, **SOLD**, or **RENTED**
2. Table updates instantly
3. Summary stats reflect filtered data

---

## 🎨 Design Features

### Colors & Styling

- **Primary Color**: #073c56 (Dark Blue)
- **Accent Colors**: Blue (Sold), Amber (Rented), Green (In Stock), Red (Out of Stock)
- **Layout**: Responsive grid and table layouts
- **Tables**: Using `react-data-table-component` with custom styling

### User Experience

- Loading states with spinners
- Empty states with helpful messages
- Responsive design (mobile, tablet, desktop)
- Form validation with error messages
- Toast notifications for success/errors
- Hoverable rows and interactive elements

---

## 🔧 Implementation Details

### State Management (Zustand)

The `useStockStore` hook manages:

- `stockOut`: Array of stock out transactions
- `inventory`: Array of inventory items
- Loading and error states
- Actions for fetching, recording, and updating transactions

### Form Validation (Formik + Yup)

- Product selection required
- Email validation
- Quantity must be ≥ 1
- Return date required for rentals
- Client name min 2 characters

---

## 📝 Configuration Requirements

Before using this system, ensure:

1. **Backend API** is set up with the endpoints listed above
2. **Products** are available in the system (from Products page)
3. **Customers** can be tracked by name and email

---

## 🚀 Future Enhancements

Possible improvements:

- PDF/Excel export for reports
- Rental reminder notifications
- Product filtering by category
- Customer history view
- Stock alerts
- Admin analytics dashboard
- Bulk operations
- Rental return management interface

---

## 📞 Support

For issues or questions:

1. Check form validation messages
2. Verify backend API is running
3. Check browser console for errors
4. Ensure all products are created before recording sales
