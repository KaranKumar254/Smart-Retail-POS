import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import PageHeader from '@/components/layout/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import RevenueAreaChart from '@/components/charts/RevenueAreaChart';
import SalesDonutChart from '@/components/charts/SalesDonutChart';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { dashboardService } from '@/services/dashboardService';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { userService } from '@/services/userService';

// ── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />;
}

function StatsSkeleton() {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
    </section>
  );
}

// ── Quick action card ────────────────────────────────────────────────────────
function QuickAction({ icon, label, description, color, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="card-panel flex items-center gap-4 p-4 text-left transition hover:shadow-md w-full"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-slate-800 text-sm">{label}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">{description}</p>
      </div>
    </motion.button>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
function AdminDashboard() {
  const navigate = useNavigate();
  const [statCards, setStatCards]           = useState([]);
  const [revenueData, setRevenueData]       = useState([]);
  const [salesChannelData, setSalesData]    = useState([]);
  const [topProducts, setTopProducts]       = useState([]);
  const [recentTxns, setRecentTxns]         = useState([]);
  const [teamCount, setTeamCount]           = useState(0);
  const [loading, setLoading]               = useState(true);
  const [lastRefresh, setLastRefresh]       = useState(new Date());

  const load = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [stats, revenue, channels, products, orders, users] = await Promise.all([
        dashboardService.getStatCards(),
        dashboardService.getRevenueTrend(),
        dashboardService.getSalesChannelSplit(),
        productService.getTop(5),
        orderService.getRecent(5),
        userService.getAll(),
      ]);
      setStatCards(stats);
      setRevenueData(revenue);
      setSalesData(channels);
      setTopProducts(products);
      setRecentTxns(orders);
      setTeamCount(users.length);
      setLastRefresh(new Date());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load dashboard data');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const productColumns = [
    {
      key: 'name', title: 'Product',
      render: (v) => <span className="font-medium text-slate-800">{v}</span>,
    },
    { key: 'sold', title: 'Units Sold' },
    {
      key: 'stock', title: 'Stock',
      render: (v) => <Badge tone={v < 20 ? 'amber' : 'emerald'}>{v} left</Badge>,
    },
    {
      key: 'revenue', title: 'Revenue',
      render: (v) => <span className="font-semibold text-slate-900">{formatCurrency(v)}</span>,
    },
  ];

  const quickActions = [
    { icon: '🧾', label: 'New Sale',        description: 'Open POS billing screen',      color: 'bg-primary-50 text-primary-600', path: '/pos' },
    { icon: '📦', label: 'Add Product',     description: 'Create a new product listing',  color: 'bg-emerald-50 text-emerald-600', path: '/products' },
    { icon: '🏪', label: 'Adjust Stock',    description: 'Stock in / stock out inventory', color: 'bg-violet-50 text-violet-600',   path: '/inventory' },
    { icon: '👥', label: 'Manage Team',     description: 'Add or edit team members',       color: 'bg-amber-50 text-amber-600',     path: '/team' },
    { icon: '📊', label: 'View Reports',    description: 'Revenue & sales reports',        color: 'bg-rose-50 text-rose-600',       path: '/reports' },
    { icon: '📋', label: 'Orders',          description: 'View and update order status',   color: 'bg-slate-100 text-slate-600',    path: '/orders' },
  ];

  return (
    <div className="page-section space-y-8">

      {/* ── Header ── */}
      <PageHeader
        title="Admin dashboard"
        description={`Last updated at ${lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
        actions={
          <Button onClick={() => load(true)} className="flex items-center gap-2 text-sm px-4 py-2">
            <span>↻</span> Refresh
          </Button>
        }
      />

      {/* ── Skeleton ── */}
      {loading ? (
        <div className="space-y-8">
          <StatsSkeleton />
          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      ) : (
        <>
          {/* ── Stat cards ── */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {statCards.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <StatsCard item={item} />
              </motion.div>
            ))}
            {/* Team count card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ delay: statCards.length * 0.06 }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/team')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/team'); }}
              className="card-panel h-full p-5 cursor-pointer text-left transition hover:shadow-md"
            >
              <p className="text-sm text-slate-500">Team Members</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{teamCount}</h3>
              <p className="mt-3 text-xs text-slate-400">Admins, Managers & Cashiers</p>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/team'); }}
                className="mt-3 text-xs font-semibold text-primary-600 hover:underline"
              >
                Manage team →
              </button>
            </motion.div>
          </section>

          {/* ── Quick actions ── */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="section-title">Quick actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {quickActions.map((qa) => (
                <QuickAction key={qa.label} {...qa} onClick={() => navigate(qa.path)} />
              ))}
            </div>
          </section>

          {/* ── Charts ── */}
          <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <RevenueAreaChart data={revenueData} />
            <SalesDonutChart data={salesChannelData} />
          </section>

          {/* ── Tables + transactions ── */}
          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">

            {/* Top products */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="section-title">Top Selling Products</h2>
                <button onClick={() => navigate('/products')} className="text-xs font-semibold text-primary-600 hover:underline">
                  View all →
                </button>
              </div>
              <DataTable columns={productColumns} data={topProducts} />
            </div>

            {/* Recent transactions */}
            <div className="card-panel p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="section-title">Recent Transactions</h2>
                <Badge tone="blue">Live</Badge>
              </div>

              {recentTxns.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-400">
                  No transactions yet.<br />
                  <button onClick={() => navigate('/pos')} className="mt-2 font-semibold text-primary-600 hover:underline">
                    Start a sale →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTxns.map((txn) => (
                    <motion.div
                      key={txn._id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 hover:bg-slate-100 transition"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800 text-sm">{txn.customer}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {txn.orderNumber} · {txn.payment}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {new Date(txn.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="ml-3 shrink-0 text-right">
                        <p className="font-semibold text-slate-900">{formatCurrency(txn.total)}</p>
                        <Badge tone={txn.status === 'Completed' ? 'emerald' : 'amber'} className="mt-1.5">
                          {txn.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <button
                onClick={() => navigate('/orders')}
                className="mt-4 w-full rounded-2xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                View all orders
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;