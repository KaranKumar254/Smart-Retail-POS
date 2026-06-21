import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/layout/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import RevenueAreaChart from '@/components/charts/RevenueAreaChart';
import SalesDonutChart from '@/components/charts/SalesDonutChart';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { dashboardService } from '@/services/dashboardService';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { userService } from '@/services/userService';

function AdminDashboard() {
  const [statCards, setStatCards] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [salesChannelData, setSalesChannelData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [teamCount, setTeamCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
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
        setSalesChannelData(channels);
        setTopProducts(products);
        setRecentTransactions(orders);
        setTeamCount(users.length);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns = [
    { key: 'name', title: 'Product' },
    { key: 'sold', title: 'Units Sold' },
    { key: 'stock', title: 'Stock', render: (value) => <Badge tone={value < 20 ? 'amber' : 'emerald'}>{value} left</Badge> },
    { key: 'revenue', title: 'Revenue', render: (value) => formatCurrency(value) },
  ];

  return (
    <div className="page-section">
      <PageHeader
        title="Admin command center"
        description="Full visibility across sales, inventory, team, and revenue performance for every store and channel."
      />

      {loading ? (
        <div className="card-panel p-10 text-center text-sm text-slate-500">Loading dashboard...</div>
      ) : (
        <>
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((item) => <StatsCard key={item.title} item={item} />)}
            <div className="card-panel p-5">
              <p className="text-sm text-slate-500">Team Members</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{teamCount}</h3>
              <p className="mt-4 text-xs text-slate-500">Admins, Managers, and Cashiers across all stores.</p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <RevenueAreaChart data={revenueData} />
            <SalesDonutChart data={salesChannelData} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="section-title">Top selling products</h2>
                <p className="muted-text">Updated every 5 minutes</p>
              </div>
              <DataTable columns={columns} data={topProducts} />
            </div>

            <div className="card-panel p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="section-title">Recent transactions</h2>
                <Badge tone="blue">Live</Badge>
              </div>
              <div className="space-y-4">
                {recentTransactions.length === 0 && (
                  <p className="text-sm text-slate-500">No transactions yet.</p>
                )}
                {recentTransactions.map((txn) => (
                  <div key={txn._id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div>
                      <p className="font-semibold text-slate-800">{txn.customer}</p>
                      <p className="mt-1 text-xs text-slate-500">{txn.orderNumber} • {txn.payment} • {new Date(txn.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{formatCurrency(txn.total)}</p>
                      <Badge tone={txn.status === 'Completed' ? 'emerald' : 'amber'} className="mt-2">{txn.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;