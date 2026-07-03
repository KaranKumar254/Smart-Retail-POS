
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const startOfWeek = (date) => {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday as start of week
  d.setDate(d.getDate() + diff);
  return d;
};
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const sumTotals = (orders) => orders.reduce((sum, o) => sum + o.total, 0);

// @route  GET /api/dashboard/stats
// @access Private
export const getStatCards = asyncHandler(async (req, res) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const [todayOrders, yesterdayOrders, allOrders, lowStockCount] = await Promise.all([
    Order.find({ createdAt: { $gte: todayStart } }),
    Order.find({ createdAt: { $gte: yesterdayStart, $lt: todayStart } }),
    Order.find(),
    Product.countDocuments({ $expr: { $lte: ['$stock', '$threshold'] } }),
  ]);

  const todaySales = sumTotals(todayOrders);
  const yesterdaySales = sumTotals(yesterdayOrders);
  const salesChange = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 : 0;

  const totalOrders = allOrders.length;
  const totalRevenue = sumTotals(allOrders);

  const statCards = [
    {
      title: "Today's Sales",
      value: Math.round(todaySales),
      change: `${salesChange >= 0 ? '+' : ''}${salesChange.toFixed(1)}%`,
      tone: 'blue',
    },
    { title: 'Total Orders', value: totalOrders, change: `${todayOrders.length} today`, tone: 'emerald' },
    { title: 'Revenue', value: Math.round(totalRevenue), change: '', tone: 'violet' },
    { title: 'Low Stock Alerts', value: lowStockCount, change: 'items', tone: 'amber' },
  ];

  res.status(200).json({ success: true, statCards });
});

// @route  GET /api/dashboard/revenue?months=8
// @access Private
export const getRevenueTrend = asyncHandler(async (req, res) => {
  const months = Number(req.query.months) || 8;
  const now = new Date();
  const result = [];

  for (let i = months - 1; i >= 0; i -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const orders = await Order.find({ createdAt: { $gte: monthDate, $lt: nextMonthDate } });
    const revenue = sumTotals(orders);

    result.push({
      month: monthDate.toLocaleString('en-US', { month: 'short' }),
      revenue: Math.round(revenue),
      target: Math.round(revenue * 0.85),
    });
  }

  res.status(200).json({ success: true, revenueData: result });
});

// @route  GET /api/dashboard/sales-channel
// @access Private
// Frontend has no real channel field on orders yet, so this groups by payment method
// as a stand-in "channel" split that still reflects real data.
export const getSalesChannelSplit = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  const total = orders.length || 1;
  const byPayment = orders.reduce((acc, o) => {
    acc[o.payment] = (acc[o.payment] || 0) + 1;
    return acc;
  }, {});

  const salesChannelData = Object.entries(byPayment).map(([name, count]) => ({
    name,
    value: Math.round((count / total) * 100),
  }));

  res.status(200).json({ success: true, salesChannelData });
});

// @route  GET /api/dashboard/report-highlights
// @access Private
export const getReportHighlights = asyncHandler(async (req, res) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const [dailyOrders, weeklyOrders, monthlyOrders, products] = await Promise.all([
    Order.find({ createdAt: { $gte: todayStart } }),
    Order.find({ createdAt: { $gte: weekStart } }),
    Order.find({ createdAt: { $gte: monthStart } }),
    Product.find(),
  ]);

  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const reportHighlights = [
    { label: 'Daily Sales', value: Math.round(sumTotals(dailyOrders)), delta: '' },
    { label: 'Weekly Revenue', value: Math.round(sumTotals(weeklyOrders)), delta: '' },
    { label: 'Monthly Revenue', value: Math.round(sumTotals(monthlyOrders)), delta: '' },
    { label: 'Inventory Value', value: Math.round(inventoryValue), delta: '' },
  ];

  res.status(200).json({ success: true, reportHighlights });
});
