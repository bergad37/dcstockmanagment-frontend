import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Clients from '../pages/Customers/Clients';
import Analytics from '../pages/Analytics/Analytics';
import Settings from '../pages/Categories/Settings';
import DashboardLayout from '../layouts/DashbordLayout';
import Login from '../pages/Login';
import PublicRoute from './PublicRoutes';
import ProtectedRoute from './ProtectedRoutes';
import { Toaster } from 'sonner';
import Products from '../pages/Products/Products';
import Users from '../pages/Users/Users';
import Stock from '../pages/Stock/StockOut';
import PortalSelect from '../pages/PortalSelect';
import MainStockOverview from '../pages/MainStock/MainStockOverview';
import MainStockProducts from '../pages/MainStock/MainStockProducts';
import MainStockSuppliers from '../pages/MainStock/MainStockSuppliers';
import MainStockStockIn from '../pages/MainStock/MainStockStockIn';
import MainStockTransfers from '../pages/MainStock/MainStockTransfers';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />

      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Portal selection — protected, no dashboard layout */}
        <Route
          path="/portal-select"
          element={
            <ProtectedRoute>
              <PortalSelect />
            </ProtectedRoute>
          }
        />

        {/* Mini Stock (existing) routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Analytics />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/settings" element={<Settings />} />

          {/* Main Stock routes */}
          <Route path="/main-stock/overview" element={<MainStockOverview />} />
          <Route path="/main-stock/products" element={<MainStockProducts />} />
          <Route path="/main-stock/suppliers" element={<MainStockSuppliers />} />
          <Route path="/main-stock/stock-in" element={<MainStockStockIn />} />
          <Route path="/main-stock/transfers" element={<MainStockTransfers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
