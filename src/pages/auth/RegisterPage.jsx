import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { role: 'Manager' },
  });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Could not create account');
    }
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">Smart Retail POS</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Create a team account</h2>
            <p className="mt-2 text-sm text-slate-500">Onboard admins, managers, and cashiers with role-based access.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <Input label="Full name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
            <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100" {...register('role')}>
                <option>Admin</option>
                <option>Manager</option>
                <option>Cashier</option>
              </select>
            </label>
            <Input label="Password" type="password" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
            <div className="md:col-span-2">
              <Button type="submit" className="w-full py-3" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create account'}</Button>
            </div>
          </form>
          <p className="text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-primary-600">Go to login</Link></p>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterPage;
