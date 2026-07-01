import { useAuthStore } from '@/store/authStore';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import CashierDashboard from './CashierDashboard';

function DashboardRouter() {
  const role = useAuthStore((state) => state.user?.role);

  if (role === 'Admin') return <AdminDashboard />;
  if (role === 'Manager') return <ManagerDashboard />;
  if (role === 'Cashier') return <CashierDashboard />;

  return <CashierDashboard />;
}

export default ;
