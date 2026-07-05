import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { orderService } from '@/services/orderService';
import {
  HiOutlineEye,
  HiOutlineArrowDownTray,
  HiOutlineReceiptPercent,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCurrencyRupee,
} from 'react-icons/hi2';

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
  const [dateFrom, setDateFrom]   = useState('');
  const [dateTo, setDateTo]       = useState('');
  const [viewing, setViewing]     = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const orders = await orderService.getAll();
      setItems(orders);
    } catch (error) {
      // silently use fallback data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const updated = await orderService.updateStatus(id, status);
      setItems((prev) => prev.map((o) => (o._id === id || o.id === id ? { ...o, status } : o)));
      toast.success(`Order marked ${status.toLowerCase()}`);
    } catch (error) {
      toast.error('Could not update order');
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total:      items.length,
    pending:    items.filter(o => o.status === 'Pending').length,
    processing: items.filter(o => o.status === 'Processing').length,
    completed:  items.filter(o => o.status === 'Completed').length,
    revenue:    items
      .filter(o => o.status === 'Completed')
      .reduce((s, o) => s + (o.total || o.amount || 0), 0),
  }), [items]);

  // Filter + search + date
  const filtered = useMemo(() => items.filter((o) => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (o.orderNumber || o.id || '').toLowerCase().includes(q) ||
      (o.customer || o.customerName || '').toLowerCase().includes(q);
    const orderDate = new Date(o.createdAt || o.date);
    const matchFrom = !dateFrom || orderDate >= new Date(dateFrom);
    const matchTo   = !dateTo   || orderDate <= new Date(dateTo + 'T23:59:59');
    return matchStatus && matchSearch && matchFrom && matchTo;
  }), [items, statusFilter, search, dateFrom, dateTo]);

  // Export CSV
  const exportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Date', 'Amount', 'Payment', 'Status'];
    const rows = filtered.map((o) => [
      o.orderNumber || o.id,
      o.customer || o.customerName || 'Walk-in',
      o.createdAt || o.date,
      o.total || o.amount || 0,
      o.payment || o.paymentMethod || '',
      o.status,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Orders exported to CSV');
  };

  const columns = [
    {
      key: 'orderNumber', title: 'Order ID',
      render: (v, row) => (
        <span className="font-mono text-xs font-semibold text-slate-700">
          {v || row.id}
        </span>
      ),
    },
    {
      key: 'customer', title: 'Customer',
      render: (v, row) => (
        <span className="font-medium text-slate-800">
          {v || row.customerName || 'Walk-in Customer'}
        </span>
      ),
    },
    {
      key: 'createdAt', title: 'Date',
      render: (v, row) => formatDate(v || row.date),
    },
    {
      key: 'total', title: 'Amount',
      render: (v, row) => (
        <span className="font-semibold">
          {formatCurrency(v || row.amount || 0)}
        </span>
      ),
    },
    {
      key: 'payment', title: 'Payment',
      render: (v, row) => v || row.paymentMethod || '—',
    },
    {
      key: 'items', title: 'Items',
      render: (v, row) => (
        <span className="text-slate-600">
          {Array.isArray(v) ? v.length : (row.items || '—')} items
        </span>
      ),
    },
    {
      key: 'status', title: 'Status',
      render: (v) => <Badge tone={STATUS_TONES[v]}>{v}</Badge>,
    },
    {
      key: 'actions', title: 'Actions',
      render: (_, row) => (
        <div className="flex flex-wrap gap-1.5">
          {/* View Details */}
          <button
            onClick={() => setViewing(row)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition flex items-center gap-1"
          >
            <HiOutlineEye size={12} /> View
          </button>

          {row.status !== 'Processing' && row.status !== 'Completed' && row.status !== 'Cancelled' && (
            <button
              onClick={() => updateStatus(row._id || row.id, 'Processing')}
              className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
            >
              Processing
            </button>
          )}
          {row.status !== 'Completed' && row.status !== 'Cancelled' && (
            <button
              onClick={() => updateStatus(row._id || row.id, 'Completed')}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
            >
              Complete
            </button>
          )}
          {row.status !== 'Cancelled' && row.status !== 'Completed' && (
            <button
              onClick={() => updateStatus(row._id || row.id, 'Cancelled')}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
            >
              Cancel
            </button>
          )}
          {(row.status === 'Completed' || row.status === 'Cancelled') && row.status !== 'Completed' && (
            <span className="text-xs text-slate-400 italic">No actions</span>
          )}
        </div>
      ),
    },
  ];

  const statCards = [
    { label: 'Total Orders',  value: stats.total,                   icon: HiOutlineReceiptPercent, color: 'bg-slate-50   text-slate-700'   },
    { label: 'Pending',       value: stats.pending,                 icon: HiOutlineClock,          color: 'bg-amber-50   text-amber-700'   },
    { label: 'Processing',    value: stats.processing,              icon: HiOutlineClock,          color: 'bg-blue-50    text-blue-700'    },
    { label: 'Completed',     value: stats.completed,               icon: HiOutlineCheckCircle,    color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: HiOutlineCurrencyRupee,  color: 'bg-violet-50  text-violet-700'  },
  ];

  return (
    <div className="page-section space-y-6">
      <PageHeader
        title="Orders"
        description="Review order history, track fulfillment state, and update order progress with one click."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" className="text-sm px-4 py-2" onClick={exportCSV}>
              <HiOutlineArrowDownTray size={15} className="mr-1" /> Export CSV
            </Button>
            <Button variant="secondary" className="text-sm px-4 py-2" onClick={load}>
              ↻ Refresh
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl p-4 ${s.color}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className="opacity-60" />
                <p className="text-xs font-medium opacity-70">{s.label}</p>
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </motion.div>
          );
        })}
      </section>

      {/* Search + Date + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <input
          type="text"
          placeholder="Search by order ID or customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 sm:max-w-xs"
        />
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
          />
          <span className="text-slate-400 text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Clear
            </button>
          )}
        </div>
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

      {/* Order Details Modal */}
      {viewing && (
        <Modal open={!!viewing} onClose={() => setViewing(null)} title="Order Details">
          <div className="space-y-4">
            {/* Order Header */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <div>
                <p className="font-mono text-sm font-bold text-slate-800">
                  {viewing.orderNumber || viewing.id}
                </p>
                <p className="text-xs text-slate-500">
                  {formatDate(viewing.createdAt || viewing.date)}
                </p>
              </div>
              <Badge tone={STATUS_TONES[viewing.status]}>{viewing.status}</Badge>
            </div>

            {/* Customer + Payment */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500 mb-1">Customer</p>
                <p className="text-sm font-semibold text-slate-800">
                  {viewing.customer || viewing.customerName || 'Walk-in Customer'}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                <p className="text-sm font-semibold text-slate-800">
                  {viewing.payment || viewing.paymentMethod || '—'}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Items ({Array.isArray(viewing.items) ? viewing.items.length : viewing.items})
              </p>
              {Array.isArray(viewing.items) && viewing.items.length > 0 ? (
                <div className="space-y-2">
                  {viewing.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.name || item.sku}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatCurrency(item.subtotal || item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  {viewing.items} item(s) — detailed breakdown available after backend integration
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5">
              {viewing.subtotal && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span><span>{formatCurrency(viewing.subtotal)}</span>
                </div>
              )}
              {viewing.gst && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>GST (18%)</span><span>{formatCurrency(viewing.gst)}</span>
                </div>
              )}
              {viewing.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount {viewing.couponCode && `(${viewing.couponCode})`}</span>
                  <span>−{formatCurrency(viewing.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-slate-900 pt-1 border-t border-slate-100">
                <span>Total</span>
                <span>{formatCurrency(viewing.total || viewing.amount || 0)}</span>
              </div>
            </div>

            {/* Actions in modal */}
            <div className="flex gap-2 pt-2">
              {viewing.status !== 'Completed' && viewing.status !== 'Cancelled' && (
                <>
                  {viewing.status !== 'Processing' && (
                    <Button
                      variant="secondary"
                      className="flex-1 text-sm"
                      onClick={() => { updateStatus(viewing._id || viewing.id, 'Processing'); setViewing(null); }}
                    >
                      Mark Processing
                    </Button>
                  )}
                  <Button
                    className="flex-1 text-sm"
                    onClick={() => { updateStatus(viewing._id || viewing.id, 'Completed'); setViewing(null); }}
                  >
                    Mark Completed
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default OrdersPage;
