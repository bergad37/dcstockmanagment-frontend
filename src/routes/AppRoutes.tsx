import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Clients from '../pages/Customers/Clients';
import Analytics from '../pages/Analytics/Analytics';
import Settings from '../pages/Categories/Settings';
import DashboardLayout from '../layouts/DashbordLayout';
import Login from '../pages/Login';
import PublicRoute from './PublicRoutes';
// import StockIn from '../pages/Stock/StockIn';
import ProtectedRoute from './ProtectedRoutes';
import { Toaster } from 'sonner';
import Products from '../pages/Products/Products';
import Users from '../pages/Users/Users';
import StockOut from '../pages/Stock/StockOut';
import StockIn from '../pages/Stock/StockIn';
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

        {/* Protected Routes */}
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
          <Route path="/stock" element={<StockOut />} />
          {/* <Route path="/stock" element={<StockIn />} /> */}
          <Route path="/clients" element={<Clients />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
