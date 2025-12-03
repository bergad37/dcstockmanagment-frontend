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
// import ProtectedRoute from './ProtectedRoutes';
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          element={
            // <ProtectedRoute>  to be uncommented when the backend is ready
            <DashboardLayout />
            // </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/stock" element={<StockIn />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
