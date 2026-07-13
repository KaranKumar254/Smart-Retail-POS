import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import InventoryLog from '../models/InventoryLog.js';

// @route  GET /api/inventory
// @access Private
// Shapes products into the { id, product, warehouse, stock, threshold, movement, store } rows InventoryPage.jsx expects
export const getInventory = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ stock: 1 });

  const items = await Promise.all(
    products.map(async (product) => {
      const lastLog = await InventoryLog.findOne({ product: product._id }).sort({ createdAt: -1 });
      return {
        id: product._id,
        productId: product._id,
        product: product.name,
        sku: product.sku,
        warehouse: product.warehouse,
        store: product.store,
        stock: product.stock,
        threshold: product.threshold,
        movement: lastLog ? `${lastLog.change > 0 ? '+' : ''}${lastLog.change}` : '0',
      };
    }),
  );

  res.status(200).json({ success: true, count: items.length, items });
});

// @route  GET /api/inventory/summary
// @access Private
export const getInventorySummary = asyncHandler(async (req, res) => {
  const products = await Product.find();
  const warehouses = new Set(products.map((p) => p.warehouse));
  const stores = new Set(products.map((p) => p.store));
  const lowStockCount = products.filter((p) => p.stock <= p.threshold).length;

  res.status(200).json({
    success: true,
    summary: {
      activeWarehouses: warehouses.size,
      lowStockCount,
      sellingChannels: stores.size,
    },
  });
});

// @route  PUT /api/inventory/:productId/stock
// @access Private (Admin, Manager)
// Body: { delta: number, reason?: string }  -- positive = stock in, negative = stock out
export const adjustStock = asyncHandler(async (req, res) => {
  const { delta, reason } = req.body;

  if (delta === undefined || Number.isNaN(Number(delta))) {
    res.status(400);
    throw new Error('A numeric delta is required (positive to add stock, negative to remove)');
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const newStock = product.stock + Number(delta);
  if (newStock < 0) {
    res.status(400);
    throw new Error('Stock cannot go below zero');
  }

  product.stock = newStock;
  await product.save();

  const log = await InventoryLog.create({
    product: product._id,
    warehouse: product.warehouse,
    store: product.store,
    change: Number(delta),
    reason: reason || (Number(delta) > 0 ? 'Stock in' : 'Stock out'),
    resultingStock: product.stock,
  });

  res.status(200).json({ success: true, product, log });
});

// @route  GET /api/inventory/:productId/logs
// @access Private
export const getInventoryLogs = asyncHandler(async (req, res) => {
  const logs = await InventoryLog.find({ product: req.params.productId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, logs });
});
