export const mockUser = {
  id: 'u1',
  name: 'Karan Kumar',
  email: 'admin@smartretail.com',
  role: 'Admin',
  store: 'Central Flagship',
};

export const statCards = [
  { title: "Today's Sales", value: 124500, change: '+18.2%', tone: 'blue' },
  { title: 'Total Orders', value: 286, change: '+9.4%', tone: 'emerald' },
  { title: 'Revenue', value: 842300, change: '+12.8%', tone: 'violet' },
  { title: 'Low Stock Alerts', value: 18, change: '-5 items', tone: 'amber' },
];

export const revenueData = [
  { month: 'Jan', revenue: 320000, target: 280000 },
  { month: 'Feb', revenue: 410000, target: 340000 },
  { month: 'Mar', revenue: 480000, target: 390000 },
  { month: 'Apr', revenue: 530000, target: 450000 },
  { month: 'May', revenue: 590000, target: 510000 },
  { month: 'Jun', revenue: 680000, target: 560000 },
  { month: 'Jul', revenue: 730000, target: 610000 },
  { month: 'Aug', revenue: 842300, target: 700000 },
];

export const salesChannelData = [
  { name: 'Retail Store', value: 48 },
  { name: 'Online', value: 30 },
  { name: 'Wholesale', value: 14 },
  { name: 'Marketplace', value: 8 },
];

export const topProducts = [
  { id: 1, name: 'Organic Basmati Rice', sku: 'SKU-101', sold: 326, revenue: 228200, stock: 58, category: 'Grocery', price: 700, barcode: '890100000101' },
  { id: 2, name: 'Cold Brew Coffee Bottle', sku: 'SKU-102', sold: 281, revenue: 168600, stock: 22, category: 'Beverages', price: 600, barcode: '890100000102' },
  { id: 3, name: 'Bluetooth Earbuds Pro', sku: 'SKU-103', sold: 142, revenue: 255600, stock: 13, category: 'Electronics', price: 1800, barcode: '890100000103' },
  { id: 4, name: 'Premium Yoga Mat', sku: 'SKU-104', sold: 133, revenue: 119700, stock: 34, category: 'Fitness', price: 900, barcode: '890100000104' },
  { id: 5, name: 'Leather Wallet Slim', sku: 'SKU-105', sold: 126, revenue: 113400, stock: 11, category: 'Accessories', price: 900, barcode: '890100000105' },
  { id: 6, name: 'Smart LED Bulb', sku: 'SKU-106', sold: 118, revenue: 70800, stock: 74, category: 'Home', price: 600, barcode: '890100000106' },
];

export const recentTransactions = [
  { id: 'TXN-2041', customer: 'Walk-in Customer', amount: 3240, payment: 'UPI', status: 'Completed', time: '09:14 AM' },
  { id: 'TXN-2042', customer: 'Riya Mehta', amount: 1820, payment: 'Card', status: 'Completed', time: '09:32 AM' },
  { id: 'TXN-2043', customer: 'Aditya Rao', amount: 5600, payment: 'Cash', status: 'Completed', time: '10:06 AM' },
  { id: 'TXN-2044', customer: 'Online Order', amount: 4280, payment: 'UPI', status: 'Processing', time: '10:28 AM' },
  { id: 'TXN-2045', customer: 'Maya Singh', amount: 960, payment: 'Cash', status: 'Completed', time: '10:41 AM' },
];

export const inventoryItems = [
  { id: 'INV-1', product: 'Organic Basmati Rice', warehouse: 'Warehouse A', stock: 58, threshold: 25, movement: '+12', store: 'Central Flagship' },
  { id: 'INV-2', product: 'Cold Brew Coffee Bottle', warehouse: 'Warehouse B', stock: 22, threshold: 30, movement: '-18', store: 'Mall Outlet' },
  { id: 'INV-3', product: 'Bluetooth Earbuds Pro', warehouse: 'Warehouse A', stock: 13, threshold: 15, movement: '-7', store: 'Airport Kiosk' },
  { id: 'INV-4', product: 'Premium Yoga Mat', warehouse: 'Warehouse C', stock: 34, threshold: 20, movement: '+10', store: 'Central Flagship' },
  { id: 'INV-5', product: 'Leather Wallet Slim', warehouse: 'Warehouse B', stock: 11, threshold: 12, movement: '-6', store: 'Online' },
];

export const orders = [
  { id: 'ORD-9001', customer: 'Riya Mehta', items: 4, total: 4280, payment: 'UPI', status: 'Processing', date: '2026-06-18' },
  { id: 'ORD-9002', customer: 'Walk-in Customer', items: 3, total: 1820, payment: 'Cash', status: 'Completed', date: '2026-06-18' },
  { id: 'ORD-9003', customer: 'BlueMart Outlet', items: 8, total: 14200, payment: 'Card', status: 'Pending', date: '2026-06-17' },
  { id: 'ORD-9004', customer: 'Arjun Patel', items: 2, total: 960, payment: 'UPI', status: 'Cancelled', date: '2026-06-17' },
  { id: 'ORD-9005', customer: 'Online Shopper', items: 6, total: 5660, payment: 'Card', status: 'Completed', date: '2026-06-16' },
];

export const reportHighlights = [
  { label: 'Daily Sales', value: 124500, delta: '+6.8%' },
  { label: 'Weekly Revenue', value: 736000, delta: '+11.3%' },
  { label: 'Monthly Revenue', value: 2842300, delta: '+14.2%' },
  { label: 'Inventory Value', value: 9680000, delta: '+3.1%' },
];
