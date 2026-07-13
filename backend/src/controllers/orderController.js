
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import InventoryLog from '../models/InventoryLog.js';

const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  return `ORD-${9000 + count + 1}`;
};

// @route  GET /api/orders
// @access Private
export const getOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.status = status;

  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @route  GET /api/orders/:id
// @access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.status(200).json({ success: true, order });
});

// @route  POST /api/orders/checkout
// @access Private
// Body: { items: [{ productId, quantity }], customer, payment }
// Mirrors POSPage.jsx pricing logic: subtotal -> 18% GST -> 5% discount if subtotal > 5000
export const checkoutOrder = asyncHandler(async (req, res) => {
  const { items, customer, payment } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Cart items are required to checkout');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of items) {
      const product = await Product.findById(cartItem.productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${cartItem.productId}`);
      }
      if (product.stock < cartItem.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }

      product.stock -= cartItem.quantity;
      product.sold += cartItem.quantity;
      product.revenue += product.price * cartItem.quantity;
      await product.save({ session });

      await InventoryLog.create(
        [
          {
            product: product._id,
            warehouse: product.warehouse,
            store: product.store,
            change: -cartItem.quantity,
            reason: 'POS sale',
            resultingStock: product.stock,
          },
        ],
        { session },
      );

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: cartItem.quantity,
      });

      subtotal += product.price * cartItem.quantity;
    }

    const gst = subtotal * 0.18;
    const discount = subtotal > 5000 ? subtotal * 0.05 : 0;
    const total = subtotal + gst - discount;
    const orderNumber = await generateOrderNumber();

    const [order] = await Order.create(
      [
        {
          orderNumber,
          customer: customer || 'Walk-in Customer',
          items: orderItems,
          itemsCount: orderItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal,
          gst,
          discount,
          total,
          payment: payment || 'Cash',
          status: 'Completed',
          createdBy: req.user._id,
          store: req.user.store,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400);
    throw error;
  }
});

// @route  PUT /api/orders/:id/status
// @access Private
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();

  res.status(200).json({ success: true, order });
});

// @route  GET /api/orders/recent?limit=5
// @access Private
export const getRecentTransactions = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const orders = await Order.find().sort({ createdAt: -1 }).limit(limit);
  res.status(200).json({ success: true, orders });
});
