import { NavLink } from 'react-router-dom';
import { HiOutlineArchiveBox, HiOutlineChartBar, HiOutlineCube, HiOutlineHome, HiOutlineReceiptPercent, HiOutlineShoppingCart, HiOutlineUserGroup } from 'react-icons/hi2';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: HiOutlineHome },
  { label: 'Products', to: '/products', icon: HiOutlineCube },
  { label: 'POS Billing', to: '/pos', icon: HiOutlineShoppingCart },
  { label: 'Inventory', to: '/inventory', icon: HiOutlineArchiveBox },
  { label: 'Orders', to: '/orders', icon: HiOutlineReceiptPercent },
  { label: 'Reports', to: '/reports', icon: HiOutlineChartBar },
];

const adminOnlyItems = [
  { label: 'Team', to: '/team', icon: HiOutlineUserGroup },
];

function Sidebar() {
  const { sidebarOpen } = useUIStore();
  const role = useAuthStore((state) => state.user?.role);
  const items = role === 'Admin' ? [...navItems, ...adminOnlyItems] : navItems;

  return (
    <aside className={cn('glass-panel fixed left-4 top-4 z-30 hidden h-[calc(100vh-2rem)] w-[270px] rounded-[32px] p-5 lg:flex lg:flex-col', !sidebarOpen && 'lg:w-[96px]')}>
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-lg font-bold text-white">SR</div>
        {sidebarOpen ? (
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Smart Retail POS</h2>
            <p className="text-xs text-slate-500">Omnichannel control center</p>
          </div>
        ) : null}
      </div>

      <nav className="mt-8 flex-1 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                  isActive ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-100' : 'text-slate-600 hover:bg-slate-100',
                )
              }
            >
              <Icon size={20} />
              {sidebarOpen ? <span>{item.label}</span> : null}
            </NavLink>
          );
        })}
      </nav>

      <div className="rounded-3xl bg-gradient-to-br from-primary-50 to-emerald-50 p-4">
        <p className="text-sm font-semibold text-slate-800">Retail Insight</p>
        <p className="mt-1 text-xs text-slate-500">Low stock alerts across 3 stores require restocking today.</p>
      </div>
    </aside>
  );
}

export default Sidebar;