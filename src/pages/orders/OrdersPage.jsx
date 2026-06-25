import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { orderService } from '@/services/orderService';

const STATUS_TONES = {
  Pending: 'amber',
  Processing: 'blue',
  Completed: 'emerald',
  Cancelled: 'rose',
};

const ALL_STATUSES = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />;
}

function OrdersPage() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('All');

  const load = async () => {
    try {
      setLoading(true);
      const orders = await orderService.getAll();
      setItems(orders);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const updated = await orderService.updateStatus(id, status);
      setItems((prev) => prev.map((o) => (o._id === id ? updated : o)));
      toast.success(`Order marked ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update order');
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total:      items.length,
    pending:    items.filter(o => o.status === 'Pending').length,
    processing: items.filter(o => o.status === 'Processing').length,
    completed:  items.filter(o => o.status === 'Completed').length,
    revenue:    items.filter(o => o.status === 'Completed').reduce((s, o) => s + (o.total || 0), 0),
  }), [items]);

  // Filter + search
  const filtered = useMemo(() => items.filter((o) => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.orderNumber?.toLowerCase().includes(q) || o.customer?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  }), [items, statusFilter, search]);

  const columns = [
    {
      key: 'orderNumber', title: 'Order ID',
      render: (v) => <span className="font-mono text-xs font-semibold text-slate-700">{v}</span>,
    },
    {
      key: 'customer', title: 'Customer',
      render: (v) => <span className="font-medium text-slate-800">{v || '—'}</span>,
    },
    { key: 'createdAt', title: 'Date',    render: (v) => formatDate(v) },
    { key: 'total',     title: 'Amount',  render: (v) => <span className="font-semibold">{formatCurrency(v)}</span> },
    { key: 'payment',   title: 'Payment' },
    {
      key: 'status', title: 'Status',
      render: (v) => <Badge tone={STATUS_TONES[v]}>{v}</Badge>,
    },
    {
      key: 'actions', title: 'Actions',
      render: (_, row) => (
        <div className="flex flex-wrap gap-1.5">
          {row.status !== 'Processing' && row.status !== 'Completed' && row.status !== 'Cancelled' && (
            <button
              onClick={() => updateStatus(row._id, 'Processing')}
              className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
            >
              Processing
            </button>
          )}
          {row.status !== 'Completed' && row.status !== 'Cancelled' && (
            <button
              onClick={() => updateStatus(row._id, 'Completed')}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
            >
              Complete
            </button>
          )}
          {row.status !== 'Cancelled' && row.status !== 'Completed' && (
            <button
              onClick={() => updateStatus(row._id, 'Cancelled')}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
            >
              Cancel
            </button>
          )}
          {(row.status === 'Completed' || row.status === 'Cancelled') && (
            <span className="text-xs text-slate-400 italic">No actions</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page-section space-y-6">
      <PageHeader
        title="Orders"
        description="Review order history, track fulfillment state, and update order progress with one click."
        actions={
          <Button variant="secondary" className="text-sm px-4 py-2" onClick={load}>
            ↻ Refresh
          </Button>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Orders',  value: stats.total,                  color: 'bg-slate-50   text-slate-700'   },
          { label: 'Pending',       value: stats.pending,                color: 'bg-amber-50   text-amber-700'   },
          { label: 'Processing',    value: stats.processing,             color: 'bg-blue-50    text-blue-700'    },
          { label: 'Revenue',       value: formatCurrency(stats.revenue), color: 'bg-emerald-50 text-emerald-700' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-2xl p-4 ${s.color}`}
          >
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="mt-1 text-xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </section>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by order ID or customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === s
                  ? 'bg-primary-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-panel p-12 text-center text-sm text-slate-400">
          No orders match your search or filter.
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}

      <p className="text-right text-xs text-slate-400">
        Showing {filtered.length} of {items.length} orders
      </p>
    </div>
  );
}

export default OrdersPage;