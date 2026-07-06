import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import PageHeader from '@/components/layout/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { dashboardService } from '@/services/dashboardService';
import { orderService } from '@/services/orderService';

function CashierDashboard() {
  const navigate = useNavigate();
  const [statCards, setStatCards] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [stats, orders] = await Promise.all([
          dashboardService.getStatCards(),
          orderService.getRecent(8),
        ]);
        setStatCards(stats.filter((item) => item.title === "Today's Sales" || item.title === 'Total Orders'));
        setRecentTransactions(orders);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-section">
      <PageHeader
        title="Billing dashboard"
        description="Your shift snapshot — today's sales and recent transactions. Head to POS Billing to start a new sale."
        actions={<Button onClick={() => navigate('/pos')}><HiOutlineShoppingCart className="mr-2" size={18} /> Go to POS</Button>}
      />

      {loading ? (
        <div className="card-panel p-10 text-center text-sm text-slate-500">Loading dashboard...</div>
      ) : (
        <>
          <section className="grid gap-5 sm:grid-cols-2">
            {statCards.map((item) => <StatsCard key={item.title} item={item} />)}
          </section>

          <section className="card-panel p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="section-title">Recent Transactions</h2>
              <Badge tone="blue">Live</Badge>
            </div>
            <div className="space-y-4">
              {recentTransactions.length === 0 && (
                <p className="text-sm text-slate-500">No transactions yet — start a sale from POS Billing.</p>
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
          </section>
        </>
      )}
    </div>
  );
}

export default CashierDashboard;
