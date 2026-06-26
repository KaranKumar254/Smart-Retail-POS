import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import LoginPage from '@/pages/auth/LoginPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import DashboardRouter from '@/pages/dashboard/DashboardRouter';
import ProductsPage from '@/pages/products/ProductsPage';
import POSPage from '@/pages/pos/POSPage';
import InventoryPage from '@/pages/inventory/InventoryPage';
import OrdersPage from '@/pages/orders/OrdersPage';
import ReportsPage from '@/pages/reports/ReportsPage';
import UserManagementPage from '@/pages/users/UserManagementPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Cashier']} />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route element={<AppShell />}>
          <Route path="/team" element={<UserManagementPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;
