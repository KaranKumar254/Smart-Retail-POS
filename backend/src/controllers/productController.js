import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @route  GET /api/products?search=&category=
// @access Private
export const getProducts = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = {};

  if (category && category !== 'All') {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { barcode: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: products.length, products });
});

// @route  GET /api/products/:id
// @access Private
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json({ success: true, product });
});

// @route  GET /api/products/barcode/:barcode
// @access Private
export const getProductByBarcode = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ barcode: req.params.barcode });
  if (!product) {
    res.status(404);
    throw new Error('No product matched the barcode input');
  }
  res.status(200).json({ success: true, product });
});

// @route  POST /api/products
// @access Private (Admin, Manager)
export const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, barcode, category, price, stock, description, threshold, warehouse, store } = req.body;

  if (!name || !sku || !barcode || !price) {
    res.status(400);
    throw new Error('Name, SKU, barcode and price are required');
  }

  const product = await Product.create({
    name,
    sku,
    barcode,
    category,
    price: Number(price),
    stock: Number(stock) || 0,
    threshold: threshold ? Number(threshold) : undefined,
    description,
    warehouse,
    store,
    revenue: 0,
    sold: 0,
  });

  res.status(201).json({ success: true, product });
});

// @route  PUT /api/products/:id
// @access Private (Admin, Manager)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updatable = ['name', 'sku', 'barcode', 'category', 'price', 'stock', 'description', 'threshold', 'warehouse', 'store'];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = ['price', 'stock', 'threshold'].includes(field) ? Number(req.body[field]) : req.body[field];
    }
  });

  await product.save();
  res.status(200).json({ success: true, product });
});

// @route  DELETE /api/products/:id
// @access Private (Admin, Manager)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted', id: req.params.id });
});

// @route  GET /api/products/top?limit=5
// @access Private
export const getTopProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const products = await Product.find().sort({ sold: -1 }).limit(limit);
  res.status(200).json({ success: true, products });
});
