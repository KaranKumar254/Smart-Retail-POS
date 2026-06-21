import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/layout/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import SalesDonutChart from '@/components/charts/SalesDonutChart';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { dashboardService } from '@/services/dashboardService';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { inventoryService } from '@/services/inventoryService';

function ManagerDashboard() {
  const [statCards, setStatCards] = useState([]);
  const [salesChannelData, setSalesChannelData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [inventorySummary, setInventorySummary] = useState({ activeWarehouses: 0, lowStockCount: 0, sellingChannels: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [stats, channels, products, orders, invSummary] = await Promise.all([
          dashboardService.getStatCards(),
          dashboardService.getSalesChannelSplit(),
          productService.getTop(5),
          orderService.getRecent(6),
          inventoryService.getSummary(),
        ]);
        setStatCards(stats);
        setSalesChannelData(channels);
        setTopProducts(products);
        setRecentOrders(orders);
        setInventorySummary(invSummary);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const orderColumns = [
    { key: 'orderNumber', title: 'Order' },
    { key: 'customer', title: 'Customer' },
    { key: 'total', title: 'Amount', render: (value) => formatCurrency(value) },
    { key: 'status', title: 'Status', render: (value) => <Badge tone={value === 'Completed' ? 'emerald' : 'amber'}>{value}</Badge> },
  ];

  return (
    <div className="page-section">
      <PageHeader
        title="Store operations dashboard"
        description="Track today's sales pace, inventory health, and order fulfillment for your store."
      />

      {loading ? (
        <div className="card-panel p-10 text-center text-sm text-slate-500">Loading dashboard...</div>
      ) : (
        <>
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((item) => <StatsCard key={item.title} item={item} />)}
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="card-panel p-5">
              <p className="text-sm text-slate-500">Active warehouses</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">{inventorySummary.activeWarehouses}</h3>
              <p className="mt-3 text-xs text-slate-500">Hubs currently feeding your store's stock.</p>
            </div>
            <div className="card-panel p-5">
              <p className="text-sm text-slate-500">Low stock alerts</p>
              <h3 className="mt-2 text-3xl font-bold text-amber-500">{inventorySummary.lowStockCount}</h3>
              <p className="mt-3 text-xs text-slate-500">SKUs at or below their reorder threshold.</p>
            </div>
            <div className="card-panel p-5">
              <p className="text-sm text-slate-500">Selling channels</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">{inventorySummary.sellingChannels}</h3>
              <p className="mt-3 text-xs text-slate-500">Stores and online fronts you're supplying.</p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <div className="space-y-4">
              <h2 className="section-title">Top selling products</h2>
              <DataTable
                columns={[
                  { key: 'name', title: 'Product' },
                  { key: 'sold', title: 'Units Sold' },
                  { key: 'stock', title: 'Stock', render: (value) => <Badge tone={value < 20 ? 'amber' : 'emerald'}>{value} left</Badge> },
                ]}
                data={topProducts}
              />
            </div>
            <SalesDonutChart data={salesChannelData} />
          </section>

          <section className="space-y-4">
            <h2 className="section-title">Recent orders to action</h2>
            <DataTable columns={orderColumns} data={recentOrders} />
          </section>
        </>
      )}
    </div>
  );
}

export default ManagerDashboard;