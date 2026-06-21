import { HiBars3BottomLeft, HiOutlineBell, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

function Navbar() {
  const { user, logout } = useAuthStore();
  const { toggleSidebar, search, setSearch } = useUIStore();

  return (
    <header className="sticky top-4 z-20 mb-6 flex items-center justify-between gap-4 rounded-[28px] border border-white/70 bg-white/80 px-4 py-4 shadow-glass backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="rounded-2xl bg-slate-100 p-3 text-slate-600 transition hover:bg-slate-200">
          <HiBars3BottomLeft size={20} />
        </button>
        <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex md:min-w-[320px]">
          <HiOutlineMagnifyingGlass className="text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, orders, customers"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-2xl bg-slate-100 p-3 text-slate-600 transition hover:bg-slate-200">
          <HiOutlineBell size={20} />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.role}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 font-bold text-white">
          {user?.name?.[0] || 'A'}
        </div>
        <button onClick={logout} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
