import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

function InventoryPage() {
  const [items, setItems] = useState([
    {
      productId: 'P001',
      product: 'Wireless Mouse',
      store: 'Main Store',
      warehouse: 'Warehouse A',
      stock: 120,
      threshold: 30,
      movement: '+15 units today',
    },
    {
      productId: 'P002',
      product: 'Mechanical Keyboard',
      store: 'Main Store',
      warehouse: 'Warehouse B',
      stock: 25,
      threshold: 40,
      movement: '-10 units today',
    },
    {
      productId: 'P003',
      product: 'Gaming Headset',
      store: 'Online Store',
      warehouse: 'Warehouse A',
      stock: 80,
      threshold: 20,
      movement: '+5 units today',
    },
    {
      productId: 'P004',
      product: '24-inch Monitor',
      store: 'Retail Outlet',
      warehouse: 'Warehouse C',
      stock: 12,
      threshold: 15,
      movement: '-3 units today',
    },
    {
      productId: 'P005',
      product: 'USB-C Cable',
      store: 'Main Store',
      warehouse: 'Warehouse B',
      stock: 200,
      threshold: 50,
      movement: '+30 units today',
    },
  ]);

  const [summary] = useState({
    activeWarehouses: 3,
    lowStockCount: 2,
    sellingChannels: 4,
  });

  const updateStock = (productId, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, stock: item.stock + delta }
          : item
      )
    );

    toast.success(
      delta > 0 ? 'Stock added successfully' : 'Stock removed successfully'
    );
  };

  const columns = [
    { key: 'product', title: 'Product' },
    { key: 'store', title: 'Store' },
    { key: 'warehouse', title: 'Warehouse' },
    {
      key: 'stock',
      title: 'Stock',
      render: (value, row) => (
        <Badge tone={value <= row.threshold ? 'amber' : 'emerald'}>
          {value} units
        </Badge>
      ),
    },
    { key: 'movement', title: 'Recent Movement' },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="px-3 py-2 text-xs"
            onClick={() => updateStock(row.productId, 5)}
          >
            Stock In
          </Button>
          <Button
            variant="ghost"
            className="px-3 py-2 text-xs"
            onClick={() => updateStock(row.productId, -3)}
          >
            Stock Out
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-section">
      <PageHeader
        title="Inventory Management"
        description="Track stock across warehouses and stores, view movement history, and respond instantly to low-stock alerts."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card-panel p-5">
          <p className="text-sm text-slate-500">Warehouse Stock</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {summary.activeWarehouses} active hubs
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Centralized replenishment serving retail, kiosks, and online orders.
          </p>
        </div>

        <div className="card-panel p-5">
          <p className="text-sm text-slate-500">Low Stock Alerts</p>
          <h3 className="mt-3 text-3xl font-bold text-amber-500">
            {summary.lowStockCount} critical SKUs
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Threshold-based alerts to trigger procurement and store transfers.
          </p>
        </div>

        <div className="card-panel p-5">
          <p className="text-sm text-slate-500">Multi-Store Coverage</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {summary.sellingChannels} selling channels
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Physical stores, kiosks, wholesale and online inventory views.
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={items} />
    </div>
  );
}

export default InventoryPage;
