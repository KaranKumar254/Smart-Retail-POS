import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineCreditCard, HiOutlineMagnifyingGlass, HiOutlinePrinter, HiOutlineQrCode, HiOutlineTrash } from 'react-icons/hi2';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { usePOSStore } from '@/store/posStore';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';

const categories = ['All', 'Grocery', 'Beverages', 'Electronics', 'Fitness', 'Accessories', 'Home'];

function POSPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, paymentMethod, setPaymentMethod } = usePOSStore();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const products = await productService.getAll();
      setAllProducts(products);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const products = useMemo(() => allProducts.filter((item) => {
    const matchSearch = [item.name, item.barcode, item.sku].join(' ').toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || item.category === category;
    return matchSearch && matchCategory;
  }), [allProducts, search, category]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const discount = subtotal > 5000 ? subtotal * 0.05 : 0;
  const total = subtotal + gst - discount;

  const onBarcodeScan = async () => {
    try {
      const found = await productService.getByBarcode(search);
      addToCart({ ...found, id: found._id });
      toast.success(`${found.name} added via barcode`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No product matched the barcode input');
    }
  };

  const handleAddToCart = (product) => {
    addToCart({ ...product, id: product._id });
  };

  const generateInvoice = (order) => {
    const invoiceMarkup = `
      <html>
        <head><title>Smart Retail Invoice</title></head>
        <body style="font-family: Inter, Arial, sans-serif; padding: 24px; color: #0f172a;">
          <h1>Smart Retail POS Invoice</h1>
          <p>Order: ${order?.orderNumber || ''}</p>
          <p>Payment Method: ${paymentMethod}</p>
          <p>Subtotal: ${formatCurrency(subtotal)}</p>
          <p>GST: ${formatCurrency(gst)}</p>
          <p>Discount: ${formatCurrency(discount)}</p>
          <h2>Total: ${formatCurrency(total)}</h2>
          <hr />
          ${cart.map((item) => `<p>${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}</p>`).join('')}
        </body>
      </html>`;
    const blob = new Blob([invoiceMarkup], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart-retail-invoice.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReceipt = (order) => {
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) {
      toast.error('Please allow popups to print the receipt');
      return;
    }
    receiptWindow.document.write(`<html><head><title>Receipt</title></head><body><h2>Smart Retail POS Receipt</h2><p>Order: ${order?.orderNumber || ''}</p><p>Total: ${formatCurrency(total)}</p><p>Payment: ${paymentMethod}</p></body></html>`);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  // Persists the cart as a real order via the backend (decrements stock, logs inventory, returns order number)
  const completeSale = async ({ thenPrint, thenInvoice } = {}) => {
    if (cart.length === 0) {
      toast.error('Add at least one item to the cart first');
      return;
    }
    setCheckingOut(true);
    try {
      const order = await orderService.checkout({
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        payment: paymentMethod,
      });
      toast.success(`Sale completed: ${order.orderNumber}`);
      if (thenPrint) printReceipt(order);
      if (thenInvoice) generateInvoice(order);
      clearCart();
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  const paymentCards = [
    { label: 'Cash', icon: HiOutlineCreditCard },
    { label: 'Card', icon: HiOutlineCreditCard },
    { label: 'UPI', icon: HiOutlineQrCode },
  ];

  return (
    <div className="page-section">
      <PageHeader
        title="POS billing"
        description="A high-speed checkout screen for barcode search, basket management, and modern multi-method payments."
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.92fr]">
        <div className="space-y-5">
          <div className="card-panel p-4">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.6fr_auto]">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <HiOutlineMagnifyingGlass className="text-slate-400" size={18} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by product name, SKU, barcode" className="w-full bg-transparent text-sm outline-none" />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
              <Button variant="secondary" onClick={onBarcodeScan}>Scan barcode</Button>
            </div>
          </div>

          {loading ? (
            <div className="card-panel p-10 text-center text-sm text-slate-500">Loading products...</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {products.map((product) => (
                <button key={product._id} onClick={() => handleAddToCart(product)} className="card-panel group p-5 text-left transition hover:-translate-y-1">
                  <div className="mb-5 flex h-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-50 to-accent-50 text-3xl font-bold text-primary-600 group-hover:from-primary-100 group-hover:to-accent-100">
                    {product.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                  </div>
                  <Badge tone="blue">{product.category}</Badge>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{product.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{product.sku} • {product.barcode}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(product.price)}</p>
                    <Badge tone={product.stock < 20 ? 'amber' : 'emerald'}>{product.stock} in stock</Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card-panel flex h-fit flex-col p-5 xl:sticky xl:top-28">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Billing cart</h2>
              <p className="text-sm text-slate-500">{cart.length} unique items in cart</p>
            </div>
            <Button variant="ghost" onClick={clearCart}>Clear</Button>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {cart.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">Start scanning or clicking products to add them here.</div> : null}
            {cart.map((item) => (
              <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.sku}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="rounded-xl bg-white p-2 text-rose-500 shadow-sm"><HiOutlineTrash size={18} /></button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="text-lg font-bold text-slate-500">-</button>
                    <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="text-lg font-bold text-slate-500">+</button>
                  </div>
                  <p className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4 border-t border-slate-200 pt-5">
            <div className="grid grid-cols-3 gap-3">
              {paymentCards.map(({ label, icon: Icon }) => (
                <button key={label} onClick={() => setPaymentMethod(label)} className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${paymentMethod === label ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                  <Icon className="mx-auto mb-2" size={18} />
                  {label}
                </button>
              ))}
            </div>
            <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-slate-500"><span>GST (18%)</span><span>{formatCurrency(gst)}</span></div>
              <div className="flex justify-between text-sm text-slate-500"><span>Discount</span><span>- {formatCurrency(discount)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900"><span>Final Amount</span><span>{formatCurrency(total)}</span></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" onClick={() => completeSale({ thenPrint: true })} disabled={checkingOut}>
                <HiOutlinePrinter className="mr-2" size={18} /> {checkingOut ? 'Processing...' : 'Complete & Print'}
              </Button>
              <Button onClick={() => completeSale({ thenInvoice: true })} disabled={checkingOut}>
                {checkingOut ? 'Processing...' : 'Complete & Invoice'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default POSPage;
