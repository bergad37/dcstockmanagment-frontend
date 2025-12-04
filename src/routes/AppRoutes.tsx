import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Clients from '../pages/Clients';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import DashboardLayout from '../layouts/DashbordLayout';
import Login from '../pages/Login';
import PublicRoute from './PublicRoutes';
import StockIn from '../pages/StockIn';
import ProtectedRoute from './ProtectedRoutes';
import { Toaster } from 'sonner';
import Products from '../pages/Products';
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stock" element={<StockIn />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
