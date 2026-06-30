import dotenv from 'dotenv';

dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import InventoryLog from '../models/InventoryLog.js';

const demoUsers = [
  { name: 'Aarav Sharma', email: 'admin@smartretail.com', password: 'Admin@123', role: 'Admin', store: 'Central Flagship' },
  { name: 'Priya Nair', email: 'manager@smartretail.com', password: 'Manager@123', role: 'Manager', store: 'Mall Outlet' },
  { name: 'Karan Verma', email: 'cashier@smartretail.com', password: 'Cashier@123', role: 'Cashier', store: 'Airport Kiosk' },
];

const demoProducts = [
  { name: 'Organic Basmati Rice', sku: 'SKU-101', barcode: '890100000101', category: 'Grocery', price: 700, stock: 58, threshold: 25, warehouse: 'Warehouse A', store: 'Central Flagship' },
  { name: 'Cold Brew Coffee Bottle', sku: 'SKU-102', barcode: '890100000102', category: 'Beverages', price: 600, stock: 22, threshold: 30, warehouse: 'Warehouse B', store: 'Mall Outlet' },
  { name: 'Bluetooth Earbuds Pro', sku: 'SKU-103', barcode: '890100000103', category: 'Electronics', price: 1800, stock: 13, threshold: 15, warehouse: 'Warehouse A', store: 'Airport Kiosk' },
  { name: 'Premium Yoga Mat', sku: 'SKU-104', barcode: '890100000104', category: 'Fitness', price: 900, stock: 34, threshold: 20, warehouse: 'Warehouse C', store: 'Central Flagship' },
  { name: 'Leather Wallet Slim', sku: 'SKU-105', barcode: '890100000105', category: 'Accessories', price: 900, stock: 11, threshold: 12, warehouse: 'Warehouse B', store: 'Online' },
  { name: 'Smart LED Bulb', sku: 'SKU-106', barcode: '890100000106', category: 'Home', price: 600, stock: 74, threshold: 20, warehouse: 'Warehouse A', store: 'Central Flagship' },
];

const run = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    InventoryLog.deleteMany({}),
  ]);

  console.log('Seeding users...');
  const createdUsers = await User.create(demoUsers);

  console.log('Seeding products...');
  const createdProducts = await Product.create(demoProducts);

  console.log('Seeding a few sample orders...');
  const adminUser = createdUsers.find((u) => u.role === 'Admin');
  const sampleOrders = [
    { customer: 'Riya Mehta', productIdx: 0, qty: 2, payment: 'UPI', status: 'Completed' },
    { customer: 'Walk-in Customer', productIdx: 1, qty: 3, payment: 'Cash', status: 'Completed' },
    { customer: 'Online Shopper', productIdx: 2, qty: 1, payment: 'Card', status: 'Processing' },
  ];

  for (let i = 0; i < sampleOrders.length; i += 1) {
    const s = sampleOrders[i];
    const product = createdProducts[s.productIdx];
    const subtotal = product.price * s.qty;
    const gst = subtotal * 0.18;
    const discount = subtotal > 5000 ? subtotal * 0.05 : 0;
    const total = subtotal + gst - discount;

    await Order.create({
      orderNumber: `ORD-${9001 + i}`,
      customer: s.customer,
      items: [{ product: product._id, name: product.name, sku: product.sku, price: product.price, quantity: s.qty }],
      itemsCount: s.qty,
      subtotal,
      gst,
      discount,
      total,
      payment: s.payment,
      status: s.status,
      createdBy: adminUser._id,
      store: adminUser.store,
    });

    product.stock -= s.qty;
    product.sold += s.qty;
    product.revenue += product.price * s.qty;
    await product.save();
  }

  console.log('Seed complete!');
  console.log('Demo logins:');
  demoUsers.forEach((u) => console.log(`  ${u.role}: ${u.email} / ${u.password}`));

  process.exit(0);
};

run().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
