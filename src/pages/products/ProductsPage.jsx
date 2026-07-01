import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlineFunnel, HiOutlineMagnifyingGlass, HiOutlinePencilSquare, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { productService } from '@/services/productService';

const categories = ['All', 'Grocery', 'Beverages', 'Electronics', 'Fitness', 'Accessories', 'Home'];

function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const products = await productService.getAll();
      setItems(products);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const bySearch = [item.name, item.sku, item.barcode].join(' ').toLowerCase().includes(search.toLowerCase());
    const byCategory = category === 'All' || item.category === category;
    return bySearch && byCategory;
  }), [items, search, category]);

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', sku: '', barcode: '', category: 'Grocery', price: '', stock: '', description: '' });
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset(item);
    setOpen(true);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
      };

      if (editing) {
        const updated = await productService.update(editing._id, payload);
        setItems((prev) => prev.map((item) => (item._id === editing._id ? updated : item)));
        toast.success('Product updated');
      } else {
        const created = await productService.create(payload);
        setItems((prev) => [created, ...prev]);
        toast.success('Product added');
      }
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save product');
    } finally {
      setSubmitting(false);
    }
  };

  const removeItem = async (id) => {
    try {
      await productService.remove(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete product');
    }
  };

  const columns = [
    { key: 'name', title: 'Product', render: (_, row) => <div><p className="font-semibold text-slate-800">{row.name}</p><p className="text-xs text-slate-500">{row.sku}</p></div> },
    { key: 'category', title: 'Category', render: (value) => <Badge tone="blue">{value}</Badge> },
    { key: 'price', title: 'Price', render: (value) => formatCurrency(value) },
    { key: 'stock', title: 'Stock', render: (value) => <Badge tone={value < 20 ? 'amber' : 'emerald'}>{value} units</Badge> },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(row)} className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"><HiOutlinePencilSquare size={18} /></button>
          <button onClick={() => removeItem(row._id)} className="rounded-xl bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"><HiOutlineTrash size={18} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-section">
      <PageHeader
        title="Product management"
        description="Manage catalog information, pricing, barcode data and stock visibility from a single premium product workspace."
        actions={<Button onClick={openCreate}><HiOutlinePlus className="mr-2" size={18} /> Add product</Button>}
      />

      <div className="card-panel p-4">
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <HiOutlineMagnifyingGlass className="text-slate-400" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, SKU, barcode" className="w-full bg-transparent text-sm outline-none" />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <HiOutlineFunnel className="text-slate-400" size={18} />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent text-sm outline-none">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">{filtered.length} products</div>
        </div>
      </div>

      {loading ? (
        <div className="card-panel p-10 text-center text-sm text-slate-500">Loading products...</div>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit product' : 'Add product'}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <Input label="Product name" {...register('name', { required: 'Required' })} error={errors.name?.message} />
          <Input label="SKU" {...register('sku', { required: 'Required' })} error={errors.sku?.message} />
          <Input label="Barcode" {...register('barcode', { required: 'Required' })} error={errors.barcode?.message} />
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100" {...register('category')}>
              {categories.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <Input label="Price" type="number" {...register('price', { required: 'Required' })} error={errors.price?.message} />
          <Input label="Stock quantity" type="number" {...register('stock', { required: 'Required' })} error={errors.stock?.message} />
          <div className="md:col-span-2">
            <Input label="Description" {...register('description')} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : editing ? 'Save changes' : 'Create product'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProductsPage;
