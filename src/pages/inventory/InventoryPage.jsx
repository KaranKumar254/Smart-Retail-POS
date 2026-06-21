import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { inventoryService } from '@/services/inventoryService';

function InventoryPage() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ activeWarehouses: 0, lowStockCount: 0, sellingChannels: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [inventoryItems, inventorySummary] = await Promise.all([
        inventoryService.getAll(),
        inventoryService.getSummary(),
      ]);
      setItems(inventoryItems);
      setSummary(inventorySummary);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStock = async (productId, delta) => {
    try {
      await inventoryService.adjustStock(productId, delta);
      toast.success(delta > 0 ? 'Stock added successfully' : 'Stock removed successfully');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update stock');
    }
  };

  const columns = [
    { key: 'product', title: 'Product' },
    { key: 'store', title: 'Store' },
    { key: 'warehouse', title: 'Warehouse' },
    { key: 'stock', title: 'Stock', render: (value, row) => <Badge tone={value <= row.threshold ? 'amber' : 'emerald'}>{value} units</Badge> },
    { key: 'movement', title: 'Recent movement' },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => updateStock(row.productId, 5)}>Stock In</Button>
          <Button variant="ghost" className="px-3 py-2 text-xs" onClick={() => updateStock(row.productId, -3)}>Stock Out</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-section">
      <PageHeader
        title="Inventory management"
        description="Track stock across warehouses and stores, view movement history, and respond instantly to low-stock alerts."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card-panel p-5">
          <p className="text-sm text-slate-500">Warehouse stock</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">{summary.activeWarehouses} active hubs</h3>
          <p className="mt-2 text-sm text-slate-500">Centralized replenishment serving retail, kiosks, and online orders.</p>
        </div>
        <div className="card-panel p-5">
          <p className="text-sm text-slate-500">Low stock alerts</p>
          <h3 className="mt-3 text-3xl font-bold text-amber-500">{summary.lowStockCount} critical SKUs</h3>
          <p className="mt-2 text-sm text-slate-500">Threshold-based alerts to trigger procurement and store transfer flows.</p>
        </div>
        <div className="card-panel p-5">
          <p className="text-sm text-slate-500">Multi-store coverage</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">{summary.sellingChannels} selling channels</h3>
          <p className="mt-2 text-sm text-slate-500">Physical stores, kiosk outlets, wholesale, and online inventory views.</p>
        </div>
      </div>

      {loading ? (
        <div className="card-panel p-10 text-center text-sm text-slate-500">Loading inventory...</div>
      ) : (
        <DataTable columns={columns} data={items} />
      )}
    </div>
  );
}

export default InventoryPage;
