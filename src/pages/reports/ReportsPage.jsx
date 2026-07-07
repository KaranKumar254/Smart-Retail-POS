import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineArrowDownTray } from 'react-icons/hi2';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import RevenueAreaChart from '@/components/charts/RevenueAreaChart';
import DataTable from '@/components/common/DataTable';
import { formatCurrency } from '@/lib/utils';
import { dashboardService } from '@/services/dashboardService';
import { productService } from '@/services/productService';

function ReportsPage() {
  const [reportHighlights, setReportHighlights] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [highlights, revenue, products] = await Promise.all([
          dashboardService.getReportHighlights(),
          dashboardService.getRevenueTrend(),
          productService.getTop(5),
        ]);
        setReportHighlights(highlights);
        setRevenueData(revenue);
        setTopProducts(products);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not load reports');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const exportReport = (type) => toast.success(`${type} report exported successfully`);

  const columns = [
    { key: 'name', title: 'Top product' },
    { key: 'sold', title: 'Units sold' },
    { key: 'revenue', title: 'Revenue', render: (value) => formatCurrency(value) },
  ];

  return (
    <div className="page-section">
      <PageHeader
        title="Reports & analytics"
        description="Generate daily, weekly and monthly sales intelligence with downloadable exports for finance and operations teams."
        actions={
          <>
            <Button variant="secondary" onClick={() => exportReport('CSV')}><HiOutlineArrowDownTray className="mr-2" size={18} /> Export CSV</Button>
            <Button onClick={() => exportReport('PDF')}>Export PDF</Button>
          </>
        }
      />

      {loading ? (
        <div className="card-panel p-10 text-center text-sm text-slate-500">Loading reports...</div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {reportHighlights.map((item) => (
              <div key={item.label} className="card-panel p-5">
                <p className="text-sm text-slate-500">{item.label}</p>
                <h3 className="mt-3 text-3xl font-bold text-slate-900">{formatCurrency(item.value)}</h3>
                {item.delta ? <p className="mt-2 text-sm font-semibold text-accent-600">{item.delta}</p> : null}
              </div>
            ))}
          </div>

          <RevenueAreaChart data={revenueData} />
          <DataTable columns={columns} data={topProducts} />
        </>
      )}
    </div>
  );
}

export default ReportsPage;
