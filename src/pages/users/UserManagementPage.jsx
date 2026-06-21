import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlinePencilSquare, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import DataTable from '@/components/common/DataTable';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/userService';

const roleTone = { Admin: 'violet', Manager: 'blue', Cashier: 'emerald' };

function UserManagementPage() {
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', email: '', password: '', role: 'Cashier', store: 'Central Flagship' });
    setOpen(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    reset({ name: user.name, email: user.email, role: user.role, store: user.store, password: '' });
    setOpen(true);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        const updated = await userService.update(editing.id, {
          name: values.name,
          role: values.role,
          store: values.store,
        });
        setUsers((prev) => prev.map((u) => (u.id === editing.id ? updated : u)));
        toast.success('Team member updated');
      } else {
        const created = await userService.create(values);
        setUsers((prev) => [created, ...prev]);
        toast.success('Team member created');
      }
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save team member');
    } finally {
      setSubmitting(false);
    }
  };

  const removeUser = async (id) => {
    try {
      await userService.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success('Team member removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove team member');
    }
  };

  const columns = [
    { key: 'name', title: 'Name', render: (_, row) => <div><p className="font-semibold text-slate-800">{row.name}</p><p className="text-xs text-slate-500">{row.email}</p></div> },
    { key: 'role', title: 'Role', render: (value) => <Badge tone={roleTone[value]}>{value}</Badge> },
    { key: 'store', title: 'Store' },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(row)} className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"><HiOutlinePencilSquare size={18} /></button>
          <button
            onClick={() => removeUser(row.id)}
            disabled={row.id === currentUser?.id}
            title={row.id === currentUser?.id ? "You can't remove your own account" : 'Remove'}
            className="rounded-xl bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HiOutlineTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-section">
      <PageHeader
        title="Team management"
        description="Create and manage Admin, Manager, and Cashier accounts for your stores. Only Admins can access this page."
        actions={<Button onClick={openCreate}><HiOutlinePlus className="mr-2" size={18} /> Add team member</Button>}
      />

      {loading ? (
        <div className="card-panel p-10 text-center text-sm text-slate-500">Loading team...</div>
      ) : (
        <DataTable columns={columns} data={users} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit team member' : 'Add team member'}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <Input label="Full name" {...register('name', { required: 'Required' })} error={errors.name?.message} />
          <Input label="Email" type="email" disabled={Boolean(editing)} {...register('email', { required: 'Required' })} error={errors.email?.message} />
          {!editing && (
            <Input label="Password" type="password" {...register('password', { required: 'Required', minLength: { value: 6, message: 'Minimum 6 characters' } })} error={errors.password?.message} />
          )}
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
              disabled={editing && editing.id === currentUser?.id}
              {...register('role')}
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Cashier</option>
            </select>
          </label>
          <Input label="Store" {...register('store')} />
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : editing ? 'Save changes' : 'Create account'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UserManagementPage;