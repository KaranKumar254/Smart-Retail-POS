import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { orderService } from '@/services/orderService';

function OrdersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const updated = await orderService.updateStatus(id, status);
      setItems((prev) => prev.map((item) => (item._id === id ? updated : item)));
      toast.success(`Order marked ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update order');
    }
  };

  const toneByStatus = {
    Pending: 'amber',
    Processing: 'blue',
    Completed: 'emerald',
    Cancelled: 'rose',
  };

  const columns = [
    { key: 'orderNumber', title: 'Order ID' },
    { key: 'customer', title: 'Customer' },
    { key: 'createdAt', title: 'Date', render: (value) => formatDate(value) },
    { key: 'total', title: 'Amount', render: (value) => formatCurrency(value) },
    { key: 'payment', title: 'Payment' },
    { key: 'status', title: 'Status', render: (value) => <Badge tone={toneByStatus[value]}>{value}</Badge> },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => updateStatus(row._id, 'Processing')}>Processing</Button>
          <Button variant="success" className="px-3 py-2 text-xs" onClick={() => updateStatus(row._id, 'Completed')}>Complete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-section">
      <PageHeader
        title="Orders"
        description="Review order history, track fulfillment state, and update omnichannel order progress with one click."
        actions={<Button variant="secondary">Download invoices</Button>}
      />
      {loading ? (
        <div className="card-panel p-10 text-center text-sm text-slate-500">Loading orders...</div>
      ) : (
        <DataTable columns={columns} data={items} />
      )}
    </div>
  );
}

export default OrdersPage;
